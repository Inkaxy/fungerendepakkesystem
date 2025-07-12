
export const getScreenSizeCategory = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const diagonal = Math.sqrt(width * width + height * height);
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // Juster for høy DPI skjermer
  const physicalDiagonal = diagonal / devicePixelRatio;
  
  // Mer presis kategorisering basert på faktiske skjermstørrelser
  if (physicalDiagonal < 800) return 'small';    // Tablets og små skjermer (under 13")
  if (physicalDiagonal < 1400) return 'medium';  // Desktop monitorer (13"-24")
  if (physicalDiagonal < 2200) return 'large';   // Store monitorer (24"-32")
  return 'extra-large'; // TV-skjermer (32"+)
};

export const getScreenPresetCategory = (preset: string) => {
  const presetCategories = {
    // Små skjermer
    '10inch': 'small',
    '13inch': 'small',
    'laptop': 'small',
    'tablet': 'small',
    
    // Medium skjermer
    'monitor': 'medium',
    'standard': 'medium',
    '24inch': 'medium',
    
    // Store skjermer
    '32inch': 'large',
    '43inch': 'large',
    
    // Ekstra store skjermer
    '55inch': 'extra-large',
    '65inch': 'extra-large',
    '75inch': 'extra-large'
  };
  
  return presetCategories[preset as keyof typeof presetCategories] || 'medium';
};

export const getOptimalLayoutForScreen = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspectRatio = width / height;
  const category = getScreenSizeCategory();
  
  // Beregn optimal kolonne-antall basert på skjermstørrelse og sideforhold
  let columns = 3; // standard
  let fontSize = 16;
  let headerSize = 32;
  let cardPadding = 16;
  let spacing = 16;
  
  switch (category) {
    case 'small':
      columns = Math.max(1, Math.floor(width / 300)); // Minimum 300px per kolonne
      fontSize = Math.max(12, Math.floor(width / 50));
      headerSize = Math.max(18, Math.floor(width / 30));
      cardPadding = 12;
      spacing = 12;
      break;
      
    case 'medium':
      columns = Math.max(2, Math.floor(width / 350));
      fontSize = Math.max(14, Math.floor(width / 60));
      headerSize = Math.max(24, Math.floor(width / 40));
      cardPadding = 16;
      spacing = 16;
      break;
      
    case 'large':
      columns = Math.max(3, Math.floor(width / 400));
      fontSize = Math.max(16, Math.floor(width / 70));
      headerSize = Math.max(32, Math.floor(width / 50));
      cardPadding = 20;
      spacing = 20;
      break;
      
    case 'extra-large':
      columns = Math.max(4, Math.floor(width / 450));
      fontSize = Math.max(20, Math.floor(width / 80));
      headerSize = Math.max(40, Math.floor(width / 60));
      cardPadding = 24;
      spacing = 24;
      break;
  }
  
  // Juster for ultra-wide skjermer
  if (aspectRatio > 2.0) {
    columns = Math.max(columns, Math.floor(columns * 1.5));
  }
  
  return {
    columns: Math.min(columns, 8), // Maksimum 8 kolonner
    fontSize: Math.min(fontSize, 28), // Maksimum font størrelse
    headerSize: Math.min(headerSize, 64), // Maksimum header størrelse
    cardPadding: Math.min(cardPadding, 32),
    spacing: Math.min(spacing, 32),
    category
  };
};

export const isLargeScreen = (settings: any) => {
  const screenCategory = getScreenSizeCategory();
  const presetCategory = getScreenPresetCategory(settings?.screen_size_preset || 'standard');
  
  // Bruk automatisk deteksjon hvis aktivert
  if (settings?.auto_screen_detection) {
    return screenCategory === 'large' || screenCategory === 'extra-large';
  }
  
  // Hvis force_single_screen er aktivert, behandle som stor skjerm
  if (settings?.force_single_screen) return true;
  
  // Hvis large_screen_optimization er aktivert, behandle som stor skjerm
  if (settings?.large_screen_optimization) return true;
  
  // Bruk preset eller skjerm-kategori
  return presetCategory === 'large' || presetCategory === 'extra-large' || 
         screenCategory === 'large' || screenCategory === 'extra-large';
};

export const isSmallScreen = (settings: any) => {
  return !isLargeScreen(settings);
};

// Ny funksjon for å få optimal skjermtype
export const getOptimalScreenType = (settings: any): 'small' | 'large' => {
  return isLargeScreen(settings) ? 'large' : 'small';
};
