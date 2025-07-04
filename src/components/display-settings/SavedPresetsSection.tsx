import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Upload, Download, Trash2, Copy, Share, Plus, Search } from 'lucide-react';
import { DisplaySettings } from '@/hooks/useDisplaySettings';
import { useToast } from '@/hooks/use-toast';

interface SavedPresetsSectionProps {
  settings: DisplaySettings;
  onUpdate: (updates: Partial<DisplaySettings>) => void;
}

interface DisplayPreset {
  id: string;
  name: string;
  description?: string;
  preset_type: 'small_screen' | 'large_screen' | 'complete';
  settings: Partial<DisplaySettings>;
  is_public: boolean;
  created_at: string;
  user_name?: string;
}

const SavedPresetsSection = ({ settings, onUpdate }: SavedPresetsSectionProps) => {
  const { toast } = useToast();
  const [presets, setPresets] = useState<DisplayPreset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'small_screen' | 'large_screen' | 'complete'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPreset, setNewPreset] = useState<{
    name: string;
    description: string;
    preset_type: 'small_screen' | 'large_screen' | 'complete';
  }>({
    name: '',
    description: '',
    preset_type: 'complete'
  });

  const handleSavePreset = () => {
    // TODO: Implement save to database
    const preset: DisplayPreset = {
      id: crypto.randomUUID(),
      name: newPreset.name,
      description: newPreset.description,
      preset_type: newPreset.preset_type,
      settings: settings,
      is_public: false,
      created_at: new Date().toISOString(),
    };

    setPresets([...presets, preset]);
    setIsCreateDialogOpen(false);
    setNewPreset({ name: '', description: '', preset_type: 'complete' });
    
    toast({
      title: "Oppsett lagret",
      description: `"${preset.name}" er nå lagret som et tilgjengelig oppsett.`,
    });
  };

  const handleLoadPreset = (preset: DisplayPreset) => {
    onUpdate(preset.settings);
    toast({
      title: "Oppsett lastet",
      description: `Innstillinger fra "${preset.name}" er nå aktivert.`,
    });
  };

  const handleDeletePreset = (presetId: string) => {
    setPresets(presets.filter(p => p.id !== presetId));
    toast({
      title: "Oppsett slettet",
      description: "Oppsettet er permanent fjernet.",
      variant: "destructive",
    });
  };

  const filteredPresets = presets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         preset.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || preset.preset_type === filterType;
    return matchesSearch && matchesType;
  });

  const getPresetTypeLabel = (type: string) => {
    switch (type) {
      case 'small_screen': return 'Små skjermer';
      case 'large_screen': return 'Store skjermer';
      case 'complete': return 'Komplett';
      default: return type;
    }
  };

  const getPresetTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'small_screen': return 'secondary';
      case 'large_screen': return 'outline';
      case 'complete': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lagrede Oppsett</span>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Lagre nåværende oppsett
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Lagre nytt oppsett</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="preset-name">Navn</Label>
                    <Input
                      id="preset-name"
                      value={newPreset.name}
                      onChange={(e) => setNewPreset({ ...newPreset, name: e.target.value })}
                      placeholder="F.eks. 'Kompakt tablet-visning'"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="preset-description">Beskrivelse (valgfritt)</Label>
                    <Textarea
                      id="preset-description"
                      value={newPreset.description}
                      onChange={(e) => setNewPreset({ ...newPreset, description: e.target.value })}
                      placeholder="Beskriv når dette oppsettet bør brukes..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Type oppsett</Label>
                    <Select 
                      value={newPreset.preset_type} 
                      onValueChange={(value) => 
                        setNewPreset({ ...newPreset, preset_type: value as 'small_screen' | 'large_screen' | 'complete' })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complete">Komplett oppsett (alle innstillinger)</SelectItem>
                        <SelectItem value="small_screen">Kun små skjerm-innstillinger</SelectItem>
                        <SelectItem value="large_screen">Kun store skjerm-innstillinger</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Avbryt
                    </Button>
                    <Button onClick={handleSavePreset} disabled={!newPreset.name.trim()}>
                      <Save className="h-4 w-4 mr-2" />
                      Lagre oppsett
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Administrer og gjenbruk lagrede display-konfigurasjoner
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Søk i oppsett..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle typer</SelectItem>
                <SelectItem value="complete">Komplette oppsett</SelectItem>
                <SelectItem value="small_screen">Små skjermer</SelectItem>
                <SelectItem value="large_screen">Store skjermer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPresets.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                {presets.length === 0 
                  ? "Ingen lagrede oppsett ennå. Lag ditt første oppsett ved å klikke 'Lagre nåværende oppsett'."
                  : "Ingen oppsett matcher søkekriteriene."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPresets.map((preset) => (
            <Card key={preset.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{preset.name}</CardTitle>
                  <Badge variant={getPresetTypeBadgeVariant(preset.preset_type) as any}>
                    {getPresetTypeLabel(preset.preset_type)}
                  </Badge>
                </div>
                {preset.description && (
                  <p className="text-sm text-muted-foreground">{preset.description}</p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleLoadPreset(preset)}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Last inn
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-1" />
                      Kopier
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDeletePreset(preset.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-3 text-xs text-muted-foreground">
                  Opprettet: {new Date(preset.created_at).toLocaleDateString('no-NO')}
                  {preset.user_name && ` av ${preset.user_name}`}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedPresetsSection;