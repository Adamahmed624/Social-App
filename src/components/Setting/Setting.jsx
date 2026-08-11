import { useContext, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "At least 8 characters with uppercase, lowercase, number, and special character."
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export default function ChangePassword() {
  const { userToken } = useContext(authContext);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
    resolver: zodResolver(passwordSchema),
  });

  async function onSubmit(data) {
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        {
          password: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setSuccessMsg("Your password has been updated successfully.");
      reset()
      navigate("/")
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0F13] flex items-start justify-center pt-20 pb-10 px-4">
      <div className="w-full max-w-2xl bg-[#171B21] border border-[#262626] rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-key text-blue-400"></i>
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">Change Password</h2>
            <p className="text-sm text-[#5c6270] mt-0.5">
              Keep your account secure by using a strong password.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Current password
            </label>
            <input
              type="password"
              {...register("currentPassword")}
              placeholder="Enter current password"
              className={`w-full bg-[#0D0F13] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#5c6270] focus:outline-none transition-colors ${
                errors.currentPassword
                  ? "border-red-500/60 focus:border-red-500/60"
                  : "border-[#262626] focus:border-blue-500/40"
              }`}
            />
            {errors.currentPassword && (
              <p className="text-xs text-red-400 mt-2">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              New password
            </label>
            <input
              type="password"
              {...register("newPassword")}
              placeholder="Enter new password"
              className={`w-full bg-[#0D0F13] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#5c6270] focus:outline-none transition-colors ${
                errors.newPassword
                  ? "border-red-500/60 focus:border-red-500/60"
                  : "border-[#262626] focus:border-blue-500/40"
              }`}
            />
            {errors.newPassword && (
              <p className="text-xs text-red-400 mt-2">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Confirm new password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Re-enter new password"
              className={`w-full bg-[#0D0F13] border rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#5c6270] focus:outline-none transition-colors ${
                errors.confirmPassword
                  ? "border-red-500/60 focus:border-red-500/60"
                  : "border-[#262626] focus:border-blue-500/40"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-2">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <i className="fa-solid fa-circle-exclamation"></i>
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
              <i className="fa-solid fa-circle-check"></i>
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer w-full flex items-center justify-center gap-2 text-sm font-semibold bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl transition-colors"
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                Updating...
              </>
            ) : (
              "Update password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}