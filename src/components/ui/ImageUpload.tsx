import React, { useRef, useState } from 'react';
import { useImageOCR, extractEventFromOCR } from '../../hooks/useImageOCR';
import { parseEventInput } from '../../utils/eventParser';

interface ImageUploadProps {
  onEventExtracted: (eventData: any) => void;
  onClose: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onEventExtracted, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const { isProcessing, error, result, processImage, reset } = useImageOCR();

  const handleFileSelect = async (file: File) => {
    if (file) {
      // Create preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Process with OCR
      await processImage(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleUseOCRResult = () => {
    if (result) {
      // Extract event data from OCR text
      const extractedData = extractEventFromOCR(result.text);
      
      // Enhance with AI parsing
      const combinedText = `${extractedData.title || ''} ${extractedData.date || ''} ${extractedData.time || ''} ${extractedData.location || ''}`.trim();
      const aiParsed = parseEventInput(combinedText);
      
      // Combine OCR and AI results
      const finalEventData = {
        title: extractedData.title || aiParsed.title,
        date: extractedData.date || aiParsed.date,
        time: extractedData.time || aiParsed.time,
        location: extractedData.location || aiParsed.location,
        type: aiParsed.type,
        description: extractedData.description || `Extracted from image: ${result.text.substring(0, 100)}...`,
      };
      
      onEventExtracted(finalEventData);
    }
  };

  const handleReset = () => {
    reset();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3>📷 Upload Event Poster</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <div className="modal-body" style={{ padding: '1.5rem' }}>
          {!previewUrl ? (
            <div
              className={`upload-area ${dragActive ? 'drag-active' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #ccc',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: dragActive ? '#f0f8ff' : '#fafafa',
                borderColor: dragActive ? '#2563eb' : '#ccc',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
              <h4>Drop an image here or click to browse</h4>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>
                Supports JPG, PNG, GIF up to 10MB
              </p>
              <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '1rem' }}>
                🤖 AI will automatically extract event details from your poster
              </p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              {isProcessing && (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div className="loading-spinner" style={{ width: '2rem', height: '2rem', margin: '0 auto 1rem' }}></div>
                  <p>🤖 Processing image with AI OCR...</p>
                </div>
              )}
              
              {error && (
                <div className="error-message" style={{ marginBottom: '1rem' }}>
                  {error}
                </div>
              )}
              
              {result && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4>📝 Extracted Text (Confidence: {Math.round(result.confidence * 100)}%)</h4>
                  <div style={{
                    background: '#f5f5f5',
                    padding: '1rem',
                    borderRadius: '4px',
                    maxHeight: '150px',
                    overflowY: 'auto',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {result.text}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </div>
        
        <div className="modal-actions" style={{ padding: '1rem 1.5rem', borderTop: '1px solid #eee' }}>
          {previewUrl && (
            <button onClick={handleReset} className="btn btn-outline">
              Upload Different Image
            </button>
          )}
          
          {result && (
            <button onClick={handleUseOCRResult} className="btn btn-primary">
              ✨ Create Event from OCR
            </button>
          )}
          
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
