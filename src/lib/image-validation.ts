export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export interface ImagePreset {
  id: string;
  label: string;
  width: number;
  height: number;
  description: string;
}

export const IMAGE_PRESETS: ImagePreset[] = [
  { id: "logo", label: "Logo", width: 200, height: 60, description: "Site logo" },
  { id: "logo-square", label: "Logo (Square)", width: 200, height: 200, description: "Square logo / favicon" },
  { id: "banner", label: "Banner", width: 1200, height: 500, description: "Homepage hero banner" },
  { id: "product", label: "Product", width: 400, height: 400, description: "Product thumbnail" },
  { id: "product-large", label: "Product (Large)", width: 800, height: 800, description: "Product detail image" },
  { id: "category", label: "Category", width: 200, height: 200, description: "Category icon" },
  { id: "offer", label: "Offer Banner", width: 400, height: 300, description: "Offer/promo banner" },
  { id: "og-image", label: "OG Image", width: 1200, height: 630, description: "Social share image" },
  { id: "avatar", label: "Avatar", width: 150, height: 150, description: "User avatar" },
  { id: "custom", label: "Custom", width: 0, height: 0, description: "Any size" },
];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  width?: number;
  height?: number;
  fileSize?: number;
  fileName?: string;
}

export function validateImageFile(file: File): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const errors: string[] = [];

    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File size (${(file.size / 1024 / 1024).toFixed(2)} MB) exceeds maximum of 4 MB`);
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type "${file.type}" is not supported. Use JPG, PNG, GIF, WebP, or SVG`);
    }

    if (errors.length > 0) {
      resolve({ valid: false, errors, fileSize: file.size, fileName: file.name });
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: true,
        errors: [],
        width: img.naturalWidth,
        height: img.naturalHeight,
        fileSize: file.size,
        fileName: file.name,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, errors: ["Failed to load image"], fileSize: file.size, fileName: file.name });
    };
    img.src = url;
  });
}

export function validateImageDimensions(
  width: number,
  height: number,
  preset: ImagePreset
): string[] {
  if (preset.id === "custom") return [];
  const errors: string[] = [];
  if (width < preset.width) errors.push(`Width (${width}px) is less than recommended ${preset.width}px`);
  if (height < preset.height) errors.push(`Height (${height}px) is less than recommended ${preset.height}px`);
  return errors;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
