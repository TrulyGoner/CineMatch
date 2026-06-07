import { useState, useEffect } from 'react';
const RECENT_KEY = 'recent_views';
export const useRecentViews = (catalog, limit = 8) => {
    const [items, setItems] = useState([]);
    useEffect(() => {
        try {
            const raw = localStorage.getItem(RECENT_KEY);
            if (!raw) {
                setItems([]);
                return;
            }
            const entries = JSON.parse(raw);
            const map = new Map();
            catalog.forEach((c) => map.set(`${c.mediaType}-${c.id}`, c));
            const result = [];
            for (const e of entries) {
                const key = `${e.mediaType}-${e.id}`;
                const content = map.get(key);
                if (content) {
                    result.push(content);
                    if (result.length >= limit)
                        break;
                }
            }
            setItems(result);
        }
        catch {
            setItems([]);
        }
    }, [catalog, limit]);
    return items;
};
