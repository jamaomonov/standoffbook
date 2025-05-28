import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uz', name: 'O\'zbekcha', flag: '🇺🇿' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getCurrentLanguage = (): Language => {
    return languages.find(lang => lang.code === i18n.language) || languages[0];
  };

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        className="flex items-center bg-transparent text-white hover:bg-csm-blue-primary px-3 py-1 rounded"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Language selector"
      >
        <span className="mr-1">{getCurrentLanguage().flag}</span>
        <span className="mr-1">{getCurrentLanguage().code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="language-dropdown absolute right-0 mt-2 bg-csm-bg-card rounded shadow-lg z-50 min-w-[150px] max-w-[calc(100vw-2rem)]">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`block w-full text-left px-4 py-3 hover:bg-csm-blue-primary transition-colors
                       ${language.code === i18n.language ? 'bg-csm-bg-lighter' : ''}
                     `}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="inline-block w-6 mr-2">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
