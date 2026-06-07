import { useTranslation } from 'react-i18next';
import { ContentGrid } from '@/widgets/content-grid';
import { ContentSearchFilter } from '@/features/content-discovery/ui/ContentSearchFilter';
import './ContentPage.scss';
export const ContentPage = () => {
    const { t } = useTranslation();
    return (React.createElement("div", { className: "content-page" },
        React.createElement("h1", null, t('content.title')),
        React.createElement("p", { className: "content-page__desc" }, t('content.description')),
        React.createElement(ContentSearchFilter, null),
        React.createElement(ContentGrid, null)));
};
