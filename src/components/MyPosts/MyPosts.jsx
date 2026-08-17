import axios from "axios";
import { useContext } from "react";
import { authContext } from "../../Context/AuthContext";
import PostCard from "../Home/PostCard";
import { profileContext } from "../../Context/ProfileContext";
import PostSkeleton from "../Home/PostSkelaton";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function MyPosts() {
    const { userToken } = useContext(authContext);
    const { profile } = useContext(profileContext);

    async function getAllMyPosts({ pageParam = 1 }) {
        const { data } = await axios.get(`https://route-posts.routemisr.com/users/${profile._id}/posts?page=${pageParam}`, {
            headers: {
                token: userToken
            }
        });

        return {
            posts: data.data.posts,
            numberOfPages: data.meta.pagination.numberOfPages,
            page: pageParam
        };
    }

    const {
        data,
        isLoading,
        isFetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
        error
    } = useInfiniteQuery({
        queryKey: ["getAllMyPosts", profile?._id],
        queryFn: getAllMyPosts,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.page < lastPage.numberOfPages ? lastPage.page + 1 : undefined,
        enabled: !!profile?._id,
    });

    if (isLoading) return <PostSkeleton />;

    if (isError) {
        return (
            <div className="w-full rounded-2xl bg-[#171B21] border border-[#262626] p-10 text-center text-slate-500 shadow-sm">
                {error.message}
            </div>
        );
    }

    const allMyPosts = data?.pages.flatMap((p) => p.posts) ?? [];

    return (
        <div className="flex flex-col items-center gap-4">
            {allMyPosts.length > 0 ? (
                <>
                    {allMyPosts.map((post) => (
                        <PostCard post={post} key={post._id} />
                    ))}
                    {hasNextPage && (
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage || isFetching}
                            className="cursor-pointer mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#262626] bg-[#171B21]  px-3 py-3 text-sm font-bold text-white hover:bg-[#1F2430] hover:border-[#333333] transition-colors"
                        >
                            {isFetchingNextPage ? "Loading..." : "Load more"}
                        </button>
                    )}
                </>
            ) : (
                <div className="w-full rounded-2xl bg-[#171B21] border border-[#262626] p-10 text-center text-slate-500 shadow-sm">
                    No posts found for this profile.
                </div>
            )
            }
        </div >
    );
}