import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../Context/AuthContext";
import PostCard from "../Home/PostCard";
import PostSkeleton from "../Home/PostSkelaton";
import { useQuery } from "@tanstack/react-query";

export default function Feed() {
    const { userToken } = useContext(authContext);

    const [page, setPage] = useState(1)
    const [allFeedPosts, setAllFeedPosts] = useState([])
    const [totalPages, setTotalPages] = useState(1)

    async function getAllFeedPosts(page = 1) {
        const { data } = await axios.get(
            `https://route-posts.routemisr.com/posts/feed?only=following&page=${page}`,
            {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            }
        );
        return {
            posts: data.data.posts,
            numberOfPages: data.meta.pagination.numberOfPages
        }
    }

    const { data, isLoading, isError, error, isFetching } = useQuery({
        queryKey: ["getAllFeedPosts", page],
        queryFn: () => getAllFeedPosts(page),
    });

    useEffect(() => {
        if (data) {
            setAllFeedPosts((prev) => [...prev, ...data.posts]);
            setTotalPages(data.numberOfPages);
        }

    }, [data])


    function loadMore() {
        if (page < totalPages) {
            setPage((prev) => prev + 1)
        }
    }

    if (isError) {
        return (
            <div className="w-full rounded-2xl bg-[#171B21] border border-[#262626] p-10 text-center text-slate-500 shadow-sm">
                {error.message}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {isLoading ? (
                <PostSkeleton />
            ) : allFeedPosts?.length > 0 ? (
                <>
                    {allFeedPosts.map((post) => (
                        <PostCard post={post} key={post._id} />
                    ))}
                    {page < totalPages && (
                        <button
                            onClick={loadMore}
                            disabled={isFetching}
                            className="cursor-pointer mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#262626] bg-[#171B21]  px-3 py-3 text-sm font-bold text-white hover:bg-[#1F2430] hover:border-[#333333] transition-colors"
                        >
                            {isFetching ? "Loading..." : "Load more"}
                        </button>
                    )}
                </>
            ) : (
                <div className="w-full rounded-2xl bg-[#171B21] border border-[#262626] p-10 text-center text-slate-500 shadow-sm">
                    No posts found for this profile.
                </div>
            )}
        </div>
    );
}