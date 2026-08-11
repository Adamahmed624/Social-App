import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../Context/AuthContext";
import PostCard from "../Home/PostCard";
import PostSkeleton from "../Home/PostSkelaton";
import { useQuery } from "@tanstack/react-query";

export default function Community() {

    const { userToken } = useContext(authContext);
    const [page, setPage] = useState(1)
    const [allPosts, setAllPosts] = useState([])

    async function getAllPosts(page = 1) {

        const { data } = await axios.get(`https://route-posts.routemisr.com/posts?page=${page}&limit=20`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });
        return data.data.posts

    }

    let { data: posts, isLoading, isFetching , isError, error } = useQuery({
        queryKey: ["getAllPosts", page],
        queryFn: () => getAllPosts(page)
    });

    useEffect(() => {
        if (posts) {
            setAllPosts((prev) => [...prev, ...posts])
        }

    }, [posts])


    function loadMore() {
        setPage((prev) => prev + 1)
    }

    if (isError) {
        return <div>{error.message}</div>;
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {isLoading && <PostSkeleton />}

            {allPosts?.map((post) => (
                <PostCard post={post} key={post._id} />
            ))}
            <button
                onClick={loadMore}
                disabled={isFetching}
                className="cursor-pointer mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#262626] bg-[#171B21]  px-3 py-3 text-sm font-bold text-white hover:bg-[#1F2430] hover:border-[#333333] transition-colors"
            >
                {isFetching ? "Loading..." : "Load more"}
            </button>
        </div>
    );
}