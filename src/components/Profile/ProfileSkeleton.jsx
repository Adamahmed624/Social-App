export default function ProfileHeaderSkeleton() {
    return (
        <div className="min-h-screen bg-[#0D0F13] py-10 px-4 animate-pulse">
            <div className="max-w-3/4 mx-auto">

                <div className="overflow-hidden rounded-2xl border border-[#262626] bg-[#171B21] sm:rounded-[28px]">

                    <div className="h-44 sm:h-52 w-full relative bg-[#1F232B]">
                        <div className="absolute inset-0 bg-[linear-gradient(112deg,#11141a_0%,#181d24_36%,#1c222b_72%,#232a34_100%)]"></div>
                    </div>

                    <div className="-mt-1 bg-[#1F232B] w-full mx-auto rounded-b-3xl px-6 pb-6 pt-16 shadow-[0_-8px_20px_rgba(0,0,0,0.25)]">

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                            <div className="flex">
                                <div className="left-6 -bottom-14 w-28 h-28 rounded-full border-4 border-[#171B21] bg-[#262b34] overflow-hidden shrink-0"></div>
                                <div className="ml-4 mt-2 space-y-2.5">
                                    <div className="h-5 w-36 rounded-md bg-[#262b34]"></div>
                                    <div className="h-3.5 w-24 rounded-md bg-[#262b34]"></div>
                                    <div className="h-5 w-32 rounded-full bg-[#262b34] mt-2"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="bg-[#0D0F13] border border-[#262626] rounded-xl px-4 py-3 text-center min-w-21">
                                        <div className="h-2.5 w-12 mx-auto rounded bg-[#262b34]"></div>
                                        <div className="h-4.5 w-8 mx-auto rounded bg-[#262b34] mt-2"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4 mt-6">
                            <div className="bg-[#0D0F13] border border-[#262626] rounded-xl p-4">
                                <div className="h-3.5 w-16 rounded bg-[#262b34] mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-3.5 w-3/5 rounded bg-[#262b34]"></div>
                                    <div className="h-3.5 w-2/5 rounded bg-[#262b34]"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
                                    <div className="h-2.5 w-16 rounded bg-blue-500/20"></div>
                                    <div className="h-4.5 w-8 rounded bg-blue-500/20 mt-2"></div>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
                                    <div className="h-2.5 w-16 rounded bg-blue-500/20"></div>
                                    <div className="h-4.5 w-8 rounded bg-blue-500/20 mt-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#171B21] border border-[#262626] rounded-2xl mt-4 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                        <div className="flex justify-between w-full items-center gap-2">
                            <div className="flex gap-2">
                                <div className="h-9 w-24 rounded-xl bg-[#0D0F13]"></div>
                                <div className="h-9 w-20 rounded-xl bg-[#0D0F13]"></div>
                            </div>
                            <div className="h-5 w-5 rounded-full bg-[#0D0F13]"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mt-4">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="rounded-xl border border-[#262626] bg-[#0D0F13] p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#1F232B]"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-3.5 w-1/4 rounded bg-[#1F232B]"></div>
                                        <div className="h-3 w-1/6 rounded bg-[#1F232B]"></div>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-4">
                                    <div className="h-3.5 w-full rounded bg-[#1F232B]"></div>
                                    <div className="h-3.5 w-4/5 rounded bg-[#1F232B]"></div>
                                </div>
                                <div className="h-40 w-full rounded-lg bg-[#1F232B] mt-4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}