import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { authContext } from "../../Context/AuthContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";



export default function NotificationsPanel() {
  const {userToken} = useContext(authContext)
  const [filter, setFilter] = useState("all");

  const API = axios.create({
    baseURL: "https://route-posts.routemisr.com",
    headers: { Authorization: `Bearer ${userToken}` },
  });
  
  const ACTION_TEXT = {
    comment_post: "commented on your post",
    like_post: "liked your post",
    share_post: "shared your post",
  };
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => API.get("/notifications").then((res) => res.data.data.notifications),
  });

  const markAsRead = useMutation({
    mutationFn: (id) => API.patch(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getNotificationCount"] }),
  });

  const markAllAsRead = useMutation({
    mutationFn: () => API.patch("/notifications/read-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getNotificationCount"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  });

  const notifications = data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const visibleNotifications =
    filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  const tabs = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
  ];

  return (
    <div className="min-h-screen flex justify-center p-6 bg-[#15181E]">
      <div
        className="w-full max-w-7xl rounded-2xl overflow-hidden bg-[#1F232B] border border-[#262626]"
      >
        <div className="flex items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold text-[#F4F4F5]">
            Notifications
          </h1>
          <button
            onClick={() => markAllAsRead.mutate()}
            disabled={notifications.every((n) => n.isRead)}
            className="cursor-pointer text-[13px] font-medium px-3.5 py-2 rounded-lg text-[#d4d4d8] border border-[#262626] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-check-double" /> Mark all as read
          </button>
        </div>

        <div className="flex items-center gap-2 px-6 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`text-[13px] font-semibold px-4 py-1.5 rounded-full transition-colors ${
                filter === tab.key
                  ? "bg-[#5b8def] text-white"
                  : "bg-[#262626] text-[#a1a1aa] hover:bg-[#2f2f33]"
              }`}
            >
              {tab.label}
              {tab.key === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 text-[11px] opacity-90">
                  ({unreadCount})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="border-t border-[#262626]">
          {isLoading ? (
            <p className="text-center py-10 text-[#71717A]">
              Loading...
            </p>
          ) : visibleNotifications.length === 0 ? (
            <p className="text-center py-10 text-[#71717A]">
              {filter === "unread" ? "No unread notifications" : "No notifications"}
            </p>
          ) : (
            visibleNotifications.map((n) => (
              <Link
                to={`/postDetails/${n.entityId}`}
                key={n._id}
                className={`mb-3 cursor-default w-9/10 mx-auto rounded-xl hover:bg-[#2b303d] flex items-start gap-3 px-5 py-4 ${!n.isRead ? "bg-[#242B3B]" : "transparent"} border-b border-[#262626]`}
              >
                <Link to={`/profile/${n.actor._id}`} className="cursor-pointer">
                  <img src={n.actor.photo} alt={n.actor.name} className="w-11 h-11 rounded-full object-cover" />
                </Link>

                <div className="flex-1">
                  <p className="text-[14px] text-[#D4D4D8]">
                    <Link to={`/profile/${n.actor._id}`} className="font-semibold text-[#F4F4F5] hover:underline">
                      {n.actor.name}
                    </Link>{" "}
                    {ACTION_TEXT[n.type]}
                  </p>

                  {n.entity?.body && (
                    <p className="text-[13px] mt-0.5 text-[#71717A]">
                      {n.entity.body}
                    </p>
                  )}

                  {!n.isRead ? (
                    <button
                      onClick={() => markAsRead.mutate(n._id)}
                      className="cursor-pointer text-[12.5px] font-medium mt-2 text-[#5b8def]"
                    >
                      <i className="fa-solid fa-check" /> Mark as read
                    </button>
                  ) : (
                    <span className="text-[12.5px] font-medium mt-2 block text-[#22C55E]">
                      <i className="fa-solid fa-check" /> Read
                    </span>
                  )}
                </div>

                <span className="text-[12px] text-[#71717A]">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}