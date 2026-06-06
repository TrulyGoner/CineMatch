import './WhyRecommended.scss';
export const WhyRecommended = ({ reasons }) => (React.createElement("div", { className: "why-recommended" }, reasons.map((reason) => (React.createElement("span", { key: reason, className: "why-recommended__tag" }, reason)))));
