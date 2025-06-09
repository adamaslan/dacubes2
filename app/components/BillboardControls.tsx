import React, { useState } from 'react';

// Type definitions for better TypeScript support
type BillboardMode = 'neon' | 'retro' | 'cyberpunk' | 'minimal' | 'glitch';
type BackgroundEffect = 'particles' | 'waves' | 'matrix' | 'stars' | 'none';

interface BillboardControlsProps {
  billboardMode?: BillboardMode;
  setBillboardMode?: (mode: BillboardMode) => void;
  backgroundEffect?: BackgroundEffect;
  setBackgroundEffect?: (effect: BackgroundEffect) => void;
  backgroundIntensity?: number;
  setBackgroundIntensity?: (intensity: number) => void;
  interactiveMode?: boolean;
  setInteractiveMode?: (mode: boolean) => void;
  className?: string;
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

interface SelectButtonProps<T extends string> {
  options: readonly T[];
  selected: T;
  onChange: (option: T) => void;
  label: string;
  disabled?: boolean;
}

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  unit?: string;
}

// Default values with proper typing
const DEFAULT_VALUES = {
  billboardMode: 'neon' as BillboardMode,
  backgroundEffect: 'particles' as BackgroundEffect,
  backgroundIntensity: 50,
  interactiveMode: true,
} as const;

const BILLBOARD_OPTIONS: readonly BillboardMode[] = ['neon', 'retro', 'cyberpunk', 'minimal', 'glitch'] as const;
const BACKGROUND_OPTIONS: readonly BackgroundEffect[] = ['particles', 'waves', 'matrix', 'stars', 'none'] as const;

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  checked, 
  onChange, 
  label, 
  disabled = false 
}) => (
  <div className="flex items-center justify-between mb-4">
    <span className={`text-sm font-medium ${
      disabled ? 'text-gray-500' : 'text-white'
    }`}>
      {label}
    </span>
    <div
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
        disabled 
          ? 'bg-gray-700 cursor-not-allowed' 
          : `cursor-pointer ${checked ? 'bg-blue-500' : 'bg-gray-600'}`
      }`}
      onClick={() => !disabled && onChange(!checked)}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
          checked ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      />
    </div>
  </div>
);

const SelectButton = <T extends string>({
  options,
  selected,
  onChange,
  label,
  disabled = false
}: SelectButtonProps<T>): JSX.Element => (
  <div className="mb-4">
    <span className={`text-sm font-medium block mb-2 ${
      disabled ? 'text-gray-500' : 'text-white'
    }`}>
      {label}
    </span>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => !disabled && onChange(option)}
          disabled={disabled}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            disabled
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : selected === option
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          aria-pressed={selected === option}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const Slider: React.FC<SliderProps> = ({ 
  value, 
  onChange, 
  label, 
  min = 0, 
  max = 100, 
  step = 1,
  disabled = false,
  unit = '%'
}) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className={`text-sm font-medium ${
        disabled ? 'text-gray-500' : 'text-white'
      }`}>
        {label}
      </span>
      <span className={`text-xs ${
        disabled ? 'text-gray-500' : 'text-blue-400'
      }`}>
        {value}{unit}
      </span>
    </div>
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => !disabled && onChange(Number(e.target.value))}
        disabled={disabled}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer slider ${
          disabled ? 'bg-gray-800 cursor-not-allowed' : 'bg-gray-700'
        }`}
        style={{
          background: disabled 
            ? '#374151'
            : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(value - min) / (max - min) * 100}%, #374151 ${(value - min) / (max - min) * 100}%, #374151 100%)`
        }}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
      />
    </div>
  </div>
);

const BillboardControls: React.FC<BillboardControlsProps> = ({
  billboardMode: externalBillboardMode,
  setBillboardMode: externalSetBillboardMode,
  backgroundEffect: externalBackgroundEffect,
  setBackgroundEffect: externalSetBackgroundEffect,
  backgroundIntensity: externalBackgroundIntensity,
  setBackgroundIntensity: externalSetBackgroundIntensity,
  interactiveMode: externalInteractiveMode,
  setInteractiveMode: externalSetInteractiveMode,
  className = ''
}) => {
  // Internal state with proper typing
  const [internalBillboardMode, setInternalBillboardMode] = useState<BillboardMode>(DEFAULT_VALUES.billboardMode);
  const [internalBackgroundEffect, setInternalBackgroundEffect] = useState<BackgroundEffect>(DEFAULT_VALUES.backgroundEffect);
  const [internalBackgroundIntensity, setInternalBackgroundIntensity] = useState<number>(DEFAULT_VALUES.backgroundIntensity);
  const [internalInteractiveMode, setInternalInteractiveMode] = useState<boolean>(DEFAULT_VALUES.interactiveMode);
  const [showControls, setShowControls] = useState<boolean>(true);

  // Use external props if provided, otherwise use internal state
  const billboardMode = externalBillboardMode ?? internalBillboardMode;
  const setBillboardMode = externalSetBillboardMode ?? setInternalBillboardMode;
  const backgroundEffect = externalBackgroundEffect ?? internalBackgroundEffect;
  const setBackgroundEffect = externalSetBackgroundEffect ?? setInternalBackgroundEffect;
  const backgroundIntensity = externalBackgroundIntensity ?? internalBackgroundIntensity;
  const setBackgroundIntensity = externalSetBackgroundIntensity ?? setInternalBackgroundIntensity;
  const interactiveMode = externalInteractiveMode ?? internalInteractiveMode;
  const setInteractiveMode = externalSetInteractiveMode ?? setInternalInteractiveMode;

  const handleReset = (): void => {
    setBillboardMode(DEFAULT_VALUES.billboardMode);
    setBackgroundEffect(DEFAULT_VALUES.backgroundEffect);
    setBackgroundIntensity(DEFAULT_VALUES.backgroundIntensity);
    setInteractiveMode(DEFAULT_VALUES.interactiveMode);
  };

  const toggleControls = (): void => {
    setShowControls(prev => !prev);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 ${className}`}>
      {/* Toggle Control Panel Button */}
      <button
        onClick={toggleControls}
        className="fixed top-4 right-4 z-50 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={showControls ? 'Hide controls' : 'Show controls'}
        type="button"
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${showControls ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Control Panel */}
      <div 
        className={`fixed top-4 left-4 bg-black bg-opacity-80 backdrop-blur-md rounded-xl p-6 min-w-72 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        role="dialog"
        aria-label="Billboard Controls"
        aria-hidden={!showControls}
      >
        <h2 className="text-white text-lg font-bold mb-6 text-center border-b border-gray-600 pb-2">
          Billboard Controls
        </h2>

        <ToggleSwitch
          checked={interactiveMode}
          onChange={setInteractiveMode}
          label="Interactive Mode"
        />

        <SelectButton<BillboardMode>
          options={BILLBOARD_OPTIONS}
          selected={billboardMode}
          onChange={setBillboardMode}
          label="Billboard Mode"
        />

        <SelectButton<BackgroundEffect>
          options={BACKGROUND_OPTIONS}
          selected={backgroundEffect}
          onChange={setBackgroundEffect}
          label="Background Effect"
        />

        <Slider
          value={backgroundIntensity}
          onChange={setBackgroundIntensity}
          label="Background Intensity"
          min={0}
          max={100}
          step={1}
        />

        {/* Reset Button */}
        <button
          onClick={handleReset}
          type="button"
          className="w-full mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default BillboardControls;
export type { BillboardControlsProps, BillboardMode, BackgroundEffect };