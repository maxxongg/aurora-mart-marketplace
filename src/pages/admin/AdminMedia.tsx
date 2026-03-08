import { useState, useRef } from "react";
import { useMedia, type MediaItem } from "@/context/MediaContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Trash2, Search, Image as ImageIcon, Copy, Check, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import {
  validateImageFile,
  validateImageDimensions,
  fileToBase64,
  formatFileSize,
  IMAGE_PRESETS,
  MAX_FILE_SIZE,
  type ImagePreset,
} from "@/lib/image-validation";

export default function AdminMedia() {
  const { items, addItem, deleteItem } = useMedia();
  const [search, setSearch] = useState("");
  const [filterPreset, setFilterPreset] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<ImagePreset>(IMAGE_PRESETS[0]);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchPreset = filterPreset === "all" || item.preset === filterPreset;
    return matchSearch && matchPreset;
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const validation = await validateImageFile(file);
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.errors.join(", ")}`);
        continue;
      }

      const dimWarnings = validateImageDimensions(
        validation.width!,
        validation.height!,
        selectedPreset
      );
      if (dimWarnings.length > 0) {
        toast.warning(`${file.name}: ${dimWarnings.join(". ")}`, { duration: 5000 });
      }

      try {
        const data = await fileToBase64(file);
        addItem({
          name: file.name,
          data,
          width: validation.width!,
          height: validation.height!,
          fileSize: file.size,
          type: file.type,
          preset: selectedPreset.id,
        });
        toast.success(`${file.name} uploaded!`);
      } catch {
        toast.error(`Failed to process ${file.name}`);
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const copyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.data);
    setCopiedId(item.id);
    toast.success("Image URL copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Media Library ({items.length})</h1>
      </div>

      {/* Upload Area */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-xs mb-1 block">Image Preset</Label>
              <Select value={selectedPreset.id} onValueChange={(v) => setSelectedPreset(IMAGE_PRESETS.find((p) => p.id === v)!)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {IMAGE_PRESETS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label} {p.width > 0 ? `(${p.width}×${p.height})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs mb-1 block">Requirements</Label>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">Max 4 MB</Badge>
                <Badge variant="outline">JPG, PNG, GIF, WebP, SVG</Badge>
                {selectedPreset.width > 0 && (
                  <Badge variant="outline">Recommended: {selectedPreset.width}×{selectedPreset.height}px</Badge>
                )}
                <Badge variant="outline">{selectedPreset.description}</Badge>
              </div>
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">{uploading ? "Uploading..." : "Click or drag images here"}</p>
            <p className="text-xs text-muted-foreground mt-1">Max 4 MB per file • Multiple files supported</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="pl-10" />
        </div>
        <Select value={filterPreset} onValueChange={setFilterPreset}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {IMAGE_PRESETS.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Image Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No images yet</p>
          <p className="text-sm">Upload your first image above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative border rounded-lg overflow-hidden bg-card hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer"
              onClick={() => setPreviewItem(item)}
            >
              <div className="aspect-square bg-muted/30 flex items-center justify-center">
                <img src={item.data} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div className="p-2">
                <p className="text-xs font-medium truncate">{item.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">{item.width}×{item.height}</span>
                  <span className="text-[10px] text-muted-foreground">{formatFileSize(item.fileSize)}</span>
                </div>
              </div>
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7"
                  onClick={(e) => { e.stopPropagation(); copyUrl(item); }}
                >
                  {copiedId === item.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7 text-destructive"
                  onClick={(e) => { e.stopPropagation(); deleteItem(item.id); toast.success("Deleted"); }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <Badge variant="secondary" className="absolute top-1 left-1 text-[9px] opacity-80">
                {IMAGE_PRESETS.find((p) => p.id === item.preset)?.label || item.preset}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewItem?.name}</DialogTitle>
          </DialogHeader>
          {previewItem && (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center max-h-[60vh] overflow-auto">
                <img src={previewItem.data} alt={previewItem.name} className="max-w-full max-h-[50vh] object-contain" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div><Label className="text-xs text-muted-foreground">Dimensions</Label><p>{previewItem.width}×{previewItem.height}px</p></div>
                <div><Label className="text-xs text-muted-foreground">File Size</Label><p>{formatFileSize(previewItem.fileSize)}</p></div>
                <div><Label className="text-xs text-muted-foreground">Type</Label><p>{previewItem.type}</p></div>
                <div><Label className="text-xs text-muted-foreground">Preset</Label><p>{IMAGE_PRESETS.find((p) => p.id === previewItem.preset)?.label}</p></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => copyUrl(previewItem)}>
                  <Copy className="h-4 w-4 mr-2" /> Copy Image Data
                </Button>
                <Button variant="destructive" onClick={() => { deleteItem(previewItem.id); setPreviewItem(null); toast.success("Deleted"); }}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
