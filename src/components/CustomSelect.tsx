import React, { useState, useRef, useEffect } from 'react';

interface Option {
  name: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.name === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-csm-bg-dark text-csm-text-primary py-2 px-3 rounded border border-csm-border focus:outline-none focus:ring-1 focus:ring-csm-blue-accent flex items-center justify-between"
      >
        <span className={selectedOption ? 'text-csm-text-primary' : 'text-csm-text-muted'}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-csm-bg-dark border border-csm-border rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            <button
              className={`w-full text-left px-4 py-2 hover:bg-csm-bg-lighter transition-colors ${
                !value ? 'text-csm-blue-accent' : 'text-csm-text-muted'
              }`}
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
            >
              {placeholder}
            </button>
            {options.map((option) => (
              <button
                key={option.name}
                className={`w-full text-left px-4 py-2 hover:bg-csm-bg-lighter transition-colors ${
                  option.name === value ? 'text-csm-blue-accent' : 'text-csm-text-primary'
                }`}
                onClick={() => {
                  onChange(option.name);
                  setIsOpen(false);
                }}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect; 