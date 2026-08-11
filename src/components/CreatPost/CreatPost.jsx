import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { authContext } from "../../Context/AuthContext"
import { profileContext } from "../../Context/ProfileContext"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function CreatPost() {
    const { userToken } = useContext(authContext)
    const { profile } = useContext(profileContext);

    const queryClient = useQueryClient();


    const { register, reset, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            body: '',
            image: ''
        }
    })

    const [imagePreview, setImagePreview] = useState(null)
    const watchImage = watch("image")

    useEffect(() => {
        if (watchImage && watchImage.length > 0) {
            const file = watchImage[0]
            const url = URL.createObjectURL(file);
            setImagePreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [watchImage])

    function removeImage() {
        setValue("image", "")
        setImagePreview(null)
    }
    const convertToFormData = (postDetails) => {
        const formData = new FormData();
        formData.append("body", postDetails.body);

        if (postDetails.image && postDetails.image.length > 0) {
            formData.append("image", postDetails.image[0]);
        }

        return formData;
    };

    const {
        mutate: createPost,
        isPending: sending,
    } = useMutation({
        mutationFn: async (postDetails) => {
            const formData = convertToFormData(postDetails);
            const { data } = await axios.post(
                `https://route-posts.routemisr.com/posts`,
                formData,
                { headers: { Authorization: `Bearer ${userToken}` } }
            );
            return data;
        },
        onSuccess: () => {
            reset();
            setImagePreview(null);

            queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllFeedPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getAllMyPosts"] });
        },
        onError: (error) => {
            console.log(error);
        },
    });
    return (
        <>
            <form onSubmit={handleSubmit(createPost)}>
                <textarea
                    placeholder={`What's on your mind, ${profile?.name}?`}
                    rows={3}
                    className="w-full bg-[#0D0F13] border border-[#262626] rounded-xl p-4 text-sm text-white placeholder:text-[#5c6270] resize-none focus:outline-none focus:border-blue-500/40 transition-colors"
                    {...register("body")}
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

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#262626]">
                    <div className="flex items-center gap-5">
                        <label htmlFor="postImage" className="cursor-pointer flex items-center gap-2 text-sm text-[#C2C6D6] hover:text-emerald-400 transition-colors">
                            <i className="fa-regular fa-image text-emerald-400"></i>
                            Photo/video
                        </label>
                        <input type="file" hidden id="postImage" {...register("image")} />
                        <button className="flex items-center gap-2 text-sm text-[#C2C6D6] hover:text-amber-400 transition-colors">
                            <i className="fa-regular fa-face-smile text-amber-400"></i>
                            Feeling/activity
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={sending || (!watch("body"))}
                        className="cursor-pointer flex items-center gap-2 text-sm font-semibold bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 rounded-full transition-colors"
                    >
                        {sending ? 'Posting' : 'Post'}
                        <i className="fa-solid fa-paper-plane text-xs"></i>
                    </button>
                </div>
            </form>
        </>
    )
}
