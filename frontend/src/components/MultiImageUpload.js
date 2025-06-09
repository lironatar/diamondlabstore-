import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, X, Upload, Image as ImageIcon, Trash2, RotateCcw, Star } from 'lucide-react';

const MultiImageUpload = ({ 
  value = [], 
  onChange, 
  maxFiles = 10, 
  productId = null,
  disabled = false 
}) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Initialize images from value prop
  useEffect(() => {
    if (value && value.length > 0) {
      const formattedImages = value.map((img, index) => ({
        id: img.id || `temp-${index}`,
        url: img.image_url || img.url || img,
        alt_text: img.alt_text || '',
        is_primary: img.is_primary || false,
        sort_order: img.sort_order || index,
        uploaded: true
      }));
      setImages(formattedImages);
    }
  }, [value]);

  // Handle file upload to server
  const uploadToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // Handle file drop/selection
  const onDrop = useCallback(async (acceptedFiles) => {
    if (images.length + acceptedFiles.length > maxFiles) {
      toast.error(`ניתן להעלות עד ${maxFiles} תמונות בלבד`);
      return;
    }

    setUploading(true);
    const uploadedImages = [];

    try {
      // Process each file individually
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        
        try {
          console.log('Uploading file:', file.name);
          const uploadedUrl = await uploadToServer(file);
          console.log('Upload successful:', uploadedUrl);
          
          const newImage = {
            id: `uploaded-${Date.now()}-${i}`,
            url: uploadedUrl,
            image_url: uploadedUrl,
            alt_text: '',
            is_primary: images.length === 0 && uploadedImages.length === 0, // First image is primary
            sort_order: images.length + uploadedImages.length,
            uploaded: true,
            uploading: false
          };
          
          uploadedImages.push(newImage);
          
          // Note: We don't save to backend here for existing products
          // Images will be saved when the form is submitted in AdminProducts
          // This prevents duplicate saves and allows proper error handling
          if (productId) {
            console.log('Image uploaded, will be saved on form submission for product:', productId);
          }
          
        } catch (error) {
          console.error('Failed to upload file:', file.name, error);
          toast.error(`שגיאה בהעלאת ${file.name}`);
        }
      }

      if (uploadedImages.length > 0) {
        // Update images state
        const updatedImages = [...images, ...uploadedImages];
        setImages(updatedImages);
        
        // Notify parent component immediately with the new state
        if (onChange) {
          console.log('Calling onChange with:', updatedImages);
          onChange(updatedImages);
        }
        
        toast.success(`${uploadedImages.length} תמונות הועלו בהצלחה`);
      }
      
    } catch (error) {
      console.error('Upload process error:', error);
      toast.error('שגיאה בתהליך ההעלאה');
    } finally {
      setUploading(false);
    }
  }, [images, maxFiles, productId, onChange]);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: maxFiles - images.length,
    disabled: disabled || uploading,
    multiple: true
  });

  // Remove image
  const removeImage = async (imageId) => {
    try {
      const imageToRemove = images.find(img => img.id === imageId);
      
      // Only delete from backend if it's a numeric ID (existing image in database)
      if (imageToRemove?.uploaded && productId && typeof imageToRemove.id === 'number') {
        try {
          await axios.delete(`/products/images/${imageToRemove.id}`);
          console.log('Deleted image from backend:', imageToRemove.id);
        } catch (error) {
          console.error('Failed to delete image from backend:', error);
          // Continue with local removal even if backend fails
        }
      }

      const updatedImages = images.filter(img => img.id !== imageId)
        .map((img, index) => ({ ...img, sort_order: index }));
      
      setImages(updatedImages);
      
      if (onChange) {
        onChange(updatedImages);
      }

      toast.success('התמונה נמחקה בהצלחה');
    } catch (error) {
      console.error('Failed to remove image:', error);
      toast.error('שגיאה במחיקת התמונה');
    }
  };

  // Set primary image
  const setPrimary = (imageId) => {
    const updatedImages = images.map(img => ({
      ...img,
      is_primary: img.id === imageId
    }));
    
    setImages(updatedImages);

    if (onChange) {
      onChange(updatedImages);
    }
  };

  // Clear all images
  const clearAll = () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את כל התמונות?')) {
      // Revoke preview URLs
      images.forEach(img => {
        if (!img.uploaded && img.url) {
          URL.revokeObjectURL(img.url);
        }
      });
      
      setImages([]);
      if (onChange) {
        onChange([]);
      }
    }
  };

  // Get dropzone styling
  const getDropzoneStyle = () => {
    let baseStyle = 'dropzone-base';
    if (isDragActive) baseStyle += ' dropzone-active';
    if (isDragAccept) baseStyle += ' dropzone-accept';
    if (isDragReject) baseStyle += ' dropzone-reject';
    if (disabled || uploading) baseStyle += ' dropzone-disabled';
    return baseStyle;
  };

  return (
    <div className="multi-image-upload" dir="rtl">
      {/* Enhanced Styles */}
      <style jsx="true">{`
        .multi-image-upload {
          width: 100%;
        }
        
        .dropzone-base {
          border: 2px dashed rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          padding: 32px 16px;
          text-align: center;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .dropzone-base:hover {
          border-color: rgba(212, 175, 55, 0.5);
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
        }
        
        .dropzone-active {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.1);
          transform: scale(1.02);
        }
        
        .dropzone-accept {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }
        
        .dropzone-reject {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
        
        .dropzone-disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .upload-icon {
          width: 48px;
          height: 48px;
          margin-bottom: 16px;
          color: #d4af37;
          opacity: 0.7;
        }
        
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }
        
        .image-preview {
          position: relative;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(212, 175, 55, 0.1);
          transition: all 0.3s ease;
        }
        
        .image-preview:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          border-color: rgba(212, 175, 55, 0.3);
        }
        
        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .image-preview:hover .image-overlay {
          opacity: 1;
        }
        
        .overlay-buttons {
          display: flex;
          gap: 8px;
        }
        
        .overlay-button {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #374151;
        }
        
        .overlay-button:hover {
          background: white;
          transform: scale(1.1);
        }
        
        .overlay-button.danger:hover {
          background: #ef4444;
          color: white;
        }
        
        .overlay-button.primary:hover {
          background: #d4af37;
          color: white;
        }
        
        .primary-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: linear-gradient(135deg, #d4af37, #f4e4bc);
          color: #8b5a00;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .uploading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(212, 175, 55, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        .upload-stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          padding: 12px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 12px;
          font-size: 14px;
          color: #8b5a00;
        }
        
        .clear-button {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #dc2626;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 12px;
          font-weight: 500;
        }
        
        .clear-button:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
        }
      `}</style>

      {/* Dropzone Area */}
      <div {...getRootProps({ className: getDropzoneStyle() })}>
        <input {...getInputProps()} />
        
        <div className="upload-icon">
          {uploading ? (
            <div className="animate-spin">
              <RotateCcw className="w-12 h-12" />
            </div>
          ) : (
            <Upload className="w-12 h-12" />
          )}
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {uploading ? 'מעלה תמונות...' : 'העלה תמונות מוצר'}
          </h3>
          <p className="text-gray-600 mb-2">
            {isDragActive ? (
              isDragAccept ? (
                'שחרר לשמירת התמונות'
              ) : (
                'קבצים לא נתמכים'
              )
            ) : (
              'גרור תמונות לכאן או לחץ לבחירה'
            )}
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG, GIF עד {maxFiles} תמונות • מקסימום 5MB לכל תמונה
          </p>
        </div>
      </div>

      {/* Upload Statistics */}
      {images.length > 0 && (
        <div className="upload-stats">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              {images.length} / {maxFiles} תמונות
            </span>
            {images.some(img => img.is_primary) && (
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-current" />
                תמונה ראשית נבחרה
              </span>
            )}
          </div>
          {images.length > 1 && (
            <button 
              onClick={clearAll}
              className="clear-button"
              disabled={uploading}
            >
              <Trash2 className="w-3 h-3 inline ml-1" />
              נקה הכל
            </button>
          )}
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="preview-grid">
          {images.map((image, index) => (
            <div key={image.id} className="image-preview">
              <img
                src={image.url?.startsWith('http') ? image.url : `http://localhost:8001${image.url || image.image_url}`}
                alt={image.alt_text || `תמונה ${index + 1}`}
                draggable={false}
                onError={(e) => {
                  console.error('Failed to load image:', image.url);
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Primary Badge */}
              {image.is_primary && (
                <div className="primary-badge">
                  <Star className="w-3 h-3 fill-current" />
                  ראשית
                </div>
              )}
              
              {/* Uploading Overlay */}
              {image.uploading && (
                <div className="uploading-overlay">
                  <div className="text-center">
                    <RotateCcw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <div>מעלה...</div>
                  </div>
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className="image-overlay">
                <div className="overlay-buttons">
                  {!image.is_primary && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrimary(image.id);
                      }}
                      className="overlay-button primary"
                      title="הגדר כתמונה ראשית"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="overlay-button danger"
                    title="מחק תמונה"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add More Button */}
          {images.length < maxFiles && !uploading && (
            <div 
              {...getRootProps({ 
                className: `image-preview flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-amber-400 bg-gray-50 hover:bg-amber-50 transition-all duration-300`
              })}
            >
              <input {...getInputProps()} />
              <div className="text-center text-gray-500">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm font-medium">הוסף עוד</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload; 