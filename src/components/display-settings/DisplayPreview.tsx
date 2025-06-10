
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { generateDisplayStyles } from '@/utils/displayStyleUtils';

interface DisplayPreviewProps {
  settings: DisplaySettings;
}

const DisplayPreview = ({ settings }: DisplayPreviewProps) => {
  const styles = generateDisplayStyles(settings);
  const mockProgress = 57; // Mock progress percentage for preview

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Live Forhåndsvisning</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            className="relative h-96 overflow-hidden rounded-b-lg p-4"
            style={{
              ...styles,
              fontSize: `${settings.body_font_size}px`,
            }}
          >
            {/* Header with customer name */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-center flex-1">
                <h1 
                  className="font-bold mb-2"
                  style={{ 
                    fontSize: `${Math.min(settings.header_font_size * 0.6, 24)}px`,
                    color: settings.header_text_color
                  }}
                >
                  Eksempel Bakeri AS
                </h1>
                <p 
                  className="text-sm"
                  style={{ 
                    color: settings.text_color,
                    opacity: 0.8
                  }}
                >
                  10. juni 2025
                </p>
              </div>
              <RefreshCw className="h-4 w-4 text-gray-400" />
            </div>

            {/* Products List */}
            <div
              className="p-3 rounded mb-3"
              style={{
                backgroundColor: settings.card_background_color,
                borderColor: settings.card_border_color,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: `${settings.border_radius}px`,
                boxShadow: `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)`,
              }}
            >
              <div className="space-y-2">
                {['Rundstykker', 'Grovbrød', 'Wienerbrød'].map((product, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-2 rounded"
                    style={{
                      backgroundColor: settings.product_card_color,
                      borderRadius: `${settings.border_radius}px`,
                    }}
                  >
                    <span 
                      className="text-sm font-medium"
                      style={{ color: settings.product_text_color }}
                    >
                      {product}
                    </span>
                    <span 
                      className="text-sm font-bold"
                      style={{ color: settings.product_accent_color }}
                    >
                      {idx + 2}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Section */}
            <div
              className="p-3 rounded mb-3 text-center"
              style={{
                backgroundColor: settings.card_background_color,
                borderColor: settings.card_border_color,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: `${settings.border_radius}px`,
                boxShadow: `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)`,
              }}
            >
              <div className="space-y-1">
                <p 
                  className="text-xs"
                  style={{ color: settings.text_color }}
                >
                  Bestilt 7 varelinjer
                </p>
                <p 
                  className="text-xs font-semibold"
                  style={{ color: settings.text_color }}
                >
                  Pakket 4 av 7 varelinjer
                </p>
              </div>
            </div>

            {/* STATUS Indicator */}
            {settings.show_status_indicator && (
              <div
                className="text-center mb-3"
                style={{
                  backgroundColor: mockProgress >= 100 ? settings.packing_status_completed_color : settings.packing_status_ongoing_color,
                  borderRadius: `${settings.border_radius}px`,
                  padding: `${Math.max(settings.status_indicator_padding / 4, 8)}px`,
                }}
              >
                <h2 
                  className="font-bold text-white"
                  style={{ fontSize: `${Math.max(settings.status_indicator_font_size / 2, 14)}px` }}
                >
                  STATUS: {mockProgress >= 100 ? 'Ferdig Pakket' : 'Pågående'}
                </h2>
              </div>
            )}

            {/* Progress Bar */}
            <div
              className="p-3 rounded mb-3"
              style={{
                backgroundColor: settings.card_background_color,
                borderColor: settings.card_border_color,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: `${settings.border_radius}px`,
                boxShadow: `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)`,
              }}
            >
              <div className="space-y-2">
                <div 
                  className="w-full rounded-full"
                  style={{ 
                    backgroundColor: settings.progress_background_color,
                    height: `${Math.max(settings.progress_height, 4)}px`
                  }}
                >
                  <div 
                    className="rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: settings.progress_bar_color,
                      height: `${Math.max(settings.progress_height, 4)}px`,
                      width: `${mockProgress}%`
                    }}
                  />
                </div>
                {settings.show_progress_percentage && (
                  <div className="text-center">
                    <span 
                      className="text-sm font-bold"
                      style={{ color: settings.text_color }}
                    >
                      {mockProgress}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p 
                className="text-xs"
                style={{ color: settings.text_color, opacity: 0.6 }}
              >
                Sist oppdatert: 14:23:45
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisplayPreview;
