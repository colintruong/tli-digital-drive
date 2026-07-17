export interface MediaItem {
    id: string;
    user_id: string;
    file_name: string;
    file_key: string;
    file_type: 'image' | 'video';
    mime_type: string;
    file_size: number;
    created_at: string;
    deleted_at: string | null;
}

export interface UploadProgress {
    file_name: string;
    progress: number;
    status: 'uploading' | 'completed' | 'failed';
    error?: string;
}