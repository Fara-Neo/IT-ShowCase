"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";

interface ProjectImageUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
}

interface SignedUploadResponse {
  uploadUrl: string;
  params: Record<string, string | number>;
}

export function ProjectImageUpload({
  onUpload,
  currentUrl,
}: ProjectImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Только изображения");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Максимальный размер файла: 10 МБ");
      return;
    }

    setIsUploading(true);
    try {
      const signedRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name }),
      });

      if (!signedRes.ok) {
        throw new Error("Не удалось получить подпись загрузки");
      }

      const signedPayload = (await signedRes.json()) as SignedUploadResponse;
      const directFormData = new FormData();
      directFormData.append("file", file);

      for (const [key, value] of Object.entries(signedPayload.params)) {
        directFormData.append(key, String(value));
      }

      const res = await fetch(signedPayload.uploadUrl, {
        method: "POST",
        body: directFormData,
      });

      if (!res.ok) {
        let message = "Не удалось загрузить файл в Cloudinary";
        try {
          const errorData = (await res.json()) as {
            error?: { message?: string };
          };
          if (errorData.error?.message) {
            message = `Cloudinary: ${errorData.error.message}`;
          }
        } catch {
          // Keep fallback error message for non-JSON responses.
        }
        throw new Error(message);
      }

      const uploadResult = (await res.json()) as { secure_url?: string };
      if (!uploadResult.secure_url) {
        throw new Error("Cloudinary вернул некорректный ответ");
      }

      setPreview(uploadResult.secure_url);
      onUpload(uploadResult.secure_url);
      toast.success("Изображение загружено");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ошибка загрузки изображения"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => {
              setPreview(null);
              onUpload("");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-2 aspect-video rounded-lg border-2 border-dashed border-muted-foreground/30 cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Нажмите для загрузки изображения
              </p>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
}
