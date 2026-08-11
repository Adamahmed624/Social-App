import { useContext, useEffect, useState } from "react";
import TopCommentCard from "./TopCommentCard";
import axios from "axios";
import { authContext } from "../../Context/AuthContext";
import CommentsSection from "../CommentsSection/CommentsSection";
import { Link } from "react-router-dom";
import { profileContext } from "../../Context/ProfileContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function PostCard({ post }) {
    const [showModal, setShowModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [openImagePreview, setOpenImagePreview] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const queryClient = useQueryClient()



    const fetchPostLikes = async () => {
        setShowModal(true)
        const { data } = await axios(`https://route-posts.routemisr.com/posts/${post._id}/likes?page=1&limit=20`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        })
        return data.data.likes;
    };

    const { data: userlikes, isLoading: loading } = useQuery({
        queryKey: ["postLikes", post._id],
        queryFn: fetchPostLikes,
        enabled: showModal
    })

    const { userToken } = useContext(authContext)
    const { profile } = useContext(profileContext)

    let { body, likesCount, likes: likesArray, sharesCount, createdAt, privacy, commentsCount, topComment, user, image, _id } = post

    const [likes, setLikes] = useState(likesCount);
    const [showComments, setShowComments] = useState(false);
    const [liked, setLiked] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const [sharedBody, setSharedBody] = useState('');

    const { mutate: handleSharePost, isPending: isSharingPending } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.post(
                `https://route-posts.routemisr.com/posts/${post._id}/share`,
                { body: sharedBody },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            return data.data.post;
        },
        onSuccess: () => {
            toast.success("Post created successfully!", {
                position: "top-right",
                autoClose: 3000,
            })
            setShareModal(false)
            queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllFeedPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllMyPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllSavedPosts"] });
        },
        onError: (err) => {
            console.log(err.response?.data);
            console.log(err.response?.status);
        },
    });

    function handleCancelShare() {
        setShareModal(false);
        setSharedBody('');
    }

    useEffect(() => {
        if (profile?._id) {
            setLiked(likesArray?.includes(profile._id) || false);
        }
    }, [profile, likesArray]);

    const { mutate: handleLike } = useMutation({
        mutationFn: async () => {
            await axios.put(
                `https://route-posts.routemisr.com/posts/${_id}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
        },
        onMutate: async () => {
            setLiked((prev) => !prev);
            setLikes((prev) => (!liked ? prev + 1 : prev - 1));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllFeedPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllMyPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllSavedPosts"] });
        },
        onError: (err) => {
            setLiked((prev) => !prev);
            setLikes((prev) => (liked ? prev + 1 : prev - 1));
            console.log(err);
        }
    });

    const systemCaptions = [
        "updated profile picture",
        "updated cover photo",
    ];

    const normalizedBody = body?.trim().toLowerCase() || "";
    const isSystemPost = systemCaptions.some((caption) =>
        normalizedBody.includes(caption)
    );

    function getRelativeTime(dateString) {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffInSeconds = Math.floor((now - postDate) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s`;

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d`;

        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) return `${diffInWeeks}w`;

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) return `${diffInMonths}mo`;

        const diffInYears = Math.floor(diffInDays / 365);
        return `${diffInYears}y`;
    }
    const [bookmarked, setBookmarked] = useState(post.bookmarked);
    const [isEditing, setIsEditing] = useState(false);
    const [editedBody, setEditedBody] = useState(body);

    useEffect(() => {
        setEditedBody(body);
    }, [body]);

    const { mutate: handleEditPost, isPending: isEditingPending } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.put(
                `https://route-posts.routemisr.com/posts/${post._id}`,
                { body: editedBody },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Post edited successfully!", {
                position: "top-right",
                autoClose: 3000,
            })
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllFeedPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllMyPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllSavedPosts"] });
        },
        onError: (err) => {
            toast.error("Failed to edit post!", {
                position: "top-right",
                autoClose: 3000,
            });
            console.log(err);
        },
    });

    function handleCancelEdit() {
        setEditedBody(body);
        setIsEditing(false);
    }

    const { mutate: handleBookmarke } = useMutation({
        mutationFn: async () => {
            await axios.put(`https://route-posts.routemisr.com/posts/${post._id}/bookmark`, {}, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            })
        },
        onSuccess: () => {
            toast.success("Post Saved successfully!", {
                position: "top-right",
                autoClose: 3000,
            })
            setShowMenu(false)
            setBookmarked((prev) => !prev);

            queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllFeedPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllMyPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllSavedPosts"] });
        },
        onError: (err) => {
            console.log(err);

        }
    })

    const { mutate: handleDeletePost, isPending: isDeletingPending } = useMutation({
        mutationFn: async () => {
            await axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            })
        },
        onSuccess: () => {

            toast.success("Post deleted successfully!", {
                position: "top-right",
                autoClose: 3000,
            })
            setShowDeleteConfirm(false);
            setShowMenu(false)

            queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllFeedPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllMyPosts"] });
        },
        onError: (error) => {
            setShowDeleteConfirm(false);
            console.log(error);

        }
    })

    return (
        <>
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <div
                        className="w-full max-w-xl bg-[#171B21] border border-[#262626] rounded-2xl shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[#262626]">
                            <h2 className="text-lg font-bold text-white">Confirm action</h2>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="cursor-pointer text-[#C2C6D6] hover:text-white transition-colors"
                            >
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>

                        <div className="px-5 py-4 flex items-start gap-3">
                            <div className="w-9 h-9 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center">
                                <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">Delete this post?</p>
                                <p className="text-sm text-[#6b7280] mt-1">
                                    This post will be permanently removed from your profile and feed.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#262626]">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeletingPending}
                                className="cursor-pointer px-5 py-2 rounded-full text-sm font-semibold text-[#C2C6D6] bg-[#161616] border border-[#262626] hover:text-white hover:border-[#3a3a3a] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeletePost}
                                disabled={isDeletingPending}
                                className="cursor-pointer px-5 py-2 rounded-full text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {isDeletingPending ? "Deleting..." : "Delete post"}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {openImagePreview && (
                <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/90 p-4 sm:p-8">
                    <button
                        onClick={() => setOpenImagePreview(false)}
                        className="cursor-pointer absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                    <img
                        className="max-h-full max-w-full object-contain"
                        src={post.sharedPost?.image || image || ""}
                        alt="image"
                    />
                </div>
            )}


            {shareModal && (<div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                onClick={handleCancelShare}
            >
                <div
                    className="w-full max-w-xl bg-[#171B21] border border-[#262626] rounded-2xl shadow-xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#262626]">
                        <h2 className="text-lg font-bold text-white">Share post</h2>
                        <button
                            onClick={handleCancelShare}
                            className="cursor-pointer text-[#C2C6D6] hover:text-white transition-colors"
                        >
                            <i className="fa-solid fa-xmark text-lg"></i>
                        </button>
                    </div>

                    <div className="px-5 py-4 space-y-4">
                        <textarea
                            value={sharedBody}
                            onChange={(e) => setSharedBody(e.target.value)}
                            placeholder="Say something about this..."
                            rows={3}
                            className="w-full resize-none bg-[#12132a] border border-[#262626] rounded-xl p-3 text-sm text-white placeholder-[#6b7280] focus:outline-none focus:border-blue-500/50 transition-colors"
                        />

                        <div className="bg-[#1F232B] border border-[#262626] rounded-xl p-3.5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#12132a] border border-[#262626] flex items-center justify-center overflow-hidden shrink-0">
                                    {post?.user?.photo ? (
                                        <img src={post.user.photo} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <i className="fa-solid fa-user text-[#6b7280] text-xs"></i>
                                    )}
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-sm font-bold text-white">{post?.user?.name}</span>
                                    <span className="text-xs text-[#6b7280]">@{post?.user?.username}</span>
                                </div>
                            </div>
                            {post?.body && (
                                <p className="text-sm text-[#C2C6D6] mt-3">{post.body}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#262626]">
                        <button
                            onClick={handleCancelShare}
                            className="cursor-pointer px-5 py-2 rounded-full text-sm font-semibold text-[#C2C6D6] bg-[#161616] border border-[#262626] hover:text-white hover:border-[#3a3a3a] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSharePost}
                            disabled={isSharingPending}
                            className="cursor-pointer px-5 py-2 rounded-full text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                        >
                            {!isSharingPending ? 'Share now' : 'Posting...'}
                        </button>
                    </div>
                </div>
            </div>
            )}


            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="w-full max-w-130 rounded-2xl bg-[#171B21] max-h-[80vh] overflow-y-auto shadow-lg">
                        <div className="flex items-center justify-between border-b border-[#262626] px-4 py-3">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-users text-[17px] text-blue-400"></i>
                                <h4 className="text-base font-extrabold text-slate-900">People who reacted</h4>
                            </div>
                            <button className="inline-flex hover:bg-[#1F232B]  h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:text-white" onClick={() => setShowModal(false)}>
                                <i className="cursor-pointer fas fa-x text-4 "></i>
                            </button>
                        </div>

                        <div className="p-2">
                            {loading ? (
                                <p className="p-4 text-center text-gray-400">Loading...</p>
                            ) : userlikes.length === 0 ? (
                                <p className="p-4 text-center text-gray-400">No likes yet.</p>
                            ) : (
                                userlikes.map((user) => (
                                    <Link to={user._id === profile?._id ? "/profile" : `/profile/${user._id}`} key={user._id} className="flex items-center gap-3 p-3 hover:bg-[#1F232B] rounded-lg">
                                        <img src={user.photo} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <p className="font-semibold">{user.name}</p>
                                            <p className="text-gray-500 text-sm">@{user.username}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="bg-[#171B21] border border-[#262626] rounded-2xl p-5 w-full">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#1F232B] flex items-center justify-center overflow-hidden border border-[#262626]">
                            <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm">
                                <Link className="hover:underline" to={user._id === profile?._id ? "/profile" : `/profile/${user._id}`}>{user.name}</Link>
                                {isSystemPost && (
                                    <span className="text-[#C2C6D6] font-normal"> {body}</span>
                                )}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-[#5c6270] mt-0.5">
                                <span>@{user.username}</span>
                                <span>·</span>
                                <span>{getRelativeTime(createdAt)}</span>
                                <span>·</span>
                                <i className="fa-solid fa-globe text-[10px]"></i>
                                <span>{privacy}</span>
                            </div>
                        </div>
                    </div>


                    <div className="relative">
                        <button
                            onClick={() => setShowMenu((prev) => !prev)}
                            className="cursor-pointer text-[#5c6270] hover:text-white transition-colors px-2"
                        >
                            <i className="fa-solid fa-ellipsis"></i>
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#1F232B] border border-[#262626] rounded-xl shadow-lg py-2 z-50">
                                <button
                                    onClick={handleBookmarke}
                                    className="cursor-pointer flex items-center gap-3 w-full px-4 py-2.5 text-[#C2C6D6] hover:bg-[#262626] text-right"
                                >
                                    <i className="fa-regular fa-bookmark text-[#5c6270]"></i>
                                    <span>{bookmarked ? 'Unsave post' : 'Save post'}</span>
                                </button>

                                {post.user._id === profile._id && <div>
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setShowMenu(false);
                                        }}
                                        className="cursor-pointer flex items-center gap-3 w-full px-4 py-2.5 text-[#C2C6D6] hover:bg-[#262626] text-right"
                                    >
                                        <i className="fa-regular fa-pen-to-square text-[#5c6270]"></i>
                                        <span>Edit post</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            setShowDeleteConfirm(true);
                                        }}
                                        className="cursor-pointer flex items-center gap-3 w-full px-4 py-2.5 text-red-500 hover:bg-red-500/10 text-right"
                                    >
                                        <i className="fa-regular fa-trash-can"></i>
                                        <span>Delete post</span>
                                    </button>
                                </div>}
                            </div>
                        )}
                    </div>
                </div>

                {bookmarked && <div className="my-3 inline-flex items-center gap-1.5 rounded-md bg-[#1877f2]/10 px-2 py-1 text-[12px] font-medium text-[#4d9fff]">
                    <i className="fas fa-bookmark text-[10px]"></i>
                    Saved
                </div>}

                {isEditing ? (
                    <div className="my-4">
                        <textarea
                            value={editedBody}
                            onChange={(e) => setEditedBody(e.target.value)}
                            rows={4}
                            autoFocus
                            className="w-full resize-none rounded-lg border border-[#262626] bg-[#1F232B] p-3 text-sm text-[#C2C6D6] leading-relaxed focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex items-center justify-end gap-2 mt-3">
                            <button
                                onClick={handleCancelEdit}
                                disabled={isEditingPending}
                                className="cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium text-[#C2C6D6] border border-[#262626] hover:bg-[#262626] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditPost}
                                disabled={isEditingPending || !editedBody.trim()}
                                className="cursor-pointer px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                                {isEditingPending ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                ) : (
                    !isSystemPost && body && (
                        <p className="text-sm text-[#C2C6D6] my-4 leading-relaxed wrap-break-words">{body}</p>
                    )
                )}

                {post.sharedPost ? <div className="bg-[#171B21] border border-[#262626] rounded-2xl px-4 py-3.5 w-full">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#1F232B] border border-[#262626] flex items-center justify-center overflow-hidden shrink-0">
                                {post.user?.photo ? (
                                    <img src={user.photo} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <i className="fa-solid fa-user text-[#6b7280] text-sm"></i>
                                )}
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-sm font-bold text-white">{post.user?.name}</span>
                                <span className="text-xs text-[#6b7280]">@{post.user?.username}</span>
                            </div>
                        </div>

                        {post.sharedPost._id && (
                            <Link
                                to={`/postDetails/${post.sharedPost._id}`}
                                className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors shrink-0"
                            >
                                Original Post
                                <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                            </Link>
                        )}
                    </div>

                    {post.sharedPost.body && (
                        <p className="text-sm my-3 text-[#C2C6D6]">{post.sharedPost.body}</p>
                    )}
                    {post.sharedPost.image && (
                        <img onClick={() => setOpenImagePreview(!openImagePreview)} src={post.sharedPost.image} className="cursor-pointer w-full object-cover" />
                    )}
                </div> : ''}

                {image && <img onClick={() => setOpenImagePreview(!openImagePreview)} src={image} className="cursor-pointer w-full object-cover" />}

                <div className="flex items-center justify-between mt-4 pb-3">
                    <div className="flex items-center gap-2 text-xs text-[#5c6270]">
                        <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <i className="fa-solid fa-thumbs-up text-white text-[10px]"></i>
                        </span>
                        <button onClick={fetchPostLikes} className="cursor-pointer hover:text-[#1877f2] hover:underline">{likes} likes</button>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#5c6270]">
                        <span className="flex items-center gap-1">
                            <i className="fa-solid fa-retweet"></i>
                            {sharesCount} shares
                        </span>
                        <button
                            onClick={() => setShowComments((prev) => !prev)}
                            className="hover:text-[#C2C6D6] transition-colors"
                        >
                            {commentsCount} comments
                        </button>
                        <Link to={`/postDetails/${post._id}`} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            View details
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-3 border-t border-[#262626] pt-1">
                    <button
                        onClick={handleLike}
                        className={`cursor-pointer flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#1F232B] ${liked ? "text-blue-400" : "text-[#C2C6D6] "
                            }`}
                    >
                        <i className={liked ? "fa-solid fa-thumbs-up" : "fa-regular fa-thumbs-up"}></i>
                        Like
                    </button>
                    <button
                        onClick={() => setShowComments((prev) => !prev)}
                        className={`cursor-pointer flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${showComments ? "text-blue-400" : "text-[#C2C6D6] hover:bg-[#1F232B]"
                            }`}
                    >
                        <i className={showComments ? "fa-solid fa-comment" : "fa-regular fa-comment"}></i>
                        Comment
                    </button>
                    <button onClick={() => setShareModal(true)} className="cursor-pointer flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-[#C2C6D6] hover:bg-[#1F232B] transition-colors">
                        <i className="fa-solid fa-share-nodes"></i>
                        Share
                    </button>
                </div>

                {topComment && !showComments && (
                    <TopCommentCard
                        topComment={topComment}
                        onViewAllComments={() => setShowComments(true)}
                    />
                )}

                {showComments && <CommentsSection postId={_id} />}
            </div>
        </>

    );
}