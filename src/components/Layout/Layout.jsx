import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

export default function Layout() {
  return (
    <>
      <div className="min-h-screen bg-[#0d0f14]">
        <Navbar />
        <main className="pt-20 text-white">
          <Outlet />
        </main>
      </div>
    </>
  )
}
