'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

const ImageUpload = ({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    
    try {
      const newImages: string[] = []
      
      for (const file of acceptedFiles) {
        try {
          // Convert file to base64 with compression
          const base64 = await convertToBase64(file)
          newImages.push(base64)
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error)
          // Show user-friendly error message
          alert(`Error processing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
      
      // Add new images to existing ones (up to maxImages)
      const updatedImages = [...images, ...newImages].slice(0, maxImages)
      onImagesChange(updatedImages)
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Error uploading images. Please try again.')
    } finally {
      setUploading(false)
    }
  }, [images, onImagesChange, maxImages])

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Check file size (max 2MB per image)
      if (file.size > 2 * 1024 * 1024) {
        reject(new Error('Image size must be less than 2MB'))
        return
      }

      // Create canvas to compress image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions (max 800px width/height)
        const maxSize = 800
        let { width, height } = img
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress image
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Convert to base64 with compression (0.8 quality)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)
        resolve(compressedBase64)
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        img.src = reader.result as string
      }
      reader.onerror = error => reject(error)
    })
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    onImagesChange(updatedImages)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: maxImages - images.length,
    disabled: uploading || images.length >= maxImages
  })

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Project Images *
      </label>
      
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
        } ${uploading || images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto" />
          {isDragActive ? (
            <p className="text-primary-600 dark:text-primary-400 font-medium">
              Drop images here...
            </p>
          ) : (
            <div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                Drag & drop images here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF, WebP up to {maxImages} images (max 2MB each)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Images Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={image}
                  alt={`Project image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                Image {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="flex items-center justify-center space-x-2 text-primary-600 dark:text-primary-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span className="text-sm">Uploading images...</span>
        </div>
      )}

      {/* Image Count */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {images.length} / {maxImages} images uploaded
      </div>
    </div>
  )
}

export default ImageUpload
