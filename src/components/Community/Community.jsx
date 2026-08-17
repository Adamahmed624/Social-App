import axios from "axios";
import { useContext } from "react";
import { authContext } from "../../Context/AuthContext";
import PostCard from "../Home/PostCard";
import PostSkeleton from "../Home/PostSkelaton";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function Community() {

    const { userToken } = useContext(authContext);

    async function getAllPosts({ pageParam = 1 }) {
        const { data } = await axios.get(`https://route-posts.routemisr.com/posts?page=${pageParam}&limit=20`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });
        return {
            posts: data.data.posts,
            numberOfPages: data.meta?.pagination?.numberOfPages ?? pageParam,
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
        queryKey: ["getAllPosts"],
        queryFn: getAllPosts,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.page < lastPage.numberOfPages ? lastPage.page + 1 : undefined,
    });

    if (isError) {
        return <div>{error.message}</div>;
    }

    const allPosts = data?.pages.flatMap((p) => p.posts) ?? [];

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {isLoading && <PostSkeleton />}

            {allPosts.map((post) => (
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
        </div>
    );
}