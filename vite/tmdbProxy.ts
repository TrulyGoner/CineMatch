import dns from 'node:dns';
import https from 'node:https';
import type { LookupOptions } from 'node:dns';
import type { ProxyOptions } from 'vite';

/** Домены TMDB, часто заблокированные через hosts → 127.0.0.1 */
const TMDB_HOSTS = new Set(['api.themoviedb.org', 'image.tmdb.org', 'www.themoviedb.org']);

const publicDns = new dns.Resolver();
publicDns.setServers(['1.1.1.1', '8.8.8.8']);

type LookupAllCallback = (
  err: NodeJS.ErrnoException | null,
  addresses: dns.LookupAddress[]
) => void;

type LookupOneCallback = (
  err: NodeJS.ErrnoException | null,
  address: string,
  family: number
) => void;

const resolveTmdbIpv4 = (hostname: string): Promise<string | null> =>
  new Promise((resolve) => {
    publicDns.resolve4(hostname, (err, addresses) => {
      if (err) {
        resolve(null);
        return;
      }

      const valid = addresses.filter((ip) => ip && ip !== '127.0.0.1');
      resolve(valid[0] ?? null);
    });
  });

/**
 * Обход блокировки TMDB в hosts: resolve4 идёт к публичному DNS,
 * минуя запись 127.0.0.1 в hosts.
 */
const tmdbLookup: typeof dns.lookup = (
  hostname,
  options,
  callback?
): void => {
  let opts: LookupOptions;
  let cb: LookupOneCallback | LookupAllCallback;

  if (typeof options === 'function') {
    cb = options;
    opts = {};
  } else {
    cb = callback as LookupOneCallback | LookupAllCallback;
    opts = options ?? {};
  }

  const deliver = (err: NodeJS.ErrnoException | null, ip: string | null): void => {
    if (err || !ip) {
      const resolveErr =
        err ??
        Object.assign(new Error(`Failed to resolve ${hostname}`), {
          code: 'ENOTFOUND',
        });
      cb(resolveErr);
      return;
    }

    if (opts.all) {
      (cb as LookupAllCallback)(null, [{ address: ip, family: 4 }]);
      return;
    }

    (cb as LookupOneCallback)(null, ip, 4);
  };

  if (!TMDB_HOSTS.has(hostname)) {
    dns.lookup(hostname, opts, cb);
    return;
  }

  void resolveTmdbIpv4(hostname).then((ip) => {
    if (ip) {
      deliver(null, ip);
      return;
    }
    dns.lookup(hostname, opts, cb);
  });
};

export const tmdbHttpsAgent = new https.Agent({
  lookup: tmdbLookup,
  keepAlive: true,
});

export const createTmdbProxy = (target: string, stripPrefix: string): ProxyOptions => ({
  target,
  changeOrigin: true,
  secure: true,
  agent: tmdbHttpsAgent,
  rewrite: (requestPath) => requestPath.replace(new RegExp(`^${stripPrefix}`), ''),
});
