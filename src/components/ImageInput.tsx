import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaSpinner, FaTrash, FaInfoCircle } from "react-icons/fa";
import { useController, Control } from "react-hook-form";

interface ImageFile {
  file: File;
  preview: string;
}

interface EnhancedImageInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  maxImages?: number;
  multiple?: boolean;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in bytes
  rejectDuplicates?: boolean;
  showLabel?: boolean;
}

export function ImageInput({
  name,
  control,
  label = "Upload Images",
  maxImages = 5,
  multiple = true,
  acceptedFileTypes = "image/*",
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  rejectDuplicates = false,
  showLabel = false,
}: EnhancedImageInputProps) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: [],
  });

  const [dragActive, setDragActive] = React.useState(false);
  const [showGuide, setShowGuide] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, []);

  const handleFiles = useCallback(
    (files: FileList) => {
      const newFiles = Array.from(files)
        .filter((file) => {
          if (!file.type.match(acceptedFileTypes)) {
            alert(`File ${file.name} is not an accepted file type.`);
            return false;
          }
          if (file.size > maxFileSize) {
            alert(
              `File ${file.name} is too large. Maximum size is ${
                maxFileSize / 1024 / 1024
              }MB.`
            );
            return false;
          }
          if (
            rejectDuplicates &&
            value.some((img: ImageFile) => img.file.name === file.name)
          ) {
            alert(`File ${file.name} is already selected.`);
            return false;
          }
          return true;
        })
        .slice(0, multiple ? maxImages - value.length : 1)
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));

      const updatedFiles = multiple ? [...value, ...newFiles] : newFiles;
      onChange(updatedFiles);
    },
    [
      value,
      onChange,
      multiple,
      maxImages,
      acceptedFileTypes,
      maxFileSize,
      rejectDuplicates,
    ]
  );

  const handleDelete = useCallback(
    (index: number) => {
      const updatedFiles = value.filter(
        (_: ImageFile, i: number) => i !== index
      );
      onChange(updatedFiles);
    },
    [value, onChange]
  );

  const onButtonClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const toggleGuide = useCallback(() => {
    setShowGuide((prev) => !prev);
  }, []);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "p-4 border-2 border-dashed rounded-lg transition-colors",
          dragActive ? "border-primary" : "border-input",
          value.length === 0 ? "h-32" : "min-h-[8rem]"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {showLabel && (
          <Label htmlFor="image-input" className="block mb-2">
            {label}
          </Label>
        )}
        {value.length === 0 ? (
          <div
            className="flex items-center justify-center h-full cursor-pointer"
            onClick={onButtonClick}
          >
            <p className="text-sm text-muted-foreground">
              Drag and drop images here, or click to select
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-4">
            {value.map((image: ImageFile, index: number) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-6 h-6"
                  onClick={() => handleDelete(index)}
                >
                  <FaTrash className="h-3 w-3" />
                  <span className="sr-only">Delete image {index + 1}</span>
                </Button>
              </div>
            ))}
            {(multiple ? value.length < maxImages : value.length === 0) && (
              <div
                className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-muted/50"
                onClick={onButtonClick}
              >
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Add more images
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        <Input
          id="image-input"
          ref={inputRef}
          type="file"
          accept={acceptedFileTypes}
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
          aria-label={label}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {multiple
            ? `${value.length} of ${maxImages} images selected`
            : `${value.length ? "1 image" : "No image"} selected`}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleGuide}
          className="text-primary"
        >
          <FaInfoCircle className="mr-2 h-4 w-4" />
          {showGuide ? "Hide" : "Show"} Guide
        </Button>
      </div>
      {showGuide && (
        <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md">
          <p>Accepted file types: {acceptedFileTypes}</p>
          <p>Maximum file size: {maxFileSize / 1024 / 1024}MB</p>
          {rejectDuplicates && <p>Duplicate files will be rejected</p>}
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
