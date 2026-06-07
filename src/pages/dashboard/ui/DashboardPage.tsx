import { useTranslation } from 'react-i18next';
import { UserDashboard } from '@/widgets/user-dashboard';
import './DashboardPage.scss';

const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard-page">
      <h1>{t('dashboard.title')}</h1>
      <p className="dashboard-page__desc">
        {t('dashboard.description')}
      </p>
      <UserDashboard />
    </div>
  );
};

export default DashboardPage;
