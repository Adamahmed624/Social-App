import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../schema/registerSchema";
import axios from "axios";

import hero from "../../assets/hero.png";
export default function NexusSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setapiError] = useState(null)
  const [isLoading, setisLoading] = useState(false)




  let { register, handleSubmit, formState: { errors, touchedFields, isSubmitted } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    mode: "onBlur",
    resolver: zodResolver(schema)
  });

  const navigate = useNavigate()

  async function submitForm(userObj) {
    setisLoading(true)
    setapiError(null)

    axios.post("https://route-posts.routemisr.com/users/signup", userObj)
      .then((res) => {
        localStorage.setItem("token", res.data.data.token)
        if (res.data.message == "account created") {
          navigate("/")
        }
      })

      .catch((err) => {
        setapiError(err.response.data.message)
      })
      .finally(() => {
        setisLoading(false)
      })
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a14] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-[#0f0f1c] border border-[#1f2037] rounded-2xl shadow-2xl shadow-black/40 p-8">
        <div className="flex justify-center mb-5">
          <div className={`w-13 h-13 rounded-xl bg-[#12132a] border border-[#2a2c4a] flex flex-col items-center justify-center shrink-0`}>
            <img src={hero} alt="Nexus Logo" className="w-full h-full rounded-xl object-contain" />
          </div>
        </div>

        <h1 className="text-center text-white text-2xl font-bold mb-2">
          Register for <span className="text-blue-500">Nexus</span>
        </h1>
        <p className="text-center text-slate-400 text-sm mb-8 leading-relaxed">
          Enter your credentials to join the
          <br />
          decentralized frontier.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>
          <div>
            <label className="block text-xs font-semibold tracking-wide text-slate-300 mb-2 uppercase">
              Full Name
            </label>
            <div className="relative">
              <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="text"
                placeholder="Jane Doe"
                className="w-full bg-[#14152a] border border-[#262844] rounded-lg py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
                {...register("name")}
              />
            </div>
            {errors.name && (touchedFields.name || isSubmitted) ? (
              <p className="text-xs text-red-400 mt-1 pl-1">{errors.name?.message}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-slate-300 mb-2 uppercase">
              User Name
            </label>
            <div className="relative">
              <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="text"
                placeholder="Jane Doe"
                className="w-full bg-[#14152a] border border-[#262844] rounded-lg py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
                {...register("username")}
              />
            </div>
            {errors.username && (touchedFields.username || isSubmitted) ? (
              <p className="text-xs text-red-400 mt-1 pl-1">{errors.username?.message}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-slate-300 mb-2 uppercase">
              Email
            </label>
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="email"
                placeholder="name@nexus.io"
                className="w-full bg-[#14152a] border border-[#262844] rounded-lg py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
                {...register("email")}
              />
            </div>
            {errors.email && (touchedFields.email || isSubmitted) ? (
              <p className="text-xs text-red-400 mt-1 pl-1">{errors.email?.message}</p>
            ) : null}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
                Password
              </label>
            </div>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-[#14152a] border border-[#262844] rounded-lg py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i
                  className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"
                    } text-sm`}
                />
              </button>
            </div>
            {errors.password && (touchedFields.password || isSubmitted) ? (
              <p className="text-xs text-red-400 mt-1 pl-1">{errors.password?.message}</p>
            ) : null}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
                Confirm Password
              </label>
            </div>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-[#14152a] border border-[#262844] rounded-lg py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
                {...register("rePassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                <i
                  className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    } text-sm`}
                />
              </button>
            </div>
            {errors.rePassword && (touchedFields.rePassword || isSubmitted) ? (
              <p className="text-xs text-red-400 mt-1 pl-1">{errors.rePassword?.message}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-slate-300 mb-2 uppercase">
              Date of Birth
            </label>
            <div className="relative">
              <i className="fa-solid fa-cake-candles absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none" />
              <input
                type="date"
                className="w-full bg-[#14152a] border border-[#262844] rounded-lg py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all scheme-dark [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                {...register("dateOfBirth")}
              />
            </div>
            {errors.dateOfBirth && (touchedFields.dateOfBirth || isSubmitted) ? (
              <p className="text-xs text-red-400 mt-1 pl-1">{errors.dateOfBirth?.message}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-slate-300 mb-2 uppercase">
              Gender
            </label>
            <div className="relative">
              <i className="fa-solid fa-venus-mars absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none" />
              <select
                defaultValue=""
                className="w-full appearance-none bg-[#14152a] border border-[#262844] rounded-lg py-2.5 pl-10 pr-9 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
                {...register("gender")}
              >
                <option value="" disabled className="text-slate-600">
                  Select gender
                </option>
                <option value="female" className="bg-[#14152a] text-white">
                  Female
                </option>
                <option value="male" className="bg-[#14152a] text-white">
                  Male
                </option>
              </select>
              <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none" />
            </div>
            {errors.gender && (touchedFields.gender || isSubmitted) ? (
              <p className="text-xs text-red-400 mt-1 pl-1">{errors.gender?.message}</p>
            ) : null}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-600 bg-[#12132a] accent-blue-500"
            />
            I agree to the
            <span href="#" className="text-blue-400 hover:underline">
              Terms
            </span>
            and
            <span href="#" className="text-blue-400 hover:underline">
              Privacy
            </span>
            .
          </label>

          <button
            type="submit"
            className="cursor-pointer w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2"
          >
            {isLoading ? <div className="flex gap-2" role="status" aria-label="Loading">
              <span className="size-2 animate-pulse rounded-full bg-indigo-600" aria-hidden="true"></span>
              <span
                className="size-2 animate-pulse rounded-full bg-indigo-600 [animation-delay:0.2s]"
                aria-hidden="true"
              ></span>
              <span
                className="size-2 animate-pulse rounded-full bg-indigo-600 [animation-delay:0.4s]"
                aria-hidden="true"
              ></span>
            </div> : "Register"}
          </button>
          {setapiError && <div>
            <p className="text-center w-full text-red-500 text-md">{apiError}</p>
          </div>}
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?
          <Link
            to="/"
            className="ml-1.5 text-blue-400 hover:underline font-medium"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}