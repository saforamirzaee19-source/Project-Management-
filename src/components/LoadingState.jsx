function LoadingState({ label }) {
  return (
    <div
      aria-live="polite"
      className="flex items-center gap-3 text-sm text-[#6B352A]/75"
      role="status"
    >
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-[#6B352A]/20 border-t-[#6B352A]"
      />
      <span>{label}</span>
    </div>
  );
}

export default LoadingState;
