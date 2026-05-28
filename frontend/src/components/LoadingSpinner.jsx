export default function LoadingSpinner({ size = 'md', text }) {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-2 border-ghost-500/30 border-t-ghost-400`}
      />
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  );
}
