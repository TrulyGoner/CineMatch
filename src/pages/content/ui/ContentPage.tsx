import { ContentGrid } from '@/widgets/content-grid';
import { ContentSearchFilter } from '@/features/content-discovery/ui/ContentSearchFilter';
import './ContentPage.scss';

export const ContentPage = () => (
  <div className="content-page">
    <h1>Каталог</h1>
    <p className="content-page__desc">
      Всё, что попало в твою ленту. Нажми на карточку — откроется описание и детали.
    </p>
    <ContentSearchFilter />
    <ContentGrid />
  </div>
);
