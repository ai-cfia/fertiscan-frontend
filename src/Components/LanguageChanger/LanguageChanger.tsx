import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';

const LanguageSwitcherButton = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en'); 

  const handleChangeLanguage = (newLang: string | undefined) => { 
    setSelectedLanguage(newLang ?? 'en'); 
    i18n.changeLanguage(newLang ?? 'en'); 
  };

  return (
    <Button
      variant="primary"
      onClick={() => handleChangeLanguage(selectedLanguage === 'en' ? 'fr' : 'en')}
    >
      {t(selectedLanguage)}
    </Button>
  );
};

export default LanguageSwitcherButton;
