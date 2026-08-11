import { useContext } from "react";
import { profileContext } from "../../Context/ProfileContext";
import HomeSkeleton from "./HomeSkelaton";
import Sidebar from "./Sidebar";
import SuggestedFriends from "./SuggestedFriends";
import { Outlet } from "react-router-dom";
import CreatPost from "../CreatPost/CreatPost";

export default function Home() {


  const { profile, profileLoading } = useContext(profileContext);

  const sidebarLinks = [
    { icon: "fa-regular fa-newspaper", label: "Feed", path: "" },
    { icon: "fa-solid fa-bolt", label: "My Posts", path: 'myposts' },
    { icon: "fa-solid fa-globe", label: "Community", path: 'community' },
    { icon: "fa-regular fa-bookmark", label: "Saved", path: 'saved' },
  ];

  if (profileLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#0D0F13] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[220px_1fr_320px] gap-6">
        <Sidebar sidebarLinks={sidebarLinks} />

        <main className="space-y-6">
          <div className="bg-[#171B21] border border-[#262626] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-[#1F232B] flex items-center justify-center overflow-hidden border border-[#262626]">
                <img src={profile?.photo} alt={profile?.name} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{profile?.name}</p>
                <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#171B21] border border-[#262626]  px-2 py-0.5 text-xs font-semibold text-slate-500">
                  <i className="fas fa-globe"></i>
                  <select className="bg-transparent outline-none">
                    <option value="public">public</option>
                    <option value="following">followers</option>
                    <option value="only_me">only me</option>
                  </select>
                </div>
              </div>
            </div>

            <CreatPost/>
          </div>


          <Outlet />

        </main>

        <SuggestedFriends />

      </div>
    </div>
  );
}