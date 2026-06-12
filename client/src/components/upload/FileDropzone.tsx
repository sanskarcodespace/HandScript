'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, FileText, Image as ImageIcon, File as FileIcon, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUploadStore, FileWithPreview } from '../../store/uploadStore';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 3;
const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

export const FileDropzone = () => {
  const { files, setFiles, removeFile, isUploading } = useUploadStore();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileIcon className="h-6 w-6 text-red-500" />;
    if (mimeType.includes('document')) return <FileText className="h-6 w-6 text-blue-500" />;
    if (mimeType.includes('image')) return <ImageIcon className="h-6 w-6 text-green-500" />;
    return <FileIcon className="h-6 w-6 text-gray-500" />;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setErrorMessages([]); // Clear previous errors

      if (fileRejections.length > 0) {
        const errors = fileRejections.map(rejection => {
          if (rejection.errors[0]?.code === 'file-too-large') return `"${rejection.file.name}" is too large (max 10MB)`;
          if (rejection.errors[0]?.code === 'file-invalid-type') return `"${rejection.file.name}" has an unsupported format`;
          if (rejection.errors[0]?.code === 'too-many-files') return `Too many files selected (max ${MAX_FILES})`;
          return rejection.errors[0]?.message;
        });
        setErrorMessages(Array.from(new Set(errors)));
      }

      if (acceptedFiles.length > 0) {
        const remainingSlots = MAX_FILES - files.length;
        if (remainingSlots <= 0) {
          setErrorMessages((prev) => [...prev, `You can only upload up to ${MAX_FILES} files.`]);
          return;
        }

        const filesToAdd = acceptedFiles.slice(0, remainingSlots).map((file) => {
          const newFile = file as FileWithPreview;
          newFile.id = Math.random().toString(36).substring(7) + Date.now().toString();
          if (file.type.startsWith('image/')) {
            newFile.preview = URL.createObjectURL(file);
          }
          return newFile;
        });

        setFiles([...files, ...filesToAdd]);
      }
    },
    [files, setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES,
    disabled: isUploading || files.length >= MAX_FILES,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200',
          isDragActive
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
            : 'border-gray-300 bg-gray-50 hover:border-brand-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:hover:bg-gray-800',
          (isUploading || files.length >= MAX_FILES) && 'cursor-not-allowed opacity-60'
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud
          className={cn(
            'mb-4 h-12 w-12 transition-transform duration-200',
            isDragActive ? 'scale-110 text-brand-600 dark:text-brand-400' : 'text-gray-400'
          )}
        />
        <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {isDragActive ? 'Drop files here' : 'Drop your assignment files here'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          PDF, DOCX, JPG, PNG — up to 10MB per file, max 3 files
        </p>
        
        {!(isUploading || files.length >= MAX_FILES) && (
          <button
            type="button"
            className="mt-6 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-700"
          >
            or Browse Files
          </button>
        )}
      </div>

      {/* Error Messages */}
      {errorMessages.length > 0 && (
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/30" role="alert">
          <ul className="list-inside list-disc text-sm text-red-600 dark:text-red-400">
            {errorMessages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* File Queue */}
      {files.length > 0 && (
        <div aria-live="polite" className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  {getFileIcon(file.type)}
                </div>
                <div className="truncate">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                  // Clean up preview URL
                  if (file.preview) URL.revokeObjectURL(file.preview);
                }}
                disabled={isUploading}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800 dark:hover:text-red-400 disabled:opacity-50"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
