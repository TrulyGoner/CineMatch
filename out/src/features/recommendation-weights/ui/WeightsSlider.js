import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setWeight, resetWeights, savePreset, applyPreset, deletePreset, selectWeights, selectPresets, } from '../model/store';
import { Button } from '@/shared/ui/Button';
import './WeightsSlider.scss';
const buildLabels = (t) => ({
    genre: t('weights.genre'),
    freshness: t('weights.freshness'),
    popularity: t('weights.popularity'),
});
export const WeightsSlider = () => {
    const dispatch = useAppDispatch();
    const weights = useAppSelector(selectWeights);
    const presets = useAppSelector(selectPresets);
    const { t } = useTranslation();
    const LABELS = buildLabels(t);
    const [presetName, setPresetName] = useState('');
    const inputRef = useRef(null);
    const handleChange = useCallback((key, value) => {
        dispatch(setWeight({ key, value }));
    }, [dispatch]);
    const handleSavePreset = useCallback(() => {
        const name = presetName.trim();
        if (!name)
            return;
        dispatch(savePreset({ name }));
        setPresetName('');
    }, [dispatch, presetName]);
    const handleApplyPreset = useCallback((name) => {
        dispatch(applyPreset({ name }));
    }, [dispatch]);
    const handleDeletePreset = useCallback((name) => {
        dispatch(deletePreset({ name }));
    }, [dispatch]);
    return (React.createElement("div", { className: "weights-slider" },
        React.createElement("div", { className: "weights-slider__header" },
            React.createElement("h3", null, t('weights.title')),
            React.createElement(Button, { variant: "ghost", size: "sm", onClick: () => dispatch(resetWeights()) }, t('weights.reset'))),
        Object.keys(LABELS).map((key) => (React.createElement("label", { key: key, className: "weights-slider__row" },
            React.createElement("span", { className: "weights-slider__label" },
                LABELS[key],
                " ",
                React.createElement("strong", null, weights[key])),
            React.createElement("input", { type: "range", min: 0, max: 100, value: weights[key], onChange: (e) => handleChange(key, Number(e.target.value)), className: "weights-slider__input" })))),
        React.createElement("div", { className: "weights-slider__presets" },
            React.createElement("h4", null, t('presets.title')),
            React.createElement("div", { className: "weights-slider__preset-form" },
                React.createElement("input", { ref: inputRef, type: "text", className: "weights-slider__preset-input", placeholder: t('presets.namePlaceholder'), value: presetName, onChange: (e) => setPresetName(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter')
                        handleSavePreset(); } }),
                React.createElement(Button, { variant: "primary", size: "sm", onClick: handleSavePreset, disabled: !presetName.trim() }, t('presets.save'))),
            presets.length > 0 && (React.createElement("ul", { className: "weights-slider__preset-list" }, presets.map((p) => (React.createElement("li", { key: p.name, className: "weights-slider__preset-item" },
                React.createElement("span", { className: "weights-slider__preset-name" }, p.name),
                React.createElement("div", { className: "weights-slider__preset-actions" },
                    React.createElement(Button, { variant: "ghost", size: "sm", onClick: () => handleApplyPreset(p.name) }, t('presets.apply')),
                    React.createElement(Button, { variant: "ghost", size: "sm", onClick: () => handleDeletePreset(p.name) }, t('presets.delete')))))))))));
};
