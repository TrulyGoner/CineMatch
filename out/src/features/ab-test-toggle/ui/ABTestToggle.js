import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { toggleMode, selectABTestMode } from '../model/store';
import './ABTestToggle.scss';
export const ABTestToggle = () => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector(selectABTestMode);
    const { t } = useTranslation();
    return (React.createElement("div", { className: "ab-test-toggle" },
        React.createElement("span", { className: "ab-test-toggle__label" }, t('abTest.label')),
        React.createElement("button", { type: "button", className: `ab-test-toggle__switch ${mode === 'random' ? 'ab-test-toggle__switch--b' : ''}`, onClick: () => dispatch(toggleMode()), "aria-label": t('abTest.aria') },
            React.createElement("span", { className: "ab-test-toggle__thumb" })),
        React.createElement("span", { className: "ab-test-toggle__mode" }, mode === 'personalized' ? t('abTest.modeA') : t('abTest.modeB'))));
};
