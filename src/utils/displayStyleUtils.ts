
import { DisplaySettings } from '@/hooks/useDisplaySettings';

export const generateDisplayStyles = (settings: DisplaySettings) => {
  const backgroundStyle = (() => {
    switch (settings.background_type) {
      case 'solid':
        return { backgroundColor: settings.background_color };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${settings.background_gradient_start}, ${settings.background_gradient_end})`
        };
      case 'image':
        return {
          backgroundImage: settings.background_image_url ? `url(${settings.background_image_url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      default:
        return { backgroundColor: settings.background_color };
    }
  })();

  const animationDuration = settings.animation_speed === 'slow' ? '2s' : 
                           settings.animation_speed === 'fast' ? '0.5s' : '1s';

  // Typography styles
  const typographyStyles = {
    fontFamily: settings.font_family,
    lineHeight: `${settings.line_height}`,
    ...(settings.text_shadow_enabled && {
      textShadow: `${settings.text_shadow_offset_x}px ${settings.text_shadow_offset_y}px ${settings.text_shadow_blur}px ${settings.text_shadow_color}`
    })
  };

  // Touch-friendly sizes
  const minTouchSize = settings.touch_friendly_sizes ? `${settings.touch_target_size}px` : 'auto';

  // Large screen optimization multipliers
  const largeScreenMultiplier = settings.large_screen_optimization ? 1.2 : 1;
  const contrastMultiplier = settings.large_screen_optimization ? 1.1 : 1;

  return {
    '--header-font-size': `${Math.round(settings.header_font_size * largeScreenMultiplier)}px`,
    '--body-font-size': `${Math.round(settings.body_font_size * largeScreenMultiplier)}px`,
    '--text-color': settings.text_color,
    '--header-text-color': settings.header_text_color,
    '--card-bg-color': settings.card_background_color,
    '--card-border-color': settings.card_border_color,
    '--border-radius': `${settings.border_radius}px`,
    '--spacing': `${settings.spacing}px`,
    '--product-card-color': settings.product_card_color,
    '--product-text-color': settings.product_text_color,
    '--product-accent-color': settings.product_accent_color,
    '--product-1-bg-color': settings.product_1_bg_color,
    '--product-2-bg-color': settings.product_2_bg_color,
    '--product-3-bg-color': settings.product_3_bg_color,
    '--product-1-text-color': settings.product_1_text_color,
    '--product-2-text-color': settings.product_2_text_color,
    '--product-3-text-color': settings.product_3_text_color,
    '--product-1-accent-color': settings.product_1_accent_color,
    '--product-2-accent-color': settings.product_2_accent_color,
    '--product-3-accent-color': settings.product_3_accent_color,
    '--packing-status-ongoing': settings.packing_status_ongoing_color,
    '--packing-status-completed': settings.packing_status_completed_color,
    '--progress-bar-color': settings.progress_bar_color,
    '--progress-bg-color': settings.progress_background_color,
    '--progress-height': `${settings.progress_height}px`,
    '--shadow-intensity': `0 ${Math.round(settings.card_shadow_intensity * contrastMultiplier)}px ${Math.round(settings.card_shadow_intensity * 2 * contrastMultiplier)}px rgba(0,0,0,${0.1 * contrastMultiplier})`,
    '--truck-icon-size': `${settings.truck_icon_size}px`,
    '--animation-duration': animationDuration,
    '--enable-animations': settings.enable_animations ? '1' : '0',
    '--fade-transitions': settings.fade_transitions ? '1' : '0',
    '--progress-animation': settings.progress_animation ? '1' : '0',
    '--product-card-size': `${settings.product_card_size}%`,
    '--min-touch-size': minTouchSize,
    '--display-padding': `${Math.round(settings.display_padding * largeScreenMultiplier)}px`,
    '--display-margin': `${Math.round(settings.display_margin * largeScreenMultiplier)}px`,
    '--minimum-card-width': `${settings.minimum_card_width}px`,
    '--status-indicator-padding': `${settings.status_indicator_padding}px`,
    '--large-screen-optimization': settings.large_screen_optimization ? '1' : '0',
    '--force-single-screen': settings.force_single_screen ? '1' : '0',
    ...backgroundStyle,
    ...typographyStyles,
  } as React.CSSProperties & { [key: string]: string };
};

export const packingStatusColorMap = (settings: DisplaySettings) => ({
  ongoing: settings.packing_status_ongoing_color,
  completed: settings.packing_status_completed_color,
});

export const statusColorMap = (settings: DisplaySettings) => ({
  pending: settings.status_pending_color || '#f59e0b',
  in_progress: settings.packing_status_ongoing_color,
  completed: settings.packing_status_completed_color,
  delivered: settings.status_delivered_color || '#059669',
});

export const getProductBackgroundColor = (settings: DisplaySettings, productIndex: number) => {
  switch (productIndex) {
    case 0:
      return settings.product_1_bg_color;
    case 1:
      return settings.product_2_bg_color;
    case 2:
      return settings.product_3_bg_color;
    default:
      return settings.product_card_color;
  }
};

export const getProductTextColor = (settings: DisplaySettings, productIndex: number) => {
  switch (productIndex) {
    case 0:
      return settings.product_1_text_color;
    case 1:
      return settings.product_2_text_color;
    case 2:
      return settings.product_3_text_color;
    default:
      return settings.product_text_color;
  }
};

export const getProductAccentColor = (settings: DisplaySettings, productIndex: number) => {
  switch (productIndex) {
    case 0:
      return settings.product_1_accent_color;
    case 1:
      return settings.product_2_accent_color;
    case 2:
      return settings.product_3_accent_color;
    default:
      return settings.product_accent_color;
  }
};

export const getAnimationClasses = (settings: DisplaySettings) => {
  if (!settings.enable_animations) return '';
  
  const classes = ['transition-all'];
  
  if (settings.fade_transitions) {
    classes.push('fade-in');
  }
  
  if (settings.progress_animation) {
    classes.push('animate-pulse');
  }
  
  return classes.join(' ');
};
