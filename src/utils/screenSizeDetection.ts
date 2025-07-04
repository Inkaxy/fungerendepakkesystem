export const getScreenSizeCategory = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const diagonal = Math.sqrt(width * width + height * height);
  
  // Rough diagonal calculations (not perfect but functional)
  if (diagonal < 1200) return 'small'; // Up to ~13"
  if (diagonal < 2000) return 'medium'; // Up to ~24"
  return 'large'; // 32"+ TVs and large monitors
};

export const getScreenPresetCategory = (preset: string) => {
  const smallScreenPresets = ['10inch', '13inch', 'laptop', 'standard'];
  const largeScreenPresets = ['32inch', '43inch', '55inch', '65inch', 'monitor'];
  
  if (smallScreenPresets.includes(preset)) return 'small';
  if (largeScreenPresets.includes(preset)) return 'large';
  return 'small'; // default
};

export const isLargeScreen = (settings: any) => {
  const screenCategory = getScreenSizeCategory();
  const presetCategory = getScreenPresetCategory(settings?.screen_size_preset || 'standard');
  
  // If force_single_screen is enabled, treat as large screen
  if (settings?.force_single_screen) return true;
  
  // If large_screen_optimization is enabled, treat as large screen
  if (settings?.large_screen_optimization) return true;
  
  // Use actual screen size or preset setting
  return screenCategory === 'large' || presetCategory === 'large';
};

export const isSmallScreen = (settings: any) => {
  return !isLargeScreen(settings);
};