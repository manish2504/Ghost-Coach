export default function SkeletonCard() {
  return (
    <div className="gradient-card animate-pulse overflow-hidden p-4">
      <div className="aspect-video rounded-xl bg-white/10" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-white/10" />
      </div>
    </div>
  );
}
