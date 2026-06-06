import './ContentHeatmap.scss';
export const ContentHeatmap = ({ data }) => (React.createElement("div", { className: "content-heatmap" },
    React.createElement("h3", { className: "content-heatmap__title" }, "\u0422\u0435\u043F\u043B\u043E\u0432\u0430\u044F \u043A\u0430\u0440\u0442\u0430 \u0436\u0430\u043D\u0440\u043E\u0432"),
    data.length === 0 ? (React.createElement("p", { className: "content-heatmap__empty" }, "\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u2014 \u043A\u043B\u0438\u043A\u043D\u0438\u0442\u0435 \u043F\u043E \u043A\u043E\u043D\u0442\u0435\u043D\u0442\u0443")) : (React.createElement("div", { className: "content-heatmap__grid" }, data.map((cell) => (React.createElement("div", { key: cell.genre, className: "content-heatmap__cell", style: { opacity: 0.3 + cell.intensity * 0.7 }, title: `${cell.genre}: ${cell.count}` },
        React.createElement("span", { className: "content-heatmap__genre" }, cell.genre),
        React.createElement("span", { className: "content-heatmap__count" }, cell.count))))))));
