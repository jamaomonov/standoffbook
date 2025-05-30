import React from 'react';
import { useTranslation } from 'react-i18next';

interface WeaponDamageInfo {
  arms: number;
  head: number;
  legs: number;
  chest: number;
  stomach: number;
}

interface WeaponDamage {
  armor: WeaponDamageInfo;
  no_armor: WeaponDamageInfo;
}

interface DamageStatsProps {
  damageInfo: WeaponDamage;
}

const DamageStats: React.FC<DamageStatsProps> = ({ damageInfo }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-lg md:text-xl font-bold text-[#8a92a1] mb-3 md:mb-4">{t('damage.title')}</h2>

      {/* Desktop view (hidden on mobile) */}
      <div className="hidden md:block">
        <div className="bg-[#171923] rounded-xl p-6">
          <div className="flex">
            {/* Column with body part labels */}
            <div className="w-1/5">
              <div className="h-16 flex items-center">
                <div className="text-[#8a92a1] text-lg lg:text-xl">{t('damage.head')}</div>
              </div>
              <div className="h-16 flex items-center">
                <div className="text-[#8a92a1] text-lg lg:text-xl">{t('damage.chest_arm')}</div>
              </div>
              <div className="h-16 flex items-center">
                <div className="text-[#8a92a1] text-lg lg:text-xl">{t('damage.stomach')}</div>
              </div>
              <div className="h-16 flex items-center">
                <div className="text-[#8a92a1] text-lg lg:text-xl">{t('damage.legs')}</div>
              </div>
            </div>

            {/* Unarmored mannequin column */}
            <div className="w-2/5 relative flex justify-center">
              <img
                src="/src/assets/mannequin.svg"
                alt="Unarmored mannequin"
                className="h-64 opacity-40 absolute"
              />

              {/* Unarmored damage values */}
              <div className="w-full pl-12 pr-4">
                <div className="h-16 flex items-center justify-end">
                  <div className="text-xl lg:text-2xl font-semibold text-[#ff5757]">
                    {damageInfo.no_armor.head}
                  </div>
                </div>
                <div className="h-16 flex items-center justify-end">
                  <div className="text-xl lg:text-2xl font-semibold text-white">
                    {damageInfo.no_armor.chest}
                  </div>
                </div>
                <div className="h-16 flex items-center justify-end">
                  <div className="text-xl lg:text-2xl font-semibold text-white">
                    {damageInfo.no_armor.stomach}
                  </div>
                </div>
                <div className="h-16 flex items-center justify-end">
                  <div className="text-xl lg:text-2xl font-semibold text-white">
                    {damageInfo.no_armor.legs}
                  </div>
                </div>
              </div>
            </div>

            {/* Armored mannequin column */}
            <div className="w-2/5 relative flex justify-center">
              <img
                src="/src/assets/mannequinWithArmor.svg"
                alt="Armored mannequin"
                className="h-64 opacity-40 absolute"
              />

              {/* Armored damage values */}
              <div className="w-full pl-12 pr-4">
                <div className="h-16 flex items-center justify-end">
                  <div className="text-xl lg:text-2xl font-semibold text-[#ff5757]">
                    {damageInfo.armor.head}
                  </div>
                </div>
                <div className="h-16 flex items-center justify-end">
                  <div className="text-xl lg:text-2xl font-semibold text-white">
                    {damageInfo.armor.chest}
                  </div>
                </div>
                <div className="h-16 flex items-center justify-end">
                  <div className="text-xl lg:text-2xl font-semibold text-white">
                    {damageInfo.armor.stomach}
                  </div>
                </div>
                <div className="h-16 flex items-center justify-end">
                  <div className="text-xl lg:text-2xl font-semibold text-white">
                    {damageInfo.armor.legs}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile view - exactly like in the screenshot */}
      <div className="block md:hidden">
        <div className="bg-[#171923] rounded-xl p-4">
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1 - Head */}
            <div className="flex items-center col-span-2">
              <div className="text-[#8a92a1] text-base">{t('damage.head')}</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-xl font-semibold text-[#ff5757]">
                {damageInfo.no_armor.head}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-xl font-semibold text-[#ff5757]">
                {damageInfo.armor.head}
              </div>
            </div>

            {/* Row 2 - Chest/Arm */}
            <div className="flex items-center col-span-2">
              <div className="text-[#8a92a1] text-base">{t('damage.chest_arm')}</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-xl font-semibold text-white">
                {damageInfo.no_armor.chest}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-xl font-semibold text-white">
                {damageInfo.armor.chest}
              </div>
            </div>

            {/* Row 3 - Stomach */}
            <div className="flex items-center col-span-2">
              <div className="text-[#8a92a1] text-base">{t('damage.stomach')}</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-xl font-semibold text-white">
                {damageInfo.no_armor.stomach}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-xl font-semibold text-white">
                {damageInfo.armor.stomach}
              </div>
            </div>

            {/* Row 4 - Legs */}
            <div className="flex items-center col-span-2">
              <div className="text-[#8a92a1] text-base">{t('damage.legs')}</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-xl font-semibold text-white">
                {damageInfo.no_armor.legs}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-xl font-semibold text-white">
                {damageInfo.armor.legs}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamageStats;
