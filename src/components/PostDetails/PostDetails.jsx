import axios from "axios"
import { useContext } from "react"
import { authContext } from "../../Context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import PostCard from "../Home/PostCard"

export default function PostDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { userToken } = useContext(authContext)
    async function getSinglePost() {
        const { data } = await axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        })
        return data.data.post
    }

    const { data: singlePost, isLoading } = useQuery({
        queryKey: [getSinglePost, id],
        queryFn: getSinglePost
    })

    if (isLoading) return <div className="max-w-2xl mx-auto mt-4 px-4">
        <p className="bg-[#171B21] border border-[#262626] px-4 py-6 text-sm text-[#5c6270] rounded-lg text-center font-bold ">Loading...</p>
    </div>

    return (
        <div className="max-w-2xl mx-auto mt-4 px-4">
            <button
                onClick={() => navigate(-1)}
                className="cursor-pointer inline-flex mb-4 items-center gap-2 rounded-lg bg-[#171B21] border border-[#262626] px-3 py-2 text-sm font-bold text-[#5c6270] transition-colors duration-200 hover:bg-[#1F2430] hover:border-[#333333] hover:text-[#8A90A0]">
                <i className="fas fa-arrow-left text-4"></i>
                Back
            </button>
            <PostCard post={singlePost} />
        </div>
    )
}
