/**
 * Loading Spinner Component
 * Reusable loading indicator
 */

function LoadingSpinner({ size = 'medium', className = '' }) {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div
      className={`${sizeClasses[size]} border-primary-200 border-t-primary-600 rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export default LoadingSpinner;
