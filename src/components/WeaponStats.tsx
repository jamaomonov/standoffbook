import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type PatternType = 'spray' | 'recoil';

const WeaponStats: React.FC = () => {
  const { t } = useTranslation();
  const [activePattern, setActivePattern] = useState<PatternType>('spray');

  return (
    <div className="mb-6 md:mb-8">
      {/* Shooting pattern section */}
      <div>
        <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">{t('shootingPattern.title')}</h2>
        <div className="rounded-xl overflow-hidden">
          {/* Toggle buttons */}
          <div className="grid grid-cols-2 text-center">
            <button
              className={`py-3 md:py-4 px-3 md:px-6 text-sm md:text-base ${activePattern === 'spray' ? 'text-white bg-indigo-700' : 'text-csm-text-secondary bg-indigo-900'}`}
              onClick={() => setActivePattern('spray')}
              aria-pressed={activePattern === 'spray'}
            >
              {t('shootingPattern.spray')}
            </button>
            <button
              className={`py-3 md:py-4 px-3 md:px-6 text-sm md:text-base ${activePattern === 'recoil' ? 'text-white bg-indigo-700' : 'text-csm-text-secondary bg-indigo-900'}`}
              onClick={() => setActivePattern('recoil')}
              aria-pressed={activePattern === 'recoil'}
            >
              {t('shootingPattern.recoil_control')}
            </button>
          </div>

          {/* Pattern display */}
          <div className="bg-csm-bg-card p-4 md:p-6 min-h-[240px] md:min-h-[300px] lg:min-h-[450px] flex items-center justify-center">
            <img
              src={activePattern === 'spray' ? '/src/assets/ak47-spray.svg' : '/src/assets/ak47-recoil.svg'}
              alt={activePattern === 'spray' ? 'Spray pattern' : 'Recoil control pattern'}
              className="max-h-[200px] md:max-h-[250px] lg:max-h-[400px] w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeaponStats;
