import { apiConfig } from './api';

/**
 * Get full image URL with dynamic backend base URL
 * @param {string} imageUrl - The image URL (can be relative or absolute)
 * @returns {string} Full image URL
 */
export const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If it's already a full HTTP(S) URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it starts with a slash, append to base URL
  if (imageUrl.startsWith('/')) {
    return `${apiConfig.baseURL}${imageUrl}`;
  }
  
  // Otherwise, assume it needs the uploads path
  return `${apiConfig.baseURL}/${imageUrl}`;
};

/**
 * Get optimized image URL for different sizes
 * @param {string} imageUrl - The base image URL
 * @param {string} size - Size variant (thumbnail, medium, large)
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (imageUrl, size = 'medium') => {
  const fullUrl = getFullImageUrl(imageUrl);
  
  // If the backend supports image optimization, add size parameter
  // For now, return the full URL
  return fullUrl;
};

/**
 * Handle multiple image sources (arrays, objects, strings)
 * @param {any} imageSource - Various image source formats
 * @returns {string} Full image URL
 */
export const normalizeImageUrl = (imageSource) => {
  if (!imageSource) return '';
  
  // If it's a string, process directly
  if (typeof imageSource === 'string') {
    return getFullImageUrl(imageSource);
  }
  
  // If it's an object with image_url property
  if (imageSource.image_url) {
    return getFullImageUrl(imageSource.image_url);
  }
  
  // If it's an object with url property
  if (imageSource.url) {
    return getFullImageUrl(imageSource.url);
  }
  
  // If it's an array, get the first image
  if (Array.isArray(imageSource) && imageSource.length > 0) {
    return normalizeImageUrl(imageSource[0]);
  }
  
  return '';
};

export default {
  getFullImageUrl,
  getOptimizedImageUrl,
  normalizeImageUrl
}; 