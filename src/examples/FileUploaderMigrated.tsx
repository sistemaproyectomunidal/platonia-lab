// @ts-nocheck
/**
 * FileUploader Component - Migrated to New Architecture
 * This is an example of how to migrate an existing component to use the new hooks
 */

import React, { useCallback, useState } from 'react';
import { useFileUpload } from '@/hooks/queries';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function FileUploaderNew() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Use the new hook with optimized caching and error handling
  const uploadMutation = useFileUpload({
    onSuccess: (response) => {
      if (response.data) {
        toast.success(`Archivo subido: ${response.data.filename}`);
        console.log('Upload result:', response.data);
        setSelectedFile(null);
      }
    },
    onError: (error) => {
      toast.error(`Error al subir: ${error.message}`);
    },
  });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleUpload = useCallback(() => {
    if (!selectedFile) {
      toast.error('Selecciona un archivo primero');
      return;
    }

    uploadMutation.mutate(selectedFile);
  }, [selectedFile, uploadMutation]);

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Subir Archivo</h3>
      
      <div className="flex items-center gap-4">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={uploadMutation.isPending}
          className="flex-1"
        />
        
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploadMutation.isPending}
        >
          {uploadMutation.isPending ? 'Subiendo...' : 'Subir'}
        </Button>
      </div>

      {selectedFile && (
        <div className="text-sm text-gray-600">
          Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
        </div>
      )}

      {uploadMutation.isPending && (
        <div className="text-sm text-blue-600">
          Subiendo archivo...
        </div>
      )}

      {uploadMutation.isError && (
        <div className="text-sm text-red-600">
          Error: {uploadMutation.error.message}
        </div>
      )}

      {uploadMutation.isSuccess && uploadMutation.data.data && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
          <p className="font-medium text-green-800">¡Archivo subido exitosamente!</p>
          <p className="text-green-700 mt-1">
            ID: {uploadMutation.data.data.id}
          </p>
          {uploadMutation.data.data.public_url && (
            <a 
              href={uploadMutation.data.data.public_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Ver archivo
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Comparison: Old vs New Implementation
 * 
 * OLD (using useBackend):
 * ```typescript
 * import { useFileUpload } from '@/hooks/useBackend';
 * 
 * const mutation = useFileUpload({
 *   onSuccess: (result) => {
 *     if (result.ok && result.upload) {
 *       // handle success
 *     }
 *   }
 * });
 * 
 * mutation.mutate(file);
 * ```
 * 
 * NEW (using queries):
 * ```typescript
 * import { useFileUpload } from '@/hooks/queries';
 * 
 * const uploadMutation = useFileUpload({
 *   onSuccess: (response) => {
 *     if (response.data) {
 *       // handle success - now with better types
 *     }
 *   },
 *   onError: (error) => {
 *     // automatic error handling
 *   }
 * });
 * 
 * uploadMutation.mutate(file);
 * // Benefits:
 * // - Better TypeScript support
 * // - Automatic error handling
 * // - Loading states (isPending, isError, isSuccess)
 * // - Automatic query invalidation
 * ```
 */
