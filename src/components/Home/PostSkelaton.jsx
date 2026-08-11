export default function PostSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto p-4">
      {[1, 2].map((item) => (
        <div 
          key={item} 
          className="bg-[#171B21] rounded-2xl p-5 shadow-sm border border-[#262626] flex flex-col gap-4 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#262626] rounded-full shrink-0"></div>
            
            <div className="flex flex-col gap-2 w-full">
              <div className="h-3.5 bg-[#262626] rounded-full w-3/4"></div>
              <div className="h-3 bg-[#262626] rounded-full w-1/2"></div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-1">
            <div className="h-3.5 bg-[#262626] rounded-full w-full"></div>
            <div className="h-3.5 bg-[#262626] rounded-full w-4/5"></div>
          </div>
        </div>
      ))}
    </div>
  );
}