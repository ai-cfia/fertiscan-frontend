import { useContext } from 'react';
import './SettingPage.css';
import { useTranslation } from 'react-i18next';
import LanguageButton from '../../Components/LanguageButton/LanguageButton';
import { ThemeContext } from '../../ThemeContext'; 

function SettingPage() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext);


  return (
    <div className="${theme}">
      <h1>{t('settingH1')}</h1>

      <div className="settings">
        <label>{t('languageLabel')} : </label>
        <LanguageButton  />
      </div>
      <div className="settings">
        <button onClick={toggleTheme}>
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
      </div>
    </div>
  );
}

export default SettingPage;
