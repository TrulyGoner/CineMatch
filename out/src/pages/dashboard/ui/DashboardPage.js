import { useTranslation } from 'react-i18next';
import { UserDashboard } from '@/widgets/user-dashboard';
import './DashboardPage.scss';
const DashboardPage = () => {
    const { t } = useTranslation();
    return (React.createElement("div", { className: "dashboard-page" },
        React.createElement("h1", null, t('dashboard.title')),
        React.createElement("p", { className: "dashboard-page__desc" }, t('dashboard.description')),
        React.createElement(UserDashboard, null)));
};
export default DashboardPage;
