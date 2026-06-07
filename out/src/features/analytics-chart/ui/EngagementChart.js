import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, } from 'recharts';
import './EngagementChart.scss';
export const EngagementChart = ({ data }) => {
    const { t } = useTranslation();
    return (React.createElement("div", { className: "engagement-chart" },
        React.createElement("h3", { className: "engagement-chart__title" }, t('chart.engagementTitle')),
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
                React.createElement(Line, { type: "monotone", dataKey: "clicks", name: t('chart.clicks'), stroke: "#6c8cff", strokeWidth: 2, dot: { r: 3 } }),
                React.createElement(Line, { type: "monotone", dataKey: "views", name: t('chart.views'), stroke: "#ff6b9d", strokeWidth: 2, dot: { r: 3 } })))));
};
