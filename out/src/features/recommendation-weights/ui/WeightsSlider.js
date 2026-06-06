import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setWeight, resetWeights, selectWeights, } from '../model/store';
import { Button } from '@/shared/ui/Button';
import './WeightsSlider.scss';
const LABELS = {
    genre: 'Жанр',
    freshness: 'Актуальность',
    popularity: 'Популярность',
};
export const WeightsSlider = () => {
    const dispatch = useAppDispatch();
    const weights = useAppSelector(selectWeights);
    const handleChange = useCallback((key, value) => {
        dispatch(setWeight({ key, value }));
    }, [dispatch]);
    return (React.createElement("div", { className: "weights-slider" },
        React.createElement("div", { className: "weights-slider__header" },
            React.createElement("h3", null, "\u0412\u0435\u0441\u0430 \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0439"),
            React.createElement(Button, { variant: "ghost", size: "sm", onClick: () => dispatch(resetWeights()) }, "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C")),
        Object.keys(LABELS).map((key) => (React.createElement("label", { key: key, className: "weights-slider__row" },
            React.createElement("span", { className: "weights-slider__label" },
                LABELS[key],
                " ",
                React.createElement("strong", null, weights[key])),
            React.createElement("input", { type: "range", min: 0, max: 100, value: weights[key], onChange: (e) => handleChange(key, Number(e.target.value)), className: "weights-slider__input" }))))));
};
