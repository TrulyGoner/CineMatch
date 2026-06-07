import { useState } from 'react';
import { getContentPosterUrl } from '@/shared/lib/tmdbImages';
import './ContentPoster.scss';
export const ContentPoster = ({ title, posterPath, backdropPath, className = '', }) => {
    const [failed, setFailed] = useState(false);
    const url = getContentPosterUrl(posterPath, backdropPath);
    if (!url || failed) {
        return (React.createElement("div", { className: `content-poster content-poster--placeholder ${className}`.trim() }, title.charAt(0)));
    }
    return (React.createElement("img", { className: `content-poster ${className}`.trim(), src: url, alt: title, loading: "lazy", decoding: "async", referrerPolicy: "no-referrer", onError: () => setFailed(true) }));
};
