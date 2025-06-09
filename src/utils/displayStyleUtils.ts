
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

  return {
    '--header-font-size': `${settings.header_font_size}px`,
    '--body-font-size': `${settings.body_font_size}px`,
    '--text-color': settings.text_color,
    '--header-text-color': settings.header_text_color,
    '--card-bg-color': settings.card_background_color,
    '--card-border-color': settings.card_border_color,
    '--border-radius': `${settings.border_radius}px`,
    '--spacing': `${settings.spacing}px`,
    '--product-card-color': settings.product_card_color,
    '--product-text-color': settings.product_text_color,
    '--product-accent-color': settings.product_accent_color,
    '--packing-status-ongoing': settings.packing_status_ongoing_color,
    '--packing-status-completed': settings.packing_status_completed_color,
    '--progress-bar-color': settings.progress_bar_color,
    '--progress-bg-color': settings.progress_background_color,
    '--progress-height': `${settings.progress_height}px`,
    '--shadow-intensity': `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)`,
    ...backgroundStyle,
  } as React.CSSProperties & { [key: string]: string };
};

export const packingStatusColorMap = (settings: DisplaySettings) => ({
  ongoing: settings.packing_status_ongoing_color,
  completed: settings.packing_status_completed_color,
});
