import React, { useState, useRef } from 'react';
import './ImageDropzone.css';

function ImageDropzone({ solutionId, onImageUploaded, onClose }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    setError('');
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Please select only image files');
      return;
    }

    for (const file of imageFiles) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`http://localhost:3001/api/solutions/${solutionId}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadedImages(prev => [...prev, data]);
      
      if (onImageUploaded) {
        onImageUploaded(data.url);
      }
    } catch (error) {
      setError(`Failed to upload ${file.name}`);
    } finally {
      setUploading(false);
    }
  };

  const loadExistingImages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/solutions/${solutionId}/images`);
      if (response.ok) {
        const images = await response.json();
        setUploadedImages(images);
      }
    } catch (error) {
      console.error('Failed to load existing images:', error);
    }
  };

  // Load existing images on mount
  React.useEffect(() => {
    loadExistingImages();
  }, [solutionId]);

  return (
    <div className="image-dropzone-overlay" onClick={onClose}>
      <div className="image-dropzone-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dropzone-header">
          <h3>Upload Images</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div
          className={`dropzone-area ${isDragging ? 'dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <div className="dropzone-content">
            <div className="upload-icon">📁</div>
            <p>Drag and drop images here or click to browse</p>
            <p className="file-types">Supports: JPG, PNG, GIF, WebP</p>
          </div>
        </div>

        {error && (
          <div className="upload-error">{error}</div>
        )}

        {uploading && (
          <div className="upload-progress">Uploading...</div>
        )}

        {uploadedImages.length > 0 && (
          <div className="uploaded-images">
            <h4>Available Images (click to insert)</h4>
            <div className="image-grid">
              {uploadedImages.map((image, index) => (
                <div
                  key={index}
                  className="uploaded-image"
                  onClick={() => {
                    if (onImageUploaded) {
                      onImageUploaded(image.url);
                    }
                  }}
                >
                  <img src={image.url} alt={image.filename} />
                  <div className="image-filename">{image.filename}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageDropzone;