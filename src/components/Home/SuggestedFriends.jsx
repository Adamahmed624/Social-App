import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { authContext } from "../../Context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function SuggestedFriends() {
  const { userToken } = useContext(authContext);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  async function getSuggestedFriends() {
    const { data } = await axios.get(
      `https://route-posts.routemisr.com/users/suggestions?limit=5`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return data.data.suggestions;
  }

  const {
    data: suggestedFriendes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getSuggestedFriends"],
    queryFn: getSuggestedFriends,
  });

  const { mutate: handleFollow, isPending: followLoading, variables: followingId } = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.put(
        `https://route-posts.routemisr.com/users/${id}/follow`,
        {},
        { headers: { token: userToken } }
      );
      return data;
    },
    onSuccess: (data, id) => {
      queryClient.setQueryData(["getSuggestedFriends"], (old) =>
        old?.map((user) =>
          user._id === id
            ? {
                ...user,
                isFollowing: data.data.following,
                followersCount: data.data.followersCount,
              }
            : user
        )
      );
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
    },
    onError: (error) => {
      console.error("Failed to follow/unfollow:", error);
    },
  });

  const displayedFriends = searchTerm
    ? suggestedFriendes?.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.username.toLowerCase().includes(searchTerm)
      )
    : suggestedFriendes;

  return (
    <>
      <aside className="hidden lg:block">
        <div className="bg-[#171B21] border border-[#262626] rounded-2xl p-5 sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-user-group text-blue-400 text-sm"></i>
              <h2 className="text-white font-bold text-sm">Suggested Friends</h2>
            </div>
            <span className="bg-[#1F232B] text-[#C2C6D6] text-xs font-semibold px-2 py-0.5 rounded-full">
              {suggestedFriendes?.length}
            </span>
          </div>

          <div className="relative mb-5">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5c6270] text-xs"></i>
            <input
              type="text"
              placeholder="Search friends..."
              className="w-full bg-[#0D0F13] border border-[#262626] rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder:text-[#5c6270] focus:outline-none focus:border-blue-500/40 transition-colors"
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>

          <div className="space-y-4">
            {isLoading && <p className="text-center text-[#C2C6D6]">Loading</p>}
            {isError && (
              <p className="text-center text-[#C2C6D6]">
                Faild to get suggested friends try again later.
              </p>
            )}
            {displayedFriends?.length > 0 &&
              displayedFriends.map((user) => (
                <div
                  key={user._id}
                  className="p-4 border rounded-xl border-[#262626] last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#1F232B] border border-[#262626] flex items-center justify-center shrink-0">
                        <img
                          src={user.photo}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <Link to={`/profile/${user._id}`} className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate hover:underline">
                          {user.name}
                        </p>
                        <p className="text-[#6b7280] text-xs truncate">
                          @{user.username}
                        </p>
                      </Link>
                    </div>
                    <button
                      onClick={() => handleFollow(user._id)}
                      disabled={followLoading && followingId === user._id}
                      className={`flex items-center gap-1 shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${user.isFollowing ? 'bg-green-500/15 hover:bg-green-500/25 text-green-400' : 'bg-blue-500/15 hover:bg-blue-500/25 text-blue-400'} disabled:opacity-50`}
                    >
                      <i className={`fa-solid text-[10px] ${user.isFollowing ? 'fa-user-check' : 'fa-user-plus'}`}></i>
                      {followLoading && followingId === user._id
                        ? "..."
                        : user.isFollowing
                        ? "Following"
                        : "Follow"}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-[#6b7280]">
                    <p className="rounded-full bg-[#262626] px-2 py-0.5">
                      {user.followersCount} followers
                    </p>
                  </div>
                </div>
              ))}

            <Link
              to="/suggestion"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#262626] bg-[#171B21]  px-3 py-3 text-sm font-bold text-white hover:bg-[#1F2430] hover:border-[#333333] transition-colors"
            >
              View More
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}