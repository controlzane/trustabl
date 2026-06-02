export default function PreReleaseBanner() {
  return (
    <div className="border-b border-[#2DD4BF]/20 bg-[#2DD4BF]/[0.06] px-4 py-2.5 text-center">
      <p className="text-xs font-medium text-[#2DD4BF]">
        <span className="mr-2 inline-flex items-center rounded-md border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
          Pre-release
        </span>
        Some features are still in development and will be available soon.
      </p>
    </div>
  );
}
