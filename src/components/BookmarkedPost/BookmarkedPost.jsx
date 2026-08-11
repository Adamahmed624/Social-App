import axios from "axios";
import { useContext } from "react";
import { authContext } from "../../Context/AuthContext";
import PostCard from "../Home/PostCard";
import PostSkeleton from "../Home/PostSkelaton";
import { useQuery } from "@tanstack/react-query";

export default function SavedPosts() {

    const { userToken } = useContext(authContext);

    async function getAllSavedPosts() {
        const { data } = await axios.get(`https://route-posts.routemisr.com/users/bookmarks`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        return data.data.bookmarks
    }

    const { data: allSavedPosts, isLoading, error, isError } = useQuery({
        queryKey: ["getAllSavedPosts" , userToken],
        queryFn: getAllSavedPosts
    })


    if (isLoading) return <PostSkeleton />;
    if (isError) return console.log(error);
    ;

    return (
        <div className="flex flex-col items-center gap-4">
            {allSavedPosts.length > 0 ? (
                allSavedPosts.map((post) => (
                    <PostCard post={post} key={post._id} />
                ))
            ) : (
                <div className="w-full rounded-2xl bg-[#171B21] border border-[#262626] p-10 text-center text-slate-500 shadow-sm">No posts found Be the first one to post.</div>
            )}
        </div>
    );
}