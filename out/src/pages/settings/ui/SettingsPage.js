import { useTranslation } from 'react-i18next';
import { WeightsSlider } from '@/features/recommendation-weights';
import { ABTestToggle } from '@/features/ab-test-toggle';
import { useAppDispatch } from '@/app/store';
import { clearEvents } from '@/features/user-behavior-tracking/model/store';
import { Button } from '@/shared/ui/Button';
import './SettingsPage.scss';
export const SettingsPage = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    return (React.createElement("div", { className: "settings-page" },
        React.createElement("h1", null, t('settings.title')),
        React.createElement("div", { className: "settings-page__grid" },
            React.createElement(WeightsSlider, null),
            React.createElement("div", { className: "settings-page__card" },
                React.createElement("h3", null, t('settings.abTest')),
                React.createElement("p", { className: "settings-page__hint" }, t('settings.abTestHint')),
                React.createElement(ABTestToggle, null)),
            React.createElement("div", { className: "settings-page__card" },
                React.createElement("h3", null, t('settings.behaviorData')),
                React.createElement("p", { className: "settings-page__hint" }, t('settings.behaviorHint')),
                React.createElement(Button, { variant: "secondary", onClick: () => dispatch(clearEvents()) }, t('settings.clearHistory'))))));
};
