import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionsAPI } from '../services/api';
import ImageDropzone from '../components/ImageDropzone';
import LoadingSpinner from '../components/LoadingSpinner';
import StanceOverlay from '../components/StanceOverlay';
import ScoreBadge from '../components/ScoreBadge';

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await sessionsAPI.upload(formData);
      setResult(data.data.session);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Analyze Your Stance</h1>
        <p className="mt-1 text-gray-400">
          Upload a clear side-view photo of your batting stance for AI coaching
        </p>
      </div>

      {!result && (
        <>
          <ImageDropzone
            onFileSelect={handleFileSelect}
            preview={preview}
            disabled={analyzing}
          />

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {preview && !analyzing && (
            <button onClick={handleAnalyze} className="btn-primary mt-6 w-full">
              Analyze Stance
            </button>
          )}

          {analyzing && (
            <div className="mt-8 flex flex-col items-center rounded-2xl border border-ghost-500/20 bg-ghost-500/5 py-12">
              <LoadingSpinner size="lg" />
              <p className="mt-4 font-display text-lg font-semibold text-ghost-300">
                Analyzing stance...
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Our AI coach is reviewing your balance, grip, and footwork
              </p>
              <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
                <div className="h-full animate-pulse rounded-full bg-gradient-to-r from-ghost-500 to-ghost-400" />
              </div>
            </div>
          )}
        </>
      )}

      {result && (
        <div className="space-y-6 animate-fade-in">
          <div className="gradient-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white">Analysis Complete</h2>
              <ScoreBadge score={result.overallScore} showLabel />
            </div>

            <StanceOverlay imageUrl={result.imageUrl} />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-emerald-500/10 p-4">
                <h3 className="font-semibold text-emerald-400">Strengths</h3>
                <ul className="mt-2 space-y-1">
                  {result.strengths?.map((s, i) => (
                    <li key={i} className="text-sm text-gray-300">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-amber-500/10 p-4">
                <h3 className="font-semibold text-amber-400">Areas to Improve</h3>
                <ul className="mt-2 space-y-1">
                  {result.areasToImprove?.map((a, i) => (
                    <li key={i} className="text-sm text-gray-300">
                      • {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-ghost-500/10 p-4">
                <h3 className="text-sm font-semibold text-ghost-400">Priority Fix</h3>
                <p className="mt-1 text-sm text-gray-300">{result.priorityFix}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-white">Drill Suggestion</h3>
                <p className="mt-1 text-sm text-gray-300">{result.drillSuggestion}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setResult(null);
                setFile(null);
                setPreview(null);
              }}
              className="btn-secondary flex-1"
            >
              Analyze Another
            </button>
            <button
              onClick={() => navigate(`/sessions/${result.id}`)}
              className="btn-primary flex-1"
            >
              Chat with Coach
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
