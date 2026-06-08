import { useTranslation } from 'react-i18next';
import { ContentGrid } from '@/widgets/content-grid';
import { ContentSearchFilter } from '@/features/content-discovery/ui/ContentSearchFilter';
import { ContentSort } from '@/features/content-discovery/ui/ContentSort';
import './ContentPage.scss';

export const ContentPage = () => {
  const { t } = useTranslation();

  return (
    <div className="content-page">
      <h1>{t('content.title')}</h1>
      <p className="content-page__desc">
        {t('content.description')}
      </p>
      <ContentSearchFilter />
      <div className="content-page__toolbar">
        <ContentSort />
      </div>
      <ContentGrid />
    </div>
  );
};
