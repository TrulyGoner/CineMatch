import { UserDashboard } from '@/widgets/user-dashboard';
import './DashboardPage.scss';

const DashboardPage = () => (
  <div className="dashboard-page">
    <h1>Дашборд поведения</h1>
    <p className="dashboard-page__desc">
      Аналитика в реальном времени: клики, просмотры и оценка персонализации.
    </p>
    <UserDashboard />
  </div>
);

export default DashboardPage;
