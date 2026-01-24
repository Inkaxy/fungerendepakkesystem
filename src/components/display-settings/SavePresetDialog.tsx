import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save, Loader2 } from 'lucide-react';
import { useCreatePreset } from '@/hooks/useDisplayPresets';
import type { DisplaySettings } from '@/hooks/useDisplaySettings';

const formSchema = z.object({
  name: z.string().min(1, 'Malnavn er påkrevd').max(50, 'Maks 50 tegn'),
  description: z.string().max(200, 'Maks 200 tegn').optional(),
  preset_type: z.enum(['complete', 'colors', 'layout', 'typography']),
  is_public: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface SavePresetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSettings: DisplaySettings;
}

const presetTypeLabels = {
  complete: 'Komplett mal (alle innstillinger)',
  colors: 'Kun farger',
  layout: 'Kun layout',
  typography: 'Kun typografi',
};

const SavePresetDialog = ({
  open,
  onOpenChange,
  currentSettings,
}: SavePresetDialogProps) => {
  const createPreset = useCreatePreset();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      preset_type: 'complete',
      is_public: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    let settingsToSave: Partial<DisplaySettings> = currentSettings;

    // Filter settings based on preset_type
    if (values.preset_type === 'colors') {
      settingsToSave = {
        background_type: currentSettings.background_type,
        background_color: currentSettings.background_color,
        background_gradient_start: currentSettings.background_gradient_start,
        background_gradient_end: currentSettings.background_gradient_end,
        background_gradient_direction: currentSettings.background_gradient_direction,
        text_color: currentSettings.text_color,
        header_text_color: currentSettings.header_text_color,
        card_background_color: currentSettings.card_background_color,
        card_border_color: currentSettings.card_border_color,
        product_card_color: currentSettings.product_card_color,
        product_text_color: currentSettings.product_text_color,
        product_accent_color: currentSettings.product_accent_color,
        product_1_bg_color: currentSettings.product_1_bg_color,
        product_2_bg_color: currentSettings.product_2_bg_color,
        product_3_bg_color: currentSettings.product_3_bg_color,
        product_1_text_color: currentSettings.product_1_text_color,
        product_2_text_color: currentSettings.product_2_text_color,
        product_3_text_color: currentSettings.product_3_text_color,
        status_pending_color: currentSettings.status_pending_color,
        status_in_progress_color: currentSettings.status_in_progress_color,
        status_completed_color: currentSettings.status_completed_color,
        status_delivered_color: currentSettings.status_delivered_color,
        progress_bar_color: currentSettings.progress_bar_color,
        progress_background_color: currentSettings.progress_background_color,
        stats_icon_color: currentSettings.stats_icon_color,
      };
    } else if (values.preset_type === 'layout') {
      settingsToSave = {
        spacing: currentSettings.spacing,
        border_radius: currentSettings.border_radius,
        card_border_width: currentSettings.card_border_width,
        card_shadow_intensity: currentSettings.card_shadow_intensity,
        product_card_size: currentSettings.product_card_size,
        product_spacing: currentSettings.product_spacing,
        product_card_padding: currentSettings.product_card_padding,
        product_columns: currentSettings.product_columns,
        customer_cards_columns: currentSettings.customer_cards_columns,
        customer_cards_gap: currentSettings.customer_cards_gap,
        stats_columns: currentSettings.stats_columns,
        max_products_per_card: currentSettings.max_products_per_card,
        shared_content_padding: currentSettings.shared_content_padding,
        customer_content_padding: currentSettings.customer_content_padding,
      };
    } else if (values.preset_type === 'typography') {
      settingsToSave = {
        header_font_size: currentSettings.header_font_size,
        body_font_size: currentSettings.body_font_size,
        product_name_font_size: currentSettings.product_name_font_size,
        product_quantity_font_size: currentSettings.product_quantity_font_size,
        product_unit_font_size: currentSettings.product_unit_font_size,
        product_name_font_weight: currentSettings.product_name_font_weight,
        product_quantity_font_weight: currentSettings.product_quantity_font_weight,
        line_items_count_font_size: currentSettings.line_items_count_font_size,
        status_badge_font_size: currentSettings.status_badge_font_size,
        customer_name_font_size: currentSettings.customer_name_font_size,
        shared_product_font_size: currentSettings.shared_product_font_size,
        customer_display_header_size: currentSettings.customer_display_header_size,
        status_indicator_font_size: currentSettings.status_indicator_font_size,
      };
    }

    await createPreset.mutateAsync({
      name: values.name,
      description: values.description,
      preset_type: values.preset_type,
      settings: settingsToSave,
      is_public: values.is_public,
    });

    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Lagre som mal</DialogTitle>
          <DialogDescription>
            Lagre dine nåværende innstillinger som en gjenbrukbar mal.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Malnavn</FormLabel>
                  <FormControl>
                    <Input placeholder="F.eks. Sommertema 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beskrivelse (valgfritt)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="En kort beskrivelse av malen..."
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preset_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maltype</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(presetTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Velg hvilke innstillinger som skal inkluderes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_public"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Del med bakeriet</FormLabel>
                    <FormDescription className="text-xs">
                      Gjør malen tilgjengelig for alle i bakeriet
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Avbryt
              </Button>
              <Button type="submit" disabled={createPreset.isPending}>
                {createPreset.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Lagrer...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Lagre mal
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SavePresetDialog;
