import { useRef, useState, DragEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/atoms/button';
import { LoadingSpinner } from '@/components/atoms/loading-spinner';
import { cn } from '@/utils';
import { toast } from 'sonner';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxSize?: number; // in bytes, default: 5MB
  error?: string;
}

export function ImageUpload({ images, onChange, maxSize = 5 * 1024 * 1024, error }: ImageUploadProps) {
  const { t } = useTranslation('pages');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      toast.error(t('serviceRequests.form.errors.invalidImageFormat', 'Invalid image format. Please use JPG, PNG, or WebP.'));
      return false;
    }

    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      toast.error(t('serviceRequests.form.errors.imageTooLarge', `Image size must be less than ${maxSizeMB}MB`));
      return false;
    }

    return true;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processFiles = async (files: File[]) => {
    setIsUploading(true);

    const validFiles = files.filter(validateFile);

    try {
      const base64Images = await Promise.all(
        validFiles.map(file => convertToBase64(file))
      );

      onChange([...images, ...base64Images]);
      toast.success(t('serviceRequests.form.imagesUploaded', `${validFiles.length} image(s) uploaded successfully`));
    } catch (error) {
      toast.error(t('serviceRequests.form.errors.uploadFailed', 'Failed to upload images. Please try again.'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    await processFiles(files);

    // Reset input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <Upload className={cn(
            'h-10 w-10 md:h-12 md:w-12 transition-colors',
            isDragging ? 'text-primary' : 'text-muted-foreground'
          )} />
          <div>
            <p className="text-sm font-medium">
              {t('serviceRequests.form.imagesPlaceholder')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG or WebP (max {maxSize / (1024 * 1024)}MB per file)
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-muted"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
