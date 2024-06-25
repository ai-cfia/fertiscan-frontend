import { useEffect } from 'react';
import './SettingPage.css';
import { useTranslation } from 'react-i18next';
import LanguageButton from '../../Components/LanguageButton/LanguageButton';

function SettingPage() {
  const { t, i18n } = useTranslation();


  return (
    <div>
      <h1>{t('settingH1')}</h1>

      <div className="settings">
        <label>{t('languageLabel')} : </label>
        <LanguageButton  />
      </div>
    </div>
  );
}

export default SettingPage;
