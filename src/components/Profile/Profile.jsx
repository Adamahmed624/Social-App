import { useContext, useEffect, useState } from "react";
import { profileContext } from "../../Context/ProfileContext";
import { authContext } from "../../Context/AuthContext";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PostCard from "../Home/PostCard";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import ProfileHeaderSkeleton from "./ProfileSkeleton";

export default function ProfileHeader() {
    const { id: paramId } = useParams();
    const { userToken } = useContext(authContext);
    const { profile, refetchProfile } = useContext(profileContext);
    const [activeTab, setActiveTab] = useState("myposts");
    const [openCoverPreview, setOpenCoverPreview] = useState(false);
    const [openProfilePreview, setOpenProfilePreview] = useState(false);
    const [openAdjustPhoto, setOpenAdjustPhoto] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const queryClient = useQueryClient()

    const { handleSubmit, register, watch, setValue } = useForm({
        defaultValues: {
            photo: ''
        }
    })
    const photoValue = watch("photo");

    useEffect(() => {
        if (photoValue && photoValue.length > 0) {
            const file = photoValue[0];
            const previewUrl = URL.createObjectURL(file);
            setPhotoPreview(previewUrl);
            setOpenAdjustPhoto(true);

            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [photoValue]);

    const isOwnProfile = !paramId || paramId === profile?._id;
    const id = paramId || profile?._id;

    const [isFollowing, setIsFollowing] = useState(false);

    function handleCancelPhoto() {
        setValue("photo", '');
        setOpenAdjustPhoto(false);
        setPhotoPreview(null);
    }


    function convertToFormData(newProfileImage) {
        const formData = new FormData
        if (newProfileImage.photo && newProfileImage.photo.length > 0) {
            formData.append("photo", newProfileImage.photo[0])
        }
        return formData
    }

    const {
        mutate: changeProfilePhoto,
        isPending: isLoading,
    } = useMutation({
        mutationFn: async (newProfileImage) => {
            const formData = convertToFormData(newProfileImage);
            const { data } = await axios.put(
                `https://route-posts.routemisr.com/users/upload-photo`,
                formData,
                { headers: { Authorization: `Bearer ${userToken}` } }
            );
            return data;
        },
        onSuccess: () => {
            setValue("photo", '');
            setOpenAdjustPhoto(false);
            setPhotoPreview(null);

            refetchProfile();
        },
        onError: (error) => {
            console.log(error);
        },
    });

    async function getUserProfile() {
        const { data } = await axios.get(
            `https://route-posts.routemisr.com/users/${id}/profile`,
            { headers: { token: userToken } }
        );
        return data.data.user;
    }

    const {
        data: otherProfile,
        isLoading: isLoadingOtherProfile,
    } = useQuery({
        queryKey: ["getUserProfile", id],
        queryFn: getUserProfile,
        enabled: !isOwnProfile && !!id && !!userToken,
    });

    useEffect(() => {
        if (otherProfile) {
            const isFollowed = otherProfile.followers?.some(
                (follower) => follower._id === profile?._id
            );
            setIsFollowing(isFollowed);
        }
    }, [otherProfile, profile]);

    const [followersCount, setFollowersCount] = useState(0);

    const { mutate: handleFollow, isPending: followLoading } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.put(
                `https://route-posts.routemisr.com/users/${id}/follow`,
                {},
                { headers: { token: userToken } }
            );
            return data;
        },
        onSuccess: (data) => {
            setIsFollowing(data.data.following);
            setFollowersCount(data.data.followersCount);
            queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
        },
        onError: (error) => {
            console.error("Failed to follow/unfollow:", error);
        },
    });

    async function getAllMyPosts() {
        const { data } = await axios.get(
            `https://route-posts.routemisr.com/users/${id}/posts`,
            { headers: { token: userToken } }
        );
        return data.data.posts;
    }

    const {
        data: allMyPosts,
        isLoading: isLoadingMyPosts,
        isError: isErrorMyPosts,
        error: errorMyPosts,
    } = useQuery({
        queryKey: ["getAllMyPosts", id],
        queryFn: getAllMyPosts,
        enabled: !!id && !!userToken,
    });

    async function getAllSavedPosts() {
        const { data } = await axios.get(
            `https://route-posts.routemisr.com/users/bookmarks`,
            { headers: { Authorization: `Bearer ${userToken}` } }
        );
        return data.data.bookmarks;
    }

    const {
        data: allSavedPosts,
        isLoading: isLoadingSaved,
        isError: isErrorSaved,
        error: errorSaved,
    } = useQuery({
        queryKey: ["getAllSavedPosts", userToken],
        queryFn: getAllSavedPosts,
        enabled: !!userToken && isOwnProfile,
    });

    const headerData = isOwnProfile ? profile : otherProfile;

    if (!headerData || (!isOwnProfile && isLoadingOtherProfile)) {
        return (
            <div className="min-h-screen bg-[#0D0F13] py-10 px-4 flex items-center justify-center">
                <p className="text-[#5c6270] text-sm">Loading profile...</p>
            </div>
        );
    }

    if (isLoadingMyPosts || (isOwnProfile && isLoadingSaved)) return <ProfileHeaderSkeleton />;

    if (isErrorMyPosts) {
        return (
            <div className="w-full rounded-2xl bg-[#171B21] border border-[#262626] p-10 text-center text-slate-500 shadow-sm">
                {errorMyPosts.message}
            </div>
        );
    }

    if (isOwnProfile && isErrorSaved) {
        return (
            <div className="w-full rounded-2xl bg-[#171B21] border border-[#262626] p-10 text-center text-slate-500 shadow-sm">
                {errorSaved.message}
            </div>
        );
    }

    const stats = [
        { label: "Followers", value: headerData.followersCount },
        { label: "Following", value: headerData.followingCount },
        { label: "Bookmarks", value: headerData.bookmarksCount },
    ];

    const myPostsCount = allMyPosts?.length;
    const savedPostsCount = allSavedPosts?.length;


    return (
        <div className="min-h-screen bg-[#0D0F13] py-10 px-4">
            <div className="md:max-w-3/4 mx-auto">
                {openCoverPreview && (
                    <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/90 p-4 sm:p-8">
                        <button
                            onClick={() => setOpenCoverPreview(false)}
                            className="cursor-pointer absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                        <img
                            className="max-h-full max-w-full object-contain"
                            src={headerData.cover}
                            alt="cover"
                        />
                    </div>
                )}
                {openProfilePreview && (
                    <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/90 p-4 sm:p-8">
                        <button
                            onClick={() => setOpenProfilePreview(false)}
                            className="cursor-pointer absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                        <img
                            className="max-h-full max-w-full object-contain"
                            src={headerData.photo}
                            alt="profile"
                        />
                    </div>
                )}
                {openAdjustPhoto && (
                    <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/90 p-4 sm:p-8">
                        <div className="bg-[#171B21] border border-[#262626] rounded-2xl p-6 w-full max-w-sm">
                            <h2 className="text-white font-bold text-lg mb-4 text-center">Update profile photo</h2>

                            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-[#262626]">
                                <img
                                    src={photoPreview}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCancelPhoto}
                                    className="cursor-pointer flex-1 rounded-lg bg-[#0D0F13] border border-[#262626] text-white py-2 text-sm font-semibold hover:bg-[#262626]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={handleSubmit(changeProfilePhoto)}
                                    className="cursor-pointer flex-1 rounded-lg bg-blue-500 text-white py-2 text-sm font-semibold hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-[#262626] bg-[#171B21]  sm:rounded-[28px]">

                    <div className="h-44 sm:h-52 w-full relative group/cover">
                        {headerData.cover ? (
                            <img src={headerData.cover} alt="cover" className="w-full h-full object-cover" />
                        ) : (
                            <div className="h-full bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)]"></div>
                        )}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,255,255,.14)_0%,rgba(255,255,255,0)_36%)]"> </div>
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/25 to-transparent"></div>
                        <div className="absolute right-8 top-6 h-48 w-48 rounded-full bg-[#c7e6ff]/10 blur-3xl"></div>
                        <div className="absolute -left-16 top-10 h-36 w-36 rounded-full bg-white/8 blur-3xl"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgba(186,230,253,.22)_0%,rgba(186,230,253,0)_44%)]"></div>
                        <div className="cursor-pointer absolute right-2 top-2 z-10 flex max-w-9/10 flex-wrap items-center justify-end gap-1.5 opacity-100 transition duration-200 sm:right-3 sm:top-3 sm:max-w-none sm:gap-2 sm:opacity-0 sm:group-hover/cover:opacity-100 sm:group-focus-within/cover:opacity-100">
                            <button onClick={() => setOpenCoverPreview(!openCoverPreview)} className="cursor-pointer  inline-flex items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
                                <i className="fas fa-expand text-[13px]"></i>
                                View cover
                            </button>

                            <label htmlFor="coverInput" className=" inline-flex cursor-pointer items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
                                <i className="fa-regular fa-camera"></i>
                                Change cover
                                <input id="coverInput" type="file" accept="image/*" hidden />
                            </label>
                            <button className="cursor-pointer  inline-flex items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
                                <i className="fas fa-trash text-[13px]"></i>
                                Remove
                            </button>
                        </div>
                    </div>

                    <div className="-mt-1  bg-[#1F232B] w-full mx-auto rounded-b-3xl px-6 pb-6 pt-16 shadow-[0_-8px_20px_rgba(0,0,0,0.25)]">

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                            <div className="flex">
                                <div className=" left-6 -bottom-14 w-28 h-28 rounded-full border-4 border-[#171B21] bg-[#1F232B] overflow-hidden shadow-lg">
                                    <div className="group/avatar shrink-0 relative w-full h-full">
                                        <button className="cursor-pointer rounded-full w-full h-full">
                                            <img
                                                src={headerData.photo}
                                                alt={headerData.name}
                                                className="w-full h-full object-cover rounded-full border-4 border-[#171B21] shadow-md ring-2 ring-blue-500/30"
                                            />
                                        </button>
                                        <button onClick={() => setOpenProfilePreview(!openProfilePreview)} className="absolute bottom-1 left-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1F232B] text-blue-400 opacity-100 shadow-sm ring-1 ring-[#262626] transition duration-200 hover:bg-[#262626] sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100">
                                            <i className="fas fa-expand text-4"></i>
                                        </button>
                                        <form>
                                            <label htmlFor="changeProfilePhoto" className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] text-white opacity-100 shadow-sm transition duration-200 hover:bg-[#166fe5] sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100">
                                                <i className="fa-regular fa-camera text-4"></i>
                                                <input {...register("photo")} id="changeProfilePhoto" type="file" accept="image/*" hidden />
                                            </label>
                                        </form>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-white font-bold text-xl leading-tight">{headerData.name}</h1>
                                    <p className="text-[#5c6270] text-sm">@{headerData.username}</p>
                                    {isOwnProfile && (
                                        <span className="inline-flex items-center gap-1.5 mt-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-[11px] font-semibold text-blue-400">
                                            <i className="fa-solid fa-user-group text-[10px]"></i>
                                            Route Posts member
                                        </span>
                                    )}
                                </div>
                            </div>


                            {isOwnProfile ? (
                                <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto">
                                    {stats.map((s) => (
                                        <div key={s.label} className="bg-[#0D0F13] border border-[#262626] rounded-xl px-4 py-3 text-center min-w-21">
                                            <p className="text-[10px] font-semibold tracking-wide text-[#5c6270] uppercase">{s.label}</p>
                                            <p className="text-white font-bold text-lg mt-0.5">{s.value}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <button
                                    onClick={handleFollow}
                                    disabled={followLoading}
                                    className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors disabled:opacity-60 ${isFollowing
                                        ? "bg-[#0D0F13] border border-[#262626] text-white hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                >
                                    {followLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
                                </button>
                            )}
                        </div>

                        {isOwnProfile && (
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4 mt-6">
                                <div className="bg-[#0D0F13] border border-[#262626] rounded-xl p-4">
                                    <p className="text-white font-semibold text-sm mb-3">About</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-[#C2C6D6]">
                                            <i className="fa-regular fa-envelope text-[#5c6270] w-4"></i>
                                            <span className="truncate">{headerData.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[#C2C6D6]">
                                            <i className="fa-regular fa-user text-[#5c6270] w-4"></i>
                                            Active on Route Posts
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
                                        <p className="text-[10px] font-semibold tracking-wide text-blue-400 uppercase">My Posts</p>
                                        <p className="text-white font-bold text-lg mt-0.5">{myPostsCount}</p>
                                    </div>
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
                                        <p className="text-[10px] font-semibold tracking-wide text-blue-400 uppercase">Saved Posts</p>
                                        <p className="text-white font-bold text-lg mt-0.5">{savedPostsCount}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#171B21] border border-[#262626] rounded-2xl mt-4 px-3 py-2.5">
                    {isOwnProfile && (
                        <div className="flex items-center justify-between">
                            <div className="flex justify-between w-full items-center gap-2">
                                <div className="flex">
                                    <button
                                        onClick={() => setActiveTab("myposts")}
                                        className={`cursor-pointer flex items-center gap-2 text-sm font-semibold px-3.5 py-2 rounded-xl transition-colors ${activeTab === "myposts" ? "bg-blue-500/15 text-blue-400" : "text-[#5c6270] hover:text-[#C2C6D6]"
                                            }`}
                                    >
                                        <i className="fa-regular fa-file-lines"></i>
                                        {isOwnProfile ? "My Posts" : "Posts"}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("saved")}
                                        className={`cursor-pointer flex items-center gap-2 text-sm font-semibold px-3.5 py-2 rounded-xl transition-colors ${activeTab === "saved" ? "bg-blue-500/15 text-blue-400" : "text-[#5c6270] hover:text-[#C2C6D6]"
                                            }`}
                                    >
                                        <i className="fa-regular fa-bookmark"></i>
                                        Saved
                                    </button>
                                </div>
                                <span className="bg-blue-500/15 text-blue-400 text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {activeTab === "myposts" ? myPostsCount : savedPostsCount}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        {activeTab === "myposts"
                            ? allMyPosts.length > 0 ? allMyPosts.map((p) => <PostCard key={p._id} post={p} />) : <p className="mt-3 rounded-xl w-full bg-[#171B21] border border-[#262626] text-[#5c6270] py-6 px-5 text-center">No posts found.</p>
                            : allSavedPosts?.length > 0 ? allSavedPosts.map((p) => <PostCard key={p._id} post={p} />) : <p className="mt-3 rounded-xl w-full bg-[#171B21] border border-[#262626] text-[#5c6270] py-6 px-5 text-center">No posts found.</p>}
                    </div>
                </div>
            </div>
        </div >
    );
}