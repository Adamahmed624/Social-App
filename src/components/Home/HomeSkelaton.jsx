export default function HomeSkeleton() {
    return (
        <div className="min-h-screen bg-[#0D0F13] pt-20 pb-10 animate-pulse">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[220px_1fr_320px] gap-6">
                <aside className="hidden lg:block">
                    <nav className="bg-[#171B21] border border-[#262626] rounded-2xl p-2 space-y-1 sticky top-24">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                                <div className="w-4 h-4 rounded bg-[#1F232B]"></div>
                                <div className="h-3 w-20 bg-[#1F232B] rounded"></div>
                            </div>
                        ))}
                    </nav>
                </aside>

                <main className="space-y-6">
                    <div className="bg-[#171B21] border border-[#262626] rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-11 h-11 rounded-full bg-[#1F232B]"></div>
                            <div className="space-y-2">
                                <div className="h-3 w-16 bg-[#1F232B] rounded"></div>
                                <div className="h-2.5 w-12 bg-[#1F232B] rounded-full"></div>
                            </div>
                        </div>

                        <div className="w-full h-20 bg-[#1F232B]/60 rounded-xl"></div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#262626]">
                            <div className="flex items-center gap-5">
                                <div className="h-3 w-20 bg-[#1F232B] rounded"></div>
                                <div className="h-3 w-24 bg-[#1F232B] rounded"></div>
                            </div>
                            <div className="h-8 w-16 bg-[#1F232B] rounded-full"></div>
                        </div>
                    </div>

                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-[#171B21] border border-[#262626] rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-11 h-11 rounded-full bg-[#1F232B]"></div>
                                <div className="space-y-2">
                                    <div className="h-3 w-24 bg-[#1F232B] rounded"></div>
                                    <div className="h-2.5 w-14 bg-[#1F232B] rounded"></div>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="h-3 w-full bg-[#1F232B] rounded"></div>
                                <div className="h-3 w-4/5 bg-[#1F232B] rounded"></div>
                            </div>
                            <div className="w-full h-48 bg-[#1F232B]/60 rounded-xl mb-4"></div>
                            <div className="flex items-center gap-6 pt-4 border-t border-[#262626]">
                                <div className="h-3 w-12 bg-[#1F232B] rounded"></div>
                                <div className="h-3 w-12 bg-[#1F232B] rounded"></div>
                                <div className="h-3 w-12 bg-[#1F232B] rounded"></div>
                            </div>
                        </div>
                    ))}
                </main>

                <aside className="hidden lg:block">
                    <div className="bg-[#171B21] border border-[#262626] rounded-2xl p-5 sticky top-24">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-[#1F232B]"></div>
                                <div className="h-3 w-24 bg-[#1F232B] rounded"></div>
                            </div>
                            <div className="h-4 w-6 bg-[#1F232B] rounded-full"></div>
                        </div>

                        <div className="w-full h-8 bg-[#1F232B]/60 rounded-full mb-5"></div>

                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="p-4 border rounded-xl border-[#262626]">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-[#1F232B] shrink-0"></div>
                                            <div className="min-w-0 flex-1 space-y-2">
                                                <div className="h-3 w-24 bg-[#1F232B] rounded"></div>
                                                <div className="h-2.5 w-16 bg-[#1F232B] rounded"></div>
                                            </div>
                                        </div>
                                        <div className="h-7 w-16 bg-[#1F232B] rounded-full shrink-0"></div>
                                    </div>
                                    <div className="h-2.5 w-14 bg-[#1F232B] rounded mt-2.5 ml-13"></div>
                                </div>
                            ))}
                        </div>

                        <div className="h-11 w-full bg-[#1F232B]/60 rounded-xl mt-3"></div>
                    </div>
                </aside>
            </div>
        </div>
    );
}