
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package, Users } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { generateDisplayStyles } from '@/utils/displayStyleUtils';

interface DisplayPreviewProps {
  settings: DisplaySettings;
}

const DisplayPreview = ({ settings }: DisplayPreviewProps) => {
  const styles = generateDisplayStyles(settings);

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Live Forhåndsvisning</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            className="relative h-96 overflow-hidden rounded-b-lg"
            style={{
              ...styles,
              fontSize: `${settings.body_font_size}px`,
            }}
          >
            {/* Header */}
            <div className="p-4 text-center">
              <h1 
                className="font-bold mb-2"
                style={{ 
                  fontSize: `${settings.header_font_size}px`,
                  color: settings.header_text_color
                }}
              >
                Bakeri Display
              </h1>
              <p style={{ color: settings.text_color, opacity: 0.8 }}>
                Dagens ordrer og status
              </p>
            </div>

            {/* Stats Cards */}
            <div className="px-4 mb-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Users, label: 'Kunder', value: '12' },
                  { icon: Calendar, label: 'Ordrer', value: '24' },
                  { icon: Package, label: 'Produkter', value: '156' },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded text-center"
                    style={{
                      backgroundColor: settings.card_background_color,
                      borderColor: settings.card_border_color,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderRadius: `${settings.border_radius}px`,
                      boxShadow: `0 ${settings.card_shadow_intensity}px ${settings.card_shadow_intensity * 2}px rgba(0,0,0,0.1)`,
                    }}
                  >
                    <stat.icon 
                      className="h-4 w-4 mx-auto mb-1" 
                      style={{ color: settings.product_accent_color }}
                    />
                    <div 
                      className="text-lg font-bold"
                      style={{ color: settings.text_color }}
                    >
                      {stat.value}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: settings.text_color, opacity: 0.7 }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Card Example */}
            <div className="px-4">
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
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 
                      className="font-semibold text-sm"
                      style={{ color: settings.text_color }}
                    >
                      Eksempel Bakeri AS
                    </h3>
                    <p 
                      className="text-xs"
                      style={{ color: settings.text_color, opacity: 0.7 }}
                    >
                      Ordre: #12345
                    </p>
                  </div>
                  <Badge
                    className="text-xs"
                    style={{ 
                      backgroundColor: settings.status_in_progress_color,
                      color: 'white'
                    }}
                  >
                    Under arbeid
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span 
                      className="text-xs"
                      style={{ color: settings.text_color }}
                    >
                      Fremgang
                    </span>
                    {settings.show_progress_percentage && (
                      <span 
                        className="text-xs"
                        style={{ color: settings.text_color, opacity: 0.7 }}
                      >
                        65%
                      </span>
                    )}
                  </div>
                  <div
                    className="w-full rounded-full"
                    style={{
                      backgroundColor: settings.progress_background_color,
                      height: `${settings.progress_height}px`,
                    }}
                  >
                    <div
                      className="rounded-full transition-all"
                      style={{
                        backgroundColor: settings.progress_bar_color,
                        height: `${settings.progress_height}px`,
                        width: '65%',
                      }}
                    />
                  </div>
                </div>

                {/* Products */}
                <div className="space-y-1">
                  {['Rundstykker', 'Grovbrød'].map((product, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-xs p-1 rounded"
                      style={{
                        backgroundColor: settings.product_card_color,
                        transform: `scale(${settings.product_card_size / 100})`,
                        transformOrigin: 'left center',
                      }}
                    >
                      <span style={{ color: settings.product_text_color }}>
                        {product}
                      </span>
                      <span style={{ color: settings.product_accent_color }}>
                        x{idx + 3}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisplayPreview;
