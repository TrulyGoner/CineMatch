import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setLocale, selectLocale } from '@/features/language/model/store';
import './LanguageSwitcher.scss';
const LOCALES = ['ru', 'en'];
export const LanguageSwitcher = () => {
    const { t } = useTranslation();
    const currentLocale = useAppSelector(selectLocale);
    const dispatch = useAppDispatch();
    return (React.createElement("div", { className: "language-switcher" }, LOCALES.map((loc) => (React.createElement("button", { key: loc, className: `language-switcher__btn ${loc === currentLocale ? 'language-switcher__btn--active' : ''}`, onClick: () => dispatch(setLocale(loc)), "aria-label": t(`language.${loc}`) }, loc.toUpperCase())))));
};
