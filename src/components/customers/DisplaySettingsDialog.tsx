
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Palette, Layout, Clock, Loader2 } from 'lucide-react';
import { Customer } from '@/types/database';
import { useDisplaySettings, useCreateDisplaySettings, useUpdateDisplaySettings } from '@/hooks/useDisplaySettings';

interface DisplaySettingsDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DisplaySettingsDialog = ({ customer, open, onOpenChange }: DisplaySettingsDialogProps) => {
  const { data: settings } = useDisplaySettings(customer.assigned_display_station_id, customer.id);
  const createSettings = useCreateDisplaySettings();
  const updateSettings = useUpdateDisplaySettings();

  const [formData, setFormData] = useState({
    font_size: 16,
    background_color: '#ffffff',
    text_color: '#000000',
    accent_color: '#3b82f6',
    header_height: 80,
    enable_animations: true,
    animation_speed: 500,
    rotation_interval: 30,
    show_customer_info: true,
    show_delivery_date: true,
    products_per_view: 3,
    show_product_images: false,
    show_quantities: true,
    show_notes: true,
  });

  useEffect(() => {
    if (settings && settings.length > 0) {
      const customerSettings = settings.find(s => s.customer_id === customer.id);
      if (customerSettings) {
        setFormData({
          font_size: customerSettings.font_size,
          background_color: customerSettings.background_color,
          text_color: customerSettings.text_color,
          accent_color: customerSettings.accent_color,
          header_height: customerSettings.header_height,
          enable_animations: customerSettings.enable_animations,
          animation_speed: customerSettings.animation_speed,
          rotation_interval: customerSettings.rotation_interval,
          show_customer_info: customerSettings.show_customer_info,
          show_delivery_date: customerSettings.show_delivery_date,
          products_per_view: customerSettings.products_per_view,
          show_product_images: customerSettings.show_product_images,
          show_quantities: customerSettings.show_quantities,
          show_notes: customerSettings.show_notes,
        });
      }
    }
  }, [settings, customer.id]);

  const handleSave = async () => {
    if (!customer.assigned_display_station_id) return;

    try {
      const existingSettings = settings?.find(s => s.customer_id === customer.id);
      
      if (existingSettings) {
        await updateSettings.mutateAsync({
          id: existingSettings.id,
          ...formData,
        });
      } else {
        await createSettings.mutateAsync({
          display_station_id: customer.assigned_display_station_id,
          customer_id: customer.id,
          ...formData,
        });
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save display settings:', error);
    }
  };

  if (!customer.assigned_display_station_id) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Display-innstillinger for {customer.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Utseende */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Palette className="w-5 h-5" />
                Utseende
              </CardTitle>
              <CardDescription>
                Tilpass farger og typografi for displayet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="font_size">Tekststørrelse</Label>
                  <Input
                    id="font_size"
                    type="number"
                    min="12"
                    max="32"
                    value={formData.font_size}
                    onChange={(e) => setFormData({ ...formData, font_size: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="header_height">Header høyde (px)</Label>
                  <Input
                    id="header_height"
                    type="number"
                    min="60"
                    max="120"
                    value={formData.header_height}
                    onChange={(e) => setFormData({ ...formData, header_height: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="background_color">Bakgrunnsfarge</Label>
                  <Input
                    id="background_color"
                    type="color"
                    value={formData.background_color}
                    onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text_color">Tekstfarge</Label>
                  <Input
                    id="text_color"
                    type="color"
                    value={formData.text_color}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent_color">Aksentfarge</Label>
                  <Input
                    id="accent_color"
                    type="color"
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Layout */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layout className="w-5 h-5" />
                Layout og visning
              </CardTitle>
              <CardDescription>
                Konfigurer hva som skal vises på displayet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="products_per_view">Produkter per visning</Label>
                <Input
                  id="products_per_view"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.products_per_view}
                  onChange={(e) => setFormData({ ...formData, products_per_view: parseInt(e.target.value) })}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_customer_info">Vis kundeinformasjon</Label>
                  <Switch
                    id="show_customer_info"
                    checked={formData.show_customer_info}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_customer_info: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_delivery_date">Vis leveringsdato</Label>
                  <Switch
                    id="show_delivery_date"
                    checked={formData.show_delivery_date}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_delivery_date: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_quantities">Vis mengder</Label>
                  <Switch
                    id="show_quantities"
                    checked={formData.show_quantities}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_quantities: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_notes">Vis notater</Label>
                  <Switch
                    id="show_notes"
                    checked={formData.show_notes}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_notes: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_product_images">Vis produktbilder</Label>
                  <Switch
                    id="show_product_images"
                    checked={formData.show_product_images}
                    onCheckedChange={(checked) => setFormData({ ...formData, show_product_images: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Animasjoner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5" />
                Animasjoner og timing
              </CardTitle>
              <CardDescription>
                Kontroller animasjoner og automatisk rotasjon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="enable_animations">Aktiver animasjoner</Label>
                <Switch
                  id="enable_animations"
                  checked={formData.enable_animations}
                  onCheckedChange={(checked) => setFormData({ ...formData, enable_animations: checked })}
                />
              </div>

              {formData.enable_animations && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="animation_speed">Animasjonshastighet (ms)</Label>
                    <Input
                      id="animation_speed"
                      type="number"
                      min="100"
                      max="2000"
                      step="100"
                      value={formData.animation_speed}
                      onChange={(e) => setFormData({ ...formData, animation_speed: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rotation_interval">Rotasjonsintervall (sek)</Label>
                    <Input
                      id="rotation_interval"
                      type="number"
                      min="10"
                      max="120"
                      value={formData.rotation_interval}
                      onChange={(e) => setFormData({ ...formData, rotation_interval: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button 
            onClick={handleSave}
            disabled={createSettings.isPending || updateSettings.isPending}
          >
            {(createSettings.isPending || updateSettings.isPending) && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Lagre innstillinger
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisplaySettingsDialog;
