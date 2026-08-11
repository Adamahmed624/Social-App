import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../schema/LoginSchema";
import axios from "axios";
import { authContext } from "../../Context/AuthContext";
import hero from "../../assets/hero.png";
export default function NexusSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setapiError] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const { setuserToken } = useContext(authContext)
  const navigate = useNavigate()




  let { register, handleSubmit, formState: { errors, touchedFields, isSubmitted } } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
    resolver: zodResolver(LoginSchema)
  });



  async function submitForm(userObj) {
    setisLoading(true)
    setapiError(null)

    axios.post("https://route-posts.routemisr.com/users/signin", userObj)
      .then((res) => {
        setuserToken(res.data.data.token)
        localStorage.setItem("token", res.data.data.token)
        if (res.data.message == "signed in successfully") {

          navigate("/home")
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
          Login to <span className="text-blue-500">Nexus</span>
        </h1>
        <p className="text-center text-slate-400 text-sm mb-8 leading-relaxed">
          Enter your credentials to access the
          <br />
          decentralized frontier.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>

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
              <span className="size-2 animate-pulse rounded-full bg-white" aria-hidden="true"></span>
              <span
                className="size-2 animate-pulse rounded-full bg-white [animation-delay:0.2s]"
                aria-hidden="true"
              ></span>
              <span
                className="size-2 animate-pulse rounded-full bg-white [animation-delay:0.4s]"
                aria-hidden="true"
              ></span>
            </div> : "Login"}
          </button>
          {setapiError && <div>
            <p className="text-center w-full text-red-500 text-md">{apiError}</p>
          </div>}
        </form>
        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account?
          <Link
            to="/register"
            className="ml-1.5 text-blue-400 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}