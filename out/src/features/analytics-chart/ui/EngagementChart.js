import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, } from 'recharts';
import './EngagementChart.scss';
export const EngagementChart = ({ data }) => (React.createElement("div", { className: "engagement-chart" },
    React.createElement("h3", { className: "engagement-chart__title" }, "\u0412\u043E\u0432\u043B\u0435\u0447\u0451\u043D\u043D\u043E\u0441\u0442\u044C \u043F\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438"),
    React.createElement(ResponsiveContainer, { width: "100%", height: 260 },
        React.createElement(LineChart, { data: data },
            React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#2e3344" }),
            React.createElement(XAxis, { dataKey: "time", stroke: "#9aa3b5", fontSize: 12 }),
            React.createElement(YAxis, { stroke: "#9aa3b5", fontSize: 12, allowDecimals: false }),
            React.createElement(Tooltip, { contentStyle: {
                    background: '#1a1d27',
                    border: '1px solid #2e3344',
                    borderRadius: 8,
                } }),
            React.createElement(Legend, null),
            React.createElement(Line, { type: "monotone", dataKey: "clicks", name: "\u041A\u043B\u0438\u043A\u0438", stroke: "#6c8cff", strokeWidth: 2, dot: { r: 3 } }),
            React.createElement(Line, { type: "monotone", dataKey: "views", name: "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u044B", stroke: "#ff6b9d", strokeWidth: 2, dot: { r: 3 } })))));
