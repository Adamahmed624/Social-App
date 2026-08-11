import { NavLink } from "react-router-dom";

export default function Sidebar({ sidebarLinks }) {
  return (
    <aside className="hidden lg:block">
      <nav className="bg-[#171B21] border border-[#262626] rounded-2xl p-2 space-y-1 sticky top-24">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.path}
            end
            className={({ isActive }) =>
              `w-full flex items-center gap-3 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${
                isActive
                  ? "bg-blue-500/15 text-blue-400"
                  : "text-[#C2C6D6] hover:bg-[#1F232B] hover:text-white"
              }`
            }
          >
            <i className={`${link.icon} w-4 text-center`}></i>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}