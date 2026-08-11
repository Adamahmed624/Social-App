import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../Context/AuthContext";
import PostCard from "../Home/PostCard";
import { profileContext } from "../../Context/ProfileContext";
import PostSkeleton from "../Home/PostSkelaton";
import { useQuery } from "@tanstack/react-query";

export default function MyPosts() {
    const { userToken } = useContext(authContext);
    const { profile } = useContext(profileContext);

    const [page, setPage] = useState(1)
    const [allMyPosts, setAllMyPosts] = useState([])
    const [totalPages, setTotalPages] = useState(1)

    async function getAllMyPosts(page = 1) {
        const { data } = await axios.get(`https://route-posts.routemisr.com/users/${profile._id}/posts?page=${page}`, {
            headers: {
                token: userToken
            }
        });

        return {
            posts: data.data.posts,
            numberOfPages: data.meta.pagination.numberOfPages,
        };
    }



    const { data, isLoading, isFetching, isError, error } = useQuery({
        queryKey: ["getAllMyPosts", page],
        queryFn: () => getAllMyPosts(page),
    });

    useEffect(() => {
    if (data) {
        setAllMyPosts((prev) => [...prev, ...data.posts]);
        setTotalPages(data.numberOfPages);
    }

    }, [data])

    function loadMore() {
        if (page < totalPages) {
            setPage((prev) => prev + 1)
        }
    }

    if (isLoading) return <PostSkeleton />;

    if (isError) {
        return (
            <div className="w-full rounded-2xl bg-[#171B21] border border-[#262626] p-10 text-center text-slate-500 shadow-sm">
                {error.message}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {allMyPosts?.length > 0 ? (
                <>
                    {allMyPosts.map((post) => (
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
            )
            }
        </div >
    );
}