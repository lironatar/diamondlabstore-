import React, { useState, useRef } from 'react';
import { Upload, X, RotateCcw, Image as ImageIcon, Camera } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CategoryImageUpload = ({ 
  value = null, 
  onChange, 
  className = '',
  disabled = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) {
      toast.error('לא נבחר קובץ');
      return false;
    }

    if (!acceptedTypes.includes(file.type)) {
      toast.error(`סוג קובץ לא נתמך. אנא בחר: ${acceptedTypes.join(', ')}`);
      return false;
    }

    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      toast.error(`גודל הקובץ חורג מהמותר (מקסימום ${maxSizeMB}MB)`);
      return false;
    }

    return true;
  };

  const uploadImage = async (file) => {
    if (!validateFile(file)) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const imageUrl = response.data.url;
      toast.success('התמונה הועלתה בהצלחה');
      return imageUrl;
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.detail || 'שגיאה בהעלאת התמונה';
      toast.error(errorMessage);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (file) => {
    if (!file || disabled) return;

    try {
      // Create immediate preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload file
      const imageUrl = await uploadImage(file);
      
      if (imageUrl) {
        // Update with server URL
        const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:8001${imageUrl}`;
        setPreview(fullImageUrl);
        
        // Notify parent component
        if (onChange) {
          onChange(imageUrl);
        }
      }
    } catch (error) {
      // Reset preview on error
      setPreview(value || '');
    }
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    
    if (disabled) return;

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    if (disabled) return;
    
    setPreview('');
    if (onChange) {
      onChange(null);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast.success('התמונה הוסרה');
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`category-image-upload ${className}`} dir="rtl">
      <style jsx="true">{`
        .category-image-upload {
          position: relative;
        }
        
        .upload-area {
          border: 2px dashed rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        
        .upload-area:hover:not(.disabled) {
          border-color: rgba(212, 175, 55, 0.5);
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.2);
        }
        
        .upload-area.dragover {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.1);
          transform: scale(1.02);
        }
        
        .upload-area.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: rgba(248, 249, 250, 0.8);
        }
        
        .preview-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 12px;
        }
        
        .upload-content {
          padding: 24px;
          text-align: center;
          color: #6b7280;
        }
        
        .upload-icon {
          margin: 0 auto 16px;
          color: #d4af37;
        }
        
        .upload-icon.uploading {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .remove-button {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 10;
        }
        
        .remove-button:hover {
          background: rgba(239, 68, 68, 1);
          transform: scale(1.1);
        }
        
        .upload-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(212, 175, 55, 0.2);
          overflow: hidden;
        }
        
        .upload-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #d4af37, #f4e4bc);
          animation: progress 1.5s ease-in-out infinite;
        }
        
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .file-info {
          margin-top: 8px;
          font-size: 12px;
          color: #9ca3af;
          text-align: center;
        }
      `}</style>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Area */}
      <div
        className={`upload-area ${dragOver ? 'dragover' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {preview ? (
          /* Image Preview */
          <div className="relative">
            <img
              src={preview}
              alt="תצוגה מקדימה"
              className="preview-image"
              onError={(e) => {
                console.error('Image load error:', e);
                setPreview('');
                toast.error('שגיאה בטעינת התמונה');
              }}
            />
            
            {/* Remove Button */}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="remove-button"
                title="הסר תמונה"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {/* Upload Progress */}
            {uploading && (
              <div className="upload-progress">
                <div className="upload-progress-bar" />
              </div>
            )}
          </div>
        ) : (
          /* Upload Prompt */
          <div className="upload-content">
            <div className={`upload-icon ${uploading ? 'uploading' : ''}`}>
              {uploading ? (
                <RotateCcw className="w-12 h-12" />
              ) : (
                <Camera className="w-12 h-12" />
              )}
            </div>
            
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {uploading ? 'מעלה תמונה...' : 'העלה תמונת קטגוריה'}
            </h4>
            
            <p className="text-gray-600 text-sm mb-2">
              {uploading ? 'אנא המתן...' : 'לחץ או גרור תמונה לכאן'}
            </p>
            
            <div className="file-info">
              <p>JPG, PNG, GIF או WebP</p>
              <p>מקסימום {Math.round(maxSize / (1024 * 1024))}MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryImageUpload; 