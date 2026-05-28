import { useCallback, useState } from 'react';

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE = 5 * 1024 * 1024;

export default function ImageDropzone({ onFileSelect, preview, disabled }) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const validate = (file) => {
    if (!ACCEPTED.includes(file.type)) {
      return 'Only JPEG and PNG images are allowed';
    }
    if (file.size > MAX_SIZE) {
      return 'File must be under 5MB';
    }
    return null;
  };

  const handleFile = useCallback(
    (file) => {
      const err = validate(file);
      if (err) {
        setError(err);
        return;
      }
      setError('');
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
          dragOver
            ? 'border-ghost-400 bg-ghost-500/10'
            : 'border-white/20 bg-white/5 hover:border-ghost-500/40 hover:bg-white/10'
        } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={onChange}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={disabled}
        />

        {preview ? (
          <img
            src={preview}
            alt="Stance preview"
            className="max-h-64 rounded-xl object-contain"
          />
        ) : (
          <>
            <div className="mb-4 text-5xl opacity-60">🏏</div>
            <p className="font-medium text-white">Drop your batting stance image here</p>
            <p className="mt-1 text-sm text-gray-500">or click to browse</p>
            <p className="mt-3 text-xs text-gray-600">JPEG or PNG · Max 5MB</p>
          </>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
