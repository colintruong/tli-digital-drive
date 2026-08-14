export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic',
    'image/svg',
    'image/tif',
];

export const ALLOWED_VIDEO_TYPES = [
    'video/mp4',
    'video/mov',
    'video/mkv',
    'video/webm',
    'video/avi',
];

export const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

export const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB

export function isValidFileType(type: string): boolean {
    return ALLOWED_TYPES.includes(type);
}

export function isValidFileSize(size: number): boolean {
    return size <= MAX_FILE_SIZE;
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + ' ' + sizes[i];
}

export function generateFileKey(userId: string, fileName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '');

    return `files/${userId}/${timestamp}_${randomString}_${sanitizedFileName}`;
}

export function getFileType(mimeType: string): string {
    if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return 'image';
    if (ALLOWED_VIDEO_TYPES.includes(mimeType)) return 'video';
    throw new Error('Invalid file type');
}