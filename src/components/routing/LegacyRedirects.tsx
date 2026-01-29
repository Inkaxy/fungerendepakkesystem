
import { Navigate, useParams } from 'react-router-dom';

/**
 * Redirects old /display/:displayUrl URLs to new /d/:displayUrl format
 * Handles both with and without "display-" prefix
 */
export const LegacyDisplayRedirect = () => {
  const { displayUrl } = useParams();
  
  // Remove "display-" prefix if present for cleaner URLs
  const cleanDisplayUrl = displayUrl?.replace(/^display-/, '') || displayUrl;
  
  return <Navigate to={`/d/${cleanDisplayUrl}`} replace />;
};

/**
 * Redirects old /display/shared/:bakeryId URLs to new /s/:shortId format
 */
export const LegacySharedRedirect = () => {
  const { bakeryId } = useParams();
  return <Navigate to={`/s/${bakeryId}`} replace />;
};
