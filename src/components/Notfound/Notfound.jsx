import { Link } from "react-router-dom";

export default function NotFoundPage({
  onBackHome,
  onPrevious,
  status = "NULL_POINTER_EXCEPTION",
  node = "NX-7402-DELTA",
}) {
  const goBack = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A14] text-white overflow-hidden">
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-6">
        <button
          aria-label="Notifications"
          className="cursor-pointer text-slate-400 hover:text-slate-200 transition-colors"
        >
          <i className="fa-regular fa-bell text-lg"></i>
        </button>
      </header>

      <div className="drift-el absolute left-6 sm:left-16 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-white/4 border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg animate-pulse">
        <i className="fa-solid fa-link-slash text-slate-400 text-sm"></i>
      </div>

      <div className="drift-el absolute right-6 sm:right-16 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/4 border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg animate-bounce">
        <i className="fa-solid fa-satellite text-amber-400/80 text-lg -rotate-45"></i>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-10 pb-24 text-center">
        <div className="relative flex flex-col items-center">
          <div className="radial-glow absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full -top-16 left-1/2 -translate-x-1/2"></div>

          <div className="inline-flex items-center gap-1.5 -rotate-6 bg-white/6 border border-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-2 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <i className="fa-solid fa-satellite-dish text-indigo-300 text-[10px]"></i>
            <span className="text-[10px] font-semibold tracking-widest text-slate-300 uppercase">
              Lost in Orbit
            </span>
          </div>

          <h1 className="glow-404 relative text-7xl sm:text-8xl md:text-9xl font-bold tracking-tight bg-linear-to-b from-indigo-200 via-indigo-300 to-indigo-500/70 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white mt-4 mb-3">
          Looks like this post vanished into deep space.
        </h2>

        <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
          The transmission was interrupted or the content has drifted beyond the
          event horizon. Don't worry, even black holes have exits.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            replace
            onClick={() => {
              if (onBackHome) onBackHome();
            }}
            className="inline-flex items-center gap-2 bg-indigo-200 hover:bg-indigo-100 text-indigo-950 text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-[0_0_25px_rgba(199,210,254,0.25)]"
          >
            <i className="fa-solid fa-house text-xs"></i>
            Back to Home Feed
          </Link>
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 bg-white/4 hover:bg-white/8 border border-white/10 text-slate-200 text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            Previous Page
          </button>
        </div>

        <div className="flex items-center justify-center gap-16 mt-14 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
              Status
            </p>
            <p className="text-xs font-mono text-slate-400">{status}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
              Node
            </p>
            <p className="text-xs font-mono text-slate-400">{node}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
