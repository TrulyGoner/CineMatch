import { useAppDispatch, useAppSelector } from '@/app/store';
import { toggleMode, selectABTestMode } from '../model/store';
import './ABTestToggle.scss';
export const ABTestToggle = () => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector(selectABTestMode);
    return (React.createElement("div", { className: "ab-test-toggle" },
        React.createElement("span", { className: "ab-test-toggle__label" }, "A/B \u0442\u0435\u0441\u0442"),
        React.createElement("button", { type: "button", className: `ab-test-toggle__switch ${mode === 'random' ? 'ab-test-toggle__switch--b' : ''}`, onClick: () => dispatch(toggleMode()), "aria-label": "\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0440\u0435\u0436\u0438\u043C A/B \u0442\u0435\u0441\u0442\u0430" },
            React.createElement("span", { className: "ab-test-toggle__thumb" })),
        React.createElement("span", { className: "ab-test-toggle__mode" }, mode === 'personalized' ? 'A: Персонализация' : 'B: Случайные')));
};
