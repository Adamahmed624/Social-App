import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { authContext } from "../../Context/AuthContext";
import { profileContext } from "../../Context/ProfileContext";
import { useQuery } from "@tanstack/react-query";
import hero from "../../assets/hero.png";

export default function Navbar() {
  const { setuserToken, userToken } = useContext(authContext);
  const { profile, profileLoading } = useContext(profileContext)
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { data: notificationsCount = 0 } = useQuery({
    queryKey: ["getNotificationCount", userToken],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          "https://route-posts.routemisr.com/notifications/unread-count",
          { headers: { token: userToken } }
        );

        return data.data.unreadCount;
      } catch (error) {
        console.error("Failed to fetch notifications count:", error);
        return 0;
      }
    },
    enabled: !!userToken,
  });

  const getLinkClasses = ({ isActive }) =>
    `flex items-center justify-center sm:justify-start text-sm font-semibold transition-colors py-2.5 px-3 sm:px-4 rounded-full ${isActive
      ? "bg-blue-500/15 text-blue-400"
      : "text-[#C2C6D6] hover:bg-[#5C5E67] hover:text-white"
    }`;

  const handleLogout = () => {
    setuserToken(null);
    localStorage.removeItem("token");
    navigate("/");
    setMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar bg-[#171B21] w-full fixed left-0 right-0 top-0 z-50 border-b border-[#2a2c4a]/60">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 py-3 gap-2">
        <div className="flex items-center shrink-0">
          <div className="w-11 h-11 rounded-xl bg-[#12132a] border border-[#2a2c4a] flex flex-col items-center justify-center shrink-0">
            <img src={hero} alt="Nexus Logo" className="w-full h-full rounded-xl object-contain" />
          </div>
          <span className="hidden sm:inline text-xl tracking-widest text-white font-bold ml-4">
            NEXUS
          </span>
        </div>

        {userToken != null && (
          <div className="flex gap-1 items-center bg-[#161616] rounded-full p-1.5 border border-[#242B3B]">
            <NavLink to="/home" className={getLinkClasses}>
              <i className="fa-regular fa-home sm:mr-2"></i>
              <span className="hidden sm:inline">Home</span>
            </NavLink>
            <NavLink to={`/profile`} className={getLinkClasses}>
              <i className="fa-regular fa-user sm:mr-2"></i>
              <span className="hidden sm:inline">Profile</span>
            </NavLink>
            <NavLink to="/notifications" className={getLinkClasses}>
              <span className="relative inline-flex items-center justify-center w-5 h-5 sm:mr-2">
                <i className="fa-regular fa-comment text-sm"></i>
                {notificationsCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-4 h-4 px-0.75 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full leading-none ring-2 ring-[#171B21]">
                    {notificationsCount > 9 ? "9+" : notificationsCount}
                  </span>
                )}
              </span>
              <span className="hidden sm:inline">Notifications</span>
            </NavLink>
          </div>
        )}

        {userToken === null ? (
          <ul className="flex items-center justify-between gap-2">
            <li>
              <NavLink to="/register" className={getLinkClasses}>
                <i className="fa-solid fa-user-plus sm:mr-2"></i>
                <span className="hidden sm:inline">Register</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/" className={getLinkClasses}>
                <i className="fa-solid fa-right-to-bracket sm:mr-2"></i>
                <span className="hidden sm:inline">Login</span>
              </NavLink>
            </li>
          </ul>
        ) : (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="cursor-pointer flex items-center gap-2 pl-1.5 pr-2.5 sm:pr-3 py-1.5 rounded-full bg-[#161616] border border-[#262626] hover:border-[#3a3a3a] transition-colors"
            >
              {profileLoading ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-[#1F232B] animate-pulse"></div>
                  <div className="hidden sm:block h-3 w-12 bg-[#1F232B] rounded animate-pulse"></div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-[#1F232B] border border-[#262626] flex items-center justify-center overflow-hidden">
                    {profile?.photo ? (
                      <img src={profile.photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <i className="fa-solid fa-user text-[#6b7280] text-xs"></i>
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm font-semibold text-white">{profile?.name}</span>
                </>
              )}
              <i className="fa-solid fa-bars text-[#C2C6D6] text-xs ml-1"></i>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#171B21] border border-[#262626] rounded-2xl shadow-xl overflow-hidden py-2">
                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#C2C6D6] hover:bg-[#1F232B] hover:text-white transition-colors"
                >
                  <i className="fa-regular fa-user w-4"></i>
                  Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#C2C6D6] hover:bg-[#1F232B] hover:text-white transition-colors"
                >
                  <i className="fa-solid fa-gear w-4"></i>
                  Settings
                </NavLink>

                <div className="my-1 border-t border-[#262626]"></div>

                <button
                  onClick={handleLogout}
                  className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <i className="fa-solid fa-right-from-bracket w-4"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}