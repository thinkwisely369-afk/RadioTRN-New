import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { auth, API_URL, BASE_URL } from '@/lib/api';
import { Upload, Loader2, X } from 'lucide-react';

interface LogoUploadProps {
  onLogoUploaded: (logoUrl: string) => void;
  currentLogoUrl?: string;
}

interface Point {
  x: number;
  y: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function LogoUpload({ onLogoUploaded, currentLogoUrl }: LogoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const { toast } = useToast();

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);

    // Read file and show cropper
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !croppedAreaPixels) return;

    setUploading(true);

    try {
      const token = auth.getToken();
      if (!token) throw new Error('Not authenticated');

      const formData = new FormData();
      formData.append('logo', selectedFile);
      formData.append('cropX', croppedAreaPixels.x.toString());
      formData.append('cropY', croppedAreaPixels.y.toString());
      formData.append('cropWidth', croppedAreaPixels.width.toString());
      formData.append('cropHeight', croppedAreaPixels.height.toString());

      const response = await fetch(`${API_URL}/upload/logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const fullLogoUrl = `${BASE_URL}${data.logoUrl}`;

      onLogoUploaded(fullLogoUrl);
      setShowCropper(false);
      setImageSrc('');
      setSelectedFile(null);

      toast({
        title: 'Success',
        description: 'Logo uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload logo',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Station Logo</Label>

        {currentLogoUrl && (
          <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
            <img
              src={currentLogoUrl}
              alt="Current logo"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex gap-2">
          <Label htmlFor="logo-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              <span>Upload Logo</span>
            </div>
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </Label>
        </div>

        <p className="text-xs text-gray-500">
          Click to upload a square logo (PNG, JPG, or WebP, max 5MB)
        </p>
      </div>

      {/* Cropper Dialog */}
      <Dialog open={showCropper} onOpenChange={setShowCropper}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Station Logo</DialogTitle>
            <DialogDescription>
              Adjust the crop area to create a perfect square logo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zoom">Zoom</Label>
              <input
                id="zoom"
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCropper(false)}
                className="flex-1"
                disabled={uploading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpload}
                className="flex-1"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
