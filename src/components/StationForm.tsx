import { useState, useEffect } from 'react';
import { auth, stationsAPI, Station } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import LogoUpload from '@/components/LogoUpload';

interface StationFormProps {
  station: Station | null;
  onClose: () => void;
}

export default function StationForm({ station, onClose }: StationFormProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [genre, setGenre] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [logoUrl, setLogoUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (station) {
      setName(station.name);
      setSlug(station.slug || '');
      setTagline(station.tagline);
      setGenre(station.genre);
      setStreamUrl(station.streamUrl);
      setColor(station.color);
      setLogoUrl(station.logoUrl || '');
      setIsActive(station.isActive);
    }
  }, [station]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = auth.getToken();
      if (!token) throw new Error('Not authenticated');

      const stationData = {
        name,
        slug: slug || undefined,
        tagline,
        genre,
        streamUrl,
        color,
        logoUrl: logoUrl || undefined,
        isActive,
      };

      if (station) {
        await stationsAPI.update(token, station.id, stationData);
        toast({
          title: 'Success',
          description: 'Station updated successfully',
        });
      } else {
        await stationsAPI.create(token, stationData);
        toast({
          title: 'Success',
          description: 'Station created successfully',
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save station',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const presetColors = [
    '#3b82f6', '#8b5cf6', '#ef4444', '#10b981',
    '#f59e0b', '#84cc16', '#06b6d4', '#14b8a6',
    '#6366f1', '#ec4899', '#f97316', '#a855f7'
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{station ? 'Edit Station' : 'Add New Station'}</DialogTitle>
          <DialogDescription>
            {station ? 'Update station information' : 'Create a new radio station'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Station Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jazz FM"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="e.g. jazzfm or jazz-fm"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Custom URL: radiotrn.com/{slug || 'your-slug'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Smooth Jazz 24/7"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g. Jazz"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="streamUrl">Stream URL *</Label>
            <Input
              id="streamUrl"
              type="url"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              placeholder="https://stream.example.com/live"
              required
              disabled={loading}
            />
          </div>

          <LogoUpload
            currentLogoUrl={logoUrl}
            onLogoUploaded={setLogoUrl}
          />

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20 h-10"
                disabled={loading}
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1"
                disabled={loading}
              />
            </div>
            <div className="flex gap-2 mt-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => setColor(presetColor)}
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active</Label>
              <p className="text-xs text-gray-500">
                Show this station in the public listing
              </p>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                station ? 'Update Station' : 'Create Station'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
