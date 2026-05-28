const MARKERS = [
  { id: 'head', label: 'Head Position', top: '8%', left: '42%', arrow: 'down' },
  { id: 'elbow', label: 'Front Elbow', top: '35%', left: '28%', arrow: 'right' },
  { id: 'foot', label: 'Foot Alignment', top: '78%', left: '38%', arrow: 'up' },
];

export default function StanceOverlay({ imageUrl }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-black/40">
      <img
        src={imageUrl}
        alt="Batting stance with coaching overlays"
        className="w-full object-contain"
        style={{ maxHeight: '400px' }}
      />
      {MARKERS.map((marker) => (
        <div
          key={marker.id}
          className="absolute"
          style={{ top: marker.top, left: marker.left }}
        >
          <div className="relative flex flex-col items-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ghost-500 shadow-lg shadow-ghost-500/50 ring-2 ring-white/80">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
            <div className="mt-1 whitespace-nowrap rounded-lg bg-pitch-900/90 px-2 py-1 text-xs font-semibold text-ghost-300 ring-1 ring-ghost-500/30 backdrop-blur-sm">
              {marker.label}
            </div>
            {marker.arrow === 'down' && (
              <div className="absolute -bottom-3 h-3 w-0.5 bg-ghost-400" />
            )}
            {marker.arrow === 'right' && (
              <div className="absolute left-7 top-2 h-0.5 w-4 bg-ghost-400" />
            )}
            {marker.arrow === 'up' && (
              <div className="absolute -top-3 h-3 w-0.5 bg-ghost-400" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
