import { useState, useCallback } from 'react';
import { createWorker } from 'tesseract.js';

interface OCRResult {
  text: string;
  confidence: number;
}

interface UseImageOCRResult {
  isProcessing: boolean;
  error: string | null;
  result: OCRResult | null;
  processImage: (file: File) => Promise<void>;
  reset: () => void;
}

export const useImageOCR = (): UseImageOCRResult => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OCRResult | null>(null);

  const processImage = useCallback(async (file: File) => {
    if (!file) {
      setError('No file provided');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file is too large. Please select a file smaller than 10MB');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      // Create Tesseract worker
      const worker = await createWorker('eng');
      
      // Configure worker for better performance with event posters
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,:-/()@',
        tessedit_pageseg_mode: '6', // Uniform block of text
      });

      // Process the image
      const { data } = await worker.recognize(file);
      
      // Clean up the recognized text
      const cleanedText = cleanOCRText(data.text);
      
      setResult({
        text: cleanedText,
        confidence: data.confidence / 100, // Convert to 0-1 scale
      });

      // Terminate worker to free memory
      await worker.terminate();
    } catch (err) {
      console.error('OCR processing error:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setError(null);
    setResult(null);
  }, []);

  return {
    isProcessing,
    error,
    result,
    processImage,
    reset,
  };
};

// Helper function to clean OCR text
function cleanOCRText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove common OCR artifacts
    .replace(/[|\\]/g, '')
    // Fix common character misrecognitions
    .replace(/0/g, 'O') // In event names, 0 is often O
    .replace(/1/g, 'I') // In event names, 1 is often I
    // Clean up line breaks
    .replace(/\n+/g, ' ')
    // Trim whitespace
    .trim();
}

// Helper function to extract event information from OCR text
export function extractEventFromOCR(ocrText: string): {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
} {
  const text = ocrText.toLowerCase();
  const lines = ocrText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const extracted: any = {};
  
  // Try to find title (usually the largest/first text)
  if (lines.length > 0) {
    extracted.title = lines[0];
  }
  
  // Look for date patterns
  const datePatterns = [
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g,
    /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/g,
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}/gi,
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}/gi,
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      extracted.date = match[0];
      break;
    }
  }
  
  // Look for time patterns
  const timePatterns = [
    /(\d{1,2}:\d{2}\s*[ap]m)/gi,
    /(\d{1,2}:\d{2})/g,
    /(morning|afternoon|evening|night)/gi,
  ];
  
  for (const pattern of timePatterns) {
    const match = text.match(pattern);
    if (match) {
      extracted.time = match[0];
      break;
    }
  }
  
  // Look for location indicators
  const locationKeywords = ['at', 'venue', 'location', 'address', 'hall', 'center', 'university', 'college'];
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    for (const keyword of locationKeywords) {
      if (lowerLine.includes(keyword)) {
        extracted.location = line;
        break;
      }
    }
    if (extracted.location) break;
  }
  
  // Look for online indicators
  if (text.includes('online') || text.includes('virtual') || text.includes('zoom') || text.includes('meet')) {
    extracted.location = 'Online';
  }
  
  // Create description from remaining text
  const usedLines = [extracted.title, extracted.date, extracted.time, extracted.location].filter(Boolean);
  const remainingLines = lines.filter(line => 
    !usedLines.some(used => line.toLowerCase().includes(used?.toLowerCase() || ''))
  );
  
  if (remainingLines.length > 0) {
    extracted.description = remainingLines.join(' ').substring(0, 200) + '...';
  }
  
  return extracted;
}
