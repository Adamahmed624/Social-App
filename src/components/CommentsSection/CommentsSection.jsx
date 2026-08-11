import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { authContext } from "../../Context/AuthContext";
import { profileContext } from "../../Context/ProfileContext";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const BASE_URL = "https://route-posts.routemisr.com";

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
    return `${diffInDays}d`;
}

function isLikedBy(likes, currentUserId) {
    return likes?.some((l) =>
        typeof l === "string" ? l === currentUserId : l?._id === currentUserId
    );
}

function ConfirmModal({ isOpen, onClose, onConfirm, title, description }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-[fadeIn_0.15s_ease-out]">
            <div className="bg-[#1F232B] border border-[#262626] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#262626]">
                    <h3 className="text-white font-semibold text-sm">Confirm action</h3>
                    <button
                        onClick={onClose}
                        className="text-[#5c6270] hover:text-white transition-colors cursor-pointer"
                    >
                        <i className="fa-solid fa-xmark text-sm"></i>
                    </button>
                </div>

                <div className="p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-triangle-exclamation text-red-500 text-sm"></i>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">{title}</h4>
                        <p className="text-[#8B92A7] text-xs mt-1 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-[#262626]">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-[#262626] text-white text-xs font-medium hover:bg-[#262626] transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors cursor-pointer shadow-lg shadow-red-500/20"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function ActionsMenu({ onEdit, onDelete, size = "sm" }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const btnSize = size === "sm" ? "w-5 h-5" : "w-6 h-6";
    const iconSize = size === "sm" ? "text-[10px]" : "text-xs";

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`${btnSize} rounded-full flex items-center justify-center text-[#5c6270] hover:text-white hover:bg-[#262626] transition-colors cursor-pointer`}
            >
                <i className={`fa-solid fa-ellipsis ${iconSize}`}></i>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 z-20 w-32 bg-[#1F232B] border border-[#262626] rounded-xl shadow-2xl overflow-hidden animate-[fadeIn_0.1s_ease-out]">
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onEdit();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#C2C6D6] hover:bg-[#262626] transition-colors cursor-pointer"
                    >
                        <i className="fa-solid fa-pen text-[10px] w-3"></i>
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onDelete();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-[#262626] transition-colors cursor-pointer"
                    >
                        <i className="fa-regular fa-trash-can text-[10px] w-3"></i>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

function ReplyItem({ reply, onLike, onDelete, onEdit, currentUserId }) {
    const creatorId = reply?.commentCreator?._id;
    const isOwner = !!currentUserId && creatorId === currentUserId;
    const isLiked = isLikedBy(reply.likes, currentUserId);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(reply.content);

    function handleSaveEdit() {
        const trimmed = editedContent.trim();
        if (!trimmed || trimmed === reply.content) {
            setEditedContent(reply.content);
            setIsEditing(false);
            return;
        }
        onEdit(reply._id, trimmed);
        setIsEditing(false);
    }

    function handleCancelEdit() {
        setEditedContent(reply.content);
        setIsEditing(false);
    }

    return (
        <>
            <div className="flex items-start gap-2 py-2">
                <div className="w-6 h-6 rounded-full bg-[#1F232B] flex items-center justify-center overflow-hidden border border-[#262626] shrink-0">
                    <img
                        src={reply.commentCreator?.photo}
                        alt={reply.commentCreator?.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <div className="bg-[#1F232B] border border-blue-500/50 rounded-2xl rounded-tl-sm px-3 py-1.5 w-full">
                            <p className="text-white text-[11px] font-semibold">
                                {reply.commentCreator?.name}
                            </p>
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                rows={2}
                                autoFocus
                                className="w-full bg-transparent outline-none text-xs text-[#C2C6D6] mt-0.5 leading-relaxed resize-none"
                            />
                            <div className="flex items-center justify-end gap-3 mt-1">
                                <button
                                    onClick={handleCancelEdit}
                                    className="text-[10px] font-medium text-[#5c6270] hover:text-white transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="text-[10px] font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#1F232B] border border-[#262626] rounded-2xl rounded-tl-sm px-3 py-1.5 w-fit max-w-full">
                            <p className="text-white text-[11px] font-semibold">
                                {reply.commentCreator?.name}
                            </p>
                            <p className="text-[#C2C6D6] text-xs mt-0.5 leading-relaxed wrap-break-words">
                                {reply.content}
                            </p>

                            {reply.image && (
                                <div className="mt-2 rounded-xl overflow-hidden border border-[#262626] inline-block">
                                    <img
                                        src={reply.image}
                                        alt="reply attachment"
                                        className="max-h-48 max-w-full object-contain block"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-3 mt-1 px-1">
                        <button
                            onClick={() => onLike(reply._id)}
                            className={`cursor-pointer flex items-center gap-1 text-[10px] font-medium transition-colors ${isLiked ? "text-blue-400" : "text-[#5c6270] hover:text-blue-400"
                                }`}
                        >
                            <i className={isLiked ? "fa-solid fa-thumbs-up" : "fa-regular fa-thumbs-up"}></i>
                            {reply.likesCount > 0 ? reply.likesCount : "Like"}
                        </button>
                        <span className="text-[10px] text-[#5c6270]">
                            {getRelativeTime(reply.createdAt)}
                        </span>
                        {isOwner && !isEditing && (
                            <div className="ml-auto">
                                <ActionsMenu
                                    onEdit={() => setIsEditing(true)}
                                    onDelete={() => setIsConfirmOpen(true)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => onDelete(reply._id)}
                title="Delete this reply?"
                description="This reply will be permanently removed."
            />
        </>
    );
}

function RepliesSection({ postId, comment, currentUserId, authHeaders, profile }) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: { content: "", image: "" },
    });

    const [imagePreview, setImagePreview] = useState(null);
    const watchImage = watch("image");

    useEffect(() => {
        if (watchImage && watchImage.length > 0) {
            const file = watchImage[0];
            const url = URL.createObjectURL(file);
            setImagePreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [watchImage]);

    function removeImage() {
        setValue("image", "");
        setImagePreview(null);
    }

    const repliesKey = ["replies", comment._id];

    const {
        data: replies = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: repliesKey,
        queryFn: async () => {
            const { data } = await axios.get(
                `${BASE_URL}/posts/${postId}/comments/${comment._id}/replies`,
                authHeaders
            );
            return data?.data?.replies || [];
        },
    });

    function convertToFormData(replyDetails) {
        const formData = new FormData();
        formData.append("content", replyDetails.content);
        if (replyDetails.image && replyDetails.image.length > 0) {
            formData.append("image", replyDetails.image[0]);
        }
        return formData;
    }

    const { mutate: createReply, isPending: sending } = useMutation({
        mutationFn: async (details) => {
            let formData = convertToFormData(details);
            const { data } = await axios.post(
                `${BASE_URL}/posts/${postId}/comments/${comment._id}/replies`,
                formData,
                authHeaders
            );
            return data;
        },
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (response) => {
            queryClient.setQueryData(repliesKey, (prev = []) => [
                response.data.reply,
                ...prev,
            ]);
            reset();
            setImagePreview(null);
            queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
        },
    });

    const { mutate: likeReply } = useMutation({
        mutationFn: (replyId) =>
            axios.put(
                `${BASE_URL}/posts/${postId}/comments/${replyId}/like`,
                {},
                authHeaders
            ),
        onMutate: async (replyId) => {
            await queryClient.cancelQueries({ queryKey: repliesKey });
            const previous = queryClient.getQueryData(repliesKey);

            queryClient.setQueryData(repliesKey, (prev = []) =>
                prev.map((r) => {
                    if (r._id !== replyId) return r;
                    const alreadyLiked = isLikedBy(r.likes, currentUserId);
                    return {
                        ...r,
                        likes: alreadyLiked
                            ? r.likes.filter((l) =>
                                typeof l === "string" ? l !== currentUserId : l?._id !== currentUserId
                            )
                            : [...(r.likes ?? []), currentUserId],
                        likesCount: alreadyLiked ? r.likesCount - 1 : r.likesCount + 1,
                    };
                })
            );

            return { previous };
        },
        onError: (err, replyId, context) => {
            console.log(err);
            if (context?.previous) {
                queryClient.setQueryData(repliesKey, context.previous);
            }
        },
    });

    const { mutate: deleteReply } = useMutation({
        mutationFn: (replyId) =>
            axios.delete(
                `${BASE_URL}/posts/${postId}/comments/${replyId}`,
                authHeaders
            ),
        onMutate: async (replyId) => {
            await queryClient.cancelQueries({ queryKey: repliesKey });
            const previous = queryClient.getQueryData(repliesKey);
            queryClient.setQueryData(repliesKey, (prev = []) =>
                prev.filter((r) => r._id !== replyId)
            );
            return { previous };
        },
        onError: (err, replyId, context) => {
            console.error("Failed to delete reply:", err?.response?.data ?? err.message);
            if (context?.previous) {
                queryClient.setQueryData(repliesKey, context.previous);
            }
        },
    });

    const { mutate: editReply } = useMutation({
        mutationFn: ({ replyId, content }) =>
            axios.put(
                `${BASE_URL}/posts/${postId}/comments/${replyId}`,
                { content },
                authHeaders
            ),
        onMutate: async ({ replyId, content }) => {
            await queryClient.cancelQueries({ queryKey: repliesKey });
            const previous = queryClient.getQueryData(repliesKey);
            queryClient.setQueryData(repliesKey, (prev = []) =>
                prev.map((r) => (r._id === replyId ? { ...r, content } : r))
            );
            return { previous };
        },
        onError: (err, variables, context) => {
            console.error("Failed to edit reply:", err?.response?.data ?? err.message);
            if (context?.previous) {
                queryClient.setQueryData(repliesKey, context.previous);
            }
        },
    });

    return (
        <div className="ml-9 pl-3 border-l border-[#262626] mt-1">
            {isLoading ? (
                <div className="flex items-center gap-2 text-[#5c6270] text-xs py-2">
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    Loading replies...
                </div>
            ) : isError ? (
                <p className="text-red-400 text-xs py-2">Couldn't load replies.</p>
            ) : replies.length === 0 ? (
                <p className="text-[#5c6270] text-xs py-2">No replies yet.</p>
            ) : (
                <div className="divide-y divide-[#262626]/60">
                    {replies.map((r) => (
                        <ReplyItem
                            key={r._id}
                            reply={r}
                            onLike={likeReply}
                            onDelete={deleteReply}
                            onEdit={(replyId, content) => editReply({ replyId, content })}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}


            <p className="text-[10px] text-[#5c6270] mb-1">
                Replying to {comment.commentCreator?.name}
            </p>
            <div className="flex items-start gap-2 mt-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-[#1F232B] flex items-center justify-center overflow-hidden border border-[#262626] shrink-0">
                    <img
                        src={profile?.photo}
                        alt={profile?.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <form
                    onSubmit={handleSubmit((details) => createReply(details))}
                    className="flex-1 bg-[#1F232B] border border-[#262626] rounded-2xl px-3 pt-2 pb-1.5 focus-within:border-blue-500/50 transition-colors"
                >
                    <input
                        placeholder="Write a reply..."
                        className="w-full bg-[#1f232b] outline-none text-xs text-[#C2C6D6] placeholder:text-[#5c6270] resize-none"
                        {...register("content")}
                    />
                    {imagePreview && (
                        <div className="relative mt-2 inline-block">
                            <img
                                src={imagePreview}
                                alt="preview"
                                className="max-h-32 rounded-lg border border-[#262626] object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] hover:bg-black transition-colors"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    )}
                    <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-3 text-[#5c6270]">
                            <label htmlFor={`reply-image-${comment._id}`}>
                                <i className="fa-regular fa-image cursor-pointer hover:text-blue-400 transition-colors text-xs"></i>
                            </label>
                            <input
                                id={`reply-image-${comment._id}`}
                                {...register("image")}
                                type="file"
                                hidden
                            />
                            <i className="fa-regular fa-face-smile text-xs"></i>
                        </div>
                        <button
                            disabled={sending}
                            className="cursor-pointer w-7 h-7 rounded-full bg-blue-500 disabled:bg-blue-500/30 flex items-center justify-center text-white transition-colors hover:bg-blue-600 disabled:hover:bg-blue-500/30"
                        >
                            <i className="fa-solid fa-paper-plane text-[10px]"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CommentItem({
    comment,
    onLike,
    onDelete,
    onEdit,
    currentUserId,
    postId,
    authHeaders,
    profile,
    isRepliesOpen,
    onToggleReplies,
}) {
    const creatorId = comment?.commentCreator?._id ?? comment?.commentCreator?.id;
    const isOwner = !!currentUserId && creatorId === currentUserId;
    const isLiked = isLikedBy(comment.likes, currentUserId);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    function handleSaveEdit() {
        const trimmed = editedContent.trim();
        if (!trimmed || trimmed === comment.content) {
            setEditedContent(comment.content);
            setIsEditing(false);
            return;
        }
        onEdit(comment._id, trimmed);
        setIsEditing(false);
    }

    function handleCancelEdit() {
        setEditedContent(comment.content);
        setIsEditing(false);
    }

    return (
        <>
            <div className="flex items-start gap-3 py-3">
                <div className="w-8 h-8 rounded-full bg-[#1F232B] flex items-center justify-center overflow-hidden border border-[#262626] shrink-0">
                    <img
                        src={comment.commentCreator?.photo}
                        alt={comment.commentCreator?.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <div className="bg-[#1F232B] border border-blue-500/50 rounded-2xl rounded-tl-sm px-3.5 py-2 w-full">
                            <p className="text-white text-xs font-semibold">
                                {comment.commentCreator?.name}
                            </p>
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                rows={2}
                                autoFocus
                                className="w-full bg-transparent outline-none text-sm text-[#C2C6D6] mt-0.5 leading-relaxed resize-none"
                            />
                            <div className="flex items-center justify-end gap-3 mt-1">
                                <button
                                    onClick={handleCancelEdit}
                                    className="text-[11px] font-medium text-[#5c6270] hover:text-white transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="text-[11px] font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#1F232B] border border-[#262626] rounded-2xl rounded-tl-sm px-3.5 py-2 w-fit max-w-full">
                            <p className="text-white text-xs font-semibold">
                                {comment.commentCreator?.name}
                            </p>
                            <p className="text-[#C2C6D6] text-sm mt-0.5 leading-relaxed wrap-break-words">
                                {comment.content}
                            </p>

                            {comment.image && (
                                <div className="mt-2 rounded-xl overflow-hidden border border-[#262626] inline-block">
                                    <img
                                        src={comment.image}
                                        alt="comment attachment"
                                        className="max-h-64 max-w-full object-contain block"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4 mt-1 px-1">
                        <button
                            onClick={() => onLike(comment._id)}
                            className={`cursor-pointer flex items-center gap-1 text-[11px] font-medium transition-colors ${isLiked ? "text-blue-400" : "text-[#5c6270] hover:text-blue-400"
                                }`}
                        >
                            <i className={isLiked ? "fa-solid fa-thumbs-up" : "fa-regular fa-thumbs-up"}></i>
                            {comment.likesCount > 0 ? comment.likesCount : "Like"}
                        </button>
                        <button
                            onClick={() => onToggleReplies(comment._id)}
                            className={`cursor-pointer hover:underline flex items-center gap-1 text-[11px] font-medium transition-colors ${isRepliesOpen ? "text-blue-400" : "text-[#5c6270] hover:text-blue-400"
                                }`}
                        >
                            {isRepliesOpen
                                ? "Hide replies"
                                : `Replies${comment.repliesCount ? ` (${comment.repliesCount})` : ""}`}
                        </button>
                        <span className="text-[11px] text-[#5c6270]">
                            {getRelativeTime(comment.createdAt)}
                        </span>
                        {isOwner && !isEditing && (
                            <div className="ml-auto">
                                <ActionsMenu
                                    onEdit={() => setIsEditing(true)}
                                    onDelete={() => setIsConfirmOpen(true)}
                                />
                            </div>
                        )}
                    </div>

                    {isRepliesOpen && (
                        <RepliesSection
                            postId={postId}
                            comment={comment}
                            currentUserId={currentUserId}
                            authHeaders={authHeaders}
                            profile={profile}
                        />
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => onDelete(comment._id)}
                title="Delete this comment?"
                description="This comment will be permanently removed."
            />
        </>
    );
}

export default function CommentsSection({ postId }) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            content: "",
            image: "",
        },
    });

    const [imagePreview, setImagePreview] = useState(null);
    const watchImage = watch("image");

    useEffect(() => {
        if (watchImage && watchImage.length > 0) {
            const file = watchImage[0];
            const url = URL.createObjectURL(file);
            setImagePreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [watchImage]);

    function removeImage() {
        setValue("image", "");
        setImagePreview(null);
    }

    const { userToken } = useContext(authContext);
    const { profile } = useContext(profileContext);

    const currentUserId = profile?._id;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openRepliesFor, setOpenRepliesFor] = useState(null);

    function toggleReplies(commentId) {
        setOpenRepliesFor((prev) => (prev === commentId ? null : commentId));
    }

    const authHeaders = { headers: { Authorization: `Bearer ${userToken}` } };

    useEffect(() => {
        async function fetchComments() {
            setLoading(true);
            try {
                const { data } = await axios.get(
                    `${BASE_URL}/posts/${postId}/comments`,
                    authHeaders
                );
                setItems(data?.data?.comments);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        fetchComments();
    }, [postId]);

    const convertToFormData = (commentDetails) => {
        const formData = new FormData();
        formData.append("content", commentDetails.content);

        if (commentDetails.image && commentDetails.image.length > 0) {
            formData.append("image", commentDetails.image[0]);
        }

        return formData;
    };

    const { mutate: creatComment, isPending: sending } = useMutation({
        mutationFn: async (commentDetails) => {
            const formData = convertToFormData(commentDetails);

            const { data } = await axios.post(
                `${BASE_URL}/posts/${postId}/comments`,
                formData,
                authHeaders
            );
            return data;
        },
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (response) => {
            toast.success("Comment created successfully!", {
                position: "top-right",
                autoClose: 3000,
            })
            setItems((prev) => [response.data.comment, ...prev]);
            reset();
            setImagePreview(null);
            console.log(response.data);
            queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
        },
    });

    function toggleLikeLocally(prev, id) {
        return prev.map((c) => {
            if (c._id !== id) return c;
            const alreadyLiked = isLikedBy(c.likes, currentUserId);
            return {
                ...c,
                likes: alreadyLiked
                    ? c.likes.filter((l) => (typeof l === "string" ? l !== currentUserId : l?._id !== currentUserId))
                    : [...(c.likes ?? []), currentUserId],
                likesCount: alreadyLiked ? c.likesCount - 1 : c.likesCount + 1,
            };
        });
    }

    async function toggleLike(id) {
        setItems((prev) => toggleLikeLocally(prev, id));
        try {
            await axios.put(
                `${BASE_URL}/posts/${postId}/comments/${id}/like`,
                {},
                authHeaders
            );
        } catch (err) {
            console.log(err);
            setItems((prev) => toggleLikeLocally(prev, id));
        }
    }

    async function deleteComment(id) {
        const prevItems = items;
        setItems((prev) => prev.filter((c) => c._id !== id));
        if (openRepliesFor === id) setOpenRepliesFor(null);
        try {
            toast.success("Comment deleted successfully!", {
                position: "top-right",
                autoClose: 3000,
            })
            await axios.delete(
                `${BASE_URL}/posts/${postId}/comments/${id}`,
                authHeaders
            );
        } catch (err) {
            console.error("Failed to delete comment:", err?.response?.data ?? err.message);
            setItems(prevItems);
        }
    }

    async function editComment(id, content) {
        const prevItems = items;
        setItems((prev) => prev.map((c) => (c._id === id ? { ...c, content } : c)));
        try {
            await axios.put(
                `${BASE_URL}/posts/${postId}/comments/${id}`,
                { content },
                authHeaders
            );
        } catch (err) {
            console.error("Failed to edit comment:", err?.response?.data ?? err.message);
            setItems(prevItems);
        }
    }

    return (
        <div className="border-t border-[#262626] mt-3 pt-3 animate-[fadeIn_0.15s_ease-out]">
            <div className="flex items-center gap-2 px-1 mb-2">
                <span className="text-white font-semibold text-sm">Comments</span>
                <span className="bg-blue-500/15 text-blue-400 text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {items.length}
                </span>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8 text-[#5c6270] text-sm gap-2">
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    Loading comments...
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-8 bg-[#1F232B]/50 rounded-2xl border border-[#262626]">
                    <div className="w-11 h-11 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                        <i className="fa-regular fa-comment text-blue-400 text-lg"></i>
                    </div>
                    <p className="text-white font-semibold text-sm">No comments yet</p>
                    <p className="text-[#5c6270] text-xs mt-1">Be the first to comment.</p>
                </div>
            ) : (
                <div className="divide-y divide-[#262626]/60">
                    {items.map((c) => (
                        <CommentItem
                            key={c._id}
                            comment={c}
                            onLike={toggleLike}
                            onDelete={deleteComment}
                            onEdit={editComment}
                            currentUserId={currentUserId}
                            postId={postId}
                            authHeaders={authHeaders}
                            profile={profile}
                            isRepliesOpen={openRepliesFor === c._id}
                            onToggleReplies={toggleReplies}
                        />
                    ))}
                </div>
            )}

            <div className="flex items-start gap-3 mt-3">
                <div className="w-9 h-9 rounded-full bg-[#1F232B] flex items-center justify-center overflow-hidden border border-[#262626] shrink-0">
                    <img
                        src={profile?.photo}
                        alt={profile?.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <form onSubmit={handleSubmit(creatComment)} className="flex-1 bg-[#1F232B] border border-[#262626] rounded-2xl px-3.5 pt-2.5 pb-2 focus-within:border-blue-500/50 transition-colors">
                    <input
                        placeholder={`Comment as ${profile?.name || "..."}`}
                        className="w-full bg-[#1f232b] outline-none text-sm text-[#5c6270] placeholder:text-[#5c6270] resize-none"
                        {...register("content")}
                    />
                    {imagePreview && (
                        <div className="relative mt-2 inline-block">
                            <img
                                src={imagePreview}
                                alt="preview"
                                className="max-h-40 rounded-lg border border-[#262626] object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px] hover:bg-black transition-colors"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    )}
                    <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-3 text-[#5c6270]">
                            <div>
                                <label htmlFor="image">
                                    <i className="fa-regular fa-image cursor-pointer hover:text-blue-400 transition-colors text-sm"></i>
                                </label>

                                <input
                                    id="image"
                                    {...register("image")}
                                    type="file"
                                    hidden
                                />
                            </div>
                            <div>
                                <i className="fa-regular fa-face-smile text-xs"></i>
                            </div>
                        </div>
                        <button
                            disabled={sending}
                            className="cursor-pointer w-7 h-7 rounded-full bg-blue-500 disabled:bg-blue-500/30 flex items-center justify-center text-white transition-colors hover:bg-blue-600 disabled:hover:bg-blue-500/30"
                        >
                            <i className="fa-solid fa-paper-plane text-[10px]"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}