import { useTranslation } from 'react-i18next';
import { ExplorerMode, useExplorer } from '@/features/explorer';
import './ExplorerPage.scss';

const ExplorerPage = () => {
  const { t } = useTranslation();
  const { current, nextItems, queueSize, completed, seenCount, makeDecision, onReset } = useExplorer();

  return (
    <div className="explorer-page">
      <div className="explorer-page__header">
        <h1 className="explorer-page__title">{t('explorer.title')}</h1>
        <p className="explorer-page__desc">{t('explorer.description')}</p>
      </div>
      <ExplorerMode
        current={current}
        nextItems={nextItems}
        queueSize={queueSize}
        completed={completed}
        seenCount={seenCount}
        makeDecision={makeDecision}
        onReset={onReset}
      />
    </div>
  );
};

export default ExplorerPage;
