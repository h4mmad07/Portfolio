import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  PortfolioProfile, 
  Project, 
  Certification, 
  Experience, 
  Education, 
  Service, 
  ContactMessage, 
  SiteSettings 
} from '../types/portfolio';

const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof rawUrl === 'string' &&
    rawUrl.startsWith('https://') &&
    !rawUrl.includes('your-project-id') &&
    typeof rawKey === 'string' &&
    rawKey.length > 20 &&
    !rawKey.includes('your-anon-key')
  );
};

// Create client or mock if unconfigured to prevent fatal initialization crashes
export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(rawUrl, rawKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createClient('https://placeholder-project.supabase.co', 'placeholder-key-000000000000000000000000', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

/**
 * File upload handler with validation for size & MIME type.
 * Supports public Supabase Storage buckets: 'portfolio-media' and 'portfolio-documents'.
 */
export async function uploadPortfolioFile(
  file: File,
  bucket: 'portfolio-media' | 'portfolio-documents',
  prefix = ''
): Promise<{ url: string; error?: string }> {
  // Size validation
  const maxBytes = bucket === 'portfolio-documents' ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB vs 5MB
  if (file.size > maxBytes) {
    return {
      url: '',
      error: `File size exceeds the limit of ${bucket === 'portfolio-documents' ? '10MB' : '5MB'}.`
    };
  }

  // Type validation
  const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
  if (bucket === 'portfolio-documents' && file.type !== 'application/pdf') {
    return { url: '', error: 'Documents must be in PDF format.' };
  }
  if (bucket === 'portfolio-media') {
    const isImage = file.type.startsWith('image/');
    const isVideo = VIDEO_MIME_TYPES.includes(file.type);
    const isPdf = file.type === 'application/pdf';
    if (!isImage && !isVideo && !isPdf) {
      return { url: '', error: 'Only image files (PNG, JPG, WEBP, SVG), video files (MP4, WebM, OGG), and PDF documents are allowed.' };
    }
    if (isVideo && file.size > 50 * 1024 * 1024) {
      return { url: '', error: 'Video file size exceeds the limit of 50MB.' };
    }
    if (isPdf && file.size > 10 * 1024 * 1024) {
      return { url: '', error: 'PDF file size exceeds the limit of 10MB.' };
    }
  }

  if (!isSupabaseConfigured()) {
    // Local fallback for offline/demo testing
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ url: reader.result as string });
      reader.onerror = () => resolve({ url: '', error: 'Failed to read file locally.' });
      reader.readAsDataURL(file);
    });
  }

  try {
    const fileExt = file.name.split('.').pop() || 'bin';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${prefix ? prefix + '/' : ''}${Date.now()}_${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return { url: '', error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return { url: publicUrlData.publicUrl };
  } catch (err: any) {
    console.error('File upload exception:', err);
    return { url: '', error: err.message || 'File upload failed.' };
  }
}

/**
 * Submit Contact Message
 */
export async function sendContactInquiry(inquiry: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    // Store in local storage for demo if supabase not connected
    try {
      const existing = JSON.parse(localStorage.getItem('portfolio_local_messages') || '[]');
      existing.unshift({ ...inquiry, id: `msg-${Date.now()}`, created_at: new Date().toISOString(), is_read: false });
      localStorage.setItem('portfolio_local_messages', JSON.stringify(existing));
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Failed to save local message.' };
    }
  }

  const { error } = await supabase
    .from('portfolio_contact_messages')
    .insert([inquiry]);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
