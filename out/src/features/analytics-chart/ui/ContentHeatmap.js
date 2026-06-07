import { useTranslation } from 'react-i18next';
import './ContentHeatmap.scss';
export const ContentHeatmap = ({ data }) => {
    const { t } = useTranslation();
    return (React.createElement("div", { className: "content-heatmap" },
        React.createElement("h3", { className: "content-heatmap__title" }, t('chart.heatmapTitle')),
        data.length === 0 ? (React.createElement("p", { className: "content-heatmap__empty" }, t('chart.heatmapEmpty'))) : (React.createElement("div", { className: "content-heatmap__grid" }, data.map((cell) => (React.createElement("div", { key: cell.genre, className: "content-heatmap__cell", style: { opacity: 0.3 + cell.intensity * 0.7 }, title: `${cell.genre}: ${cell.count}` },
            React.createElement("span", { className: "content-heatmap__genre" }, cell.genre),
            React.createElement("span", { className: "content-heatmap__count" }, cell.count))))))));
};
