import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../Context/AuthContext";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function AllSuggestedFriends() {
  const { userToken } = useContext(authContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [followed, setFollowed] = useState({});

  const toggleFollow = (id) => {
    setFollowed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  async function getAllSuggestedFriends({ pageParam = 1 }) {
    const { data } = await axios.get(
      `https://route-posts.routemisr.com/users/suggestions?limit=20&page=${pageParam}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return data.data;
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["getAllSuggestedFriends"],
    queryFn: getAllSuggestedFriends,
    enabled: !!userToken,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.suggestions.length > 0 ? allPages.length + 1 : undefined;
    },
  });

  const allSuggestion = data?.pages.flatMap((page) => page.suggestions) ?? [];

  const filteredFriends = allSuggestion.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0D0F13] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer inline-flex items-center gap-2 bg-[#171B21] border border-[#262626] text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-[#1F232B] transition"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to feed
        </button>

        <div className="bg-[#171B21] border border-[#262626] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-users text-blue-500"></i>
              <h2 className="text-white font-bold text-lg">All Suggested Friends</h2>
            </div>
            <span className="bg-[#1F232B] border border-[#262626] text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full">
              {filteredFriends.length}
            </span>
          </div>

          <div className="relative mb-5">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or username..."
              className="w-full bg-[#0D0F13] border border-[#262626] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-600 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredFriends.map((friend) => {
              const isFollowed = followed[friend._id];
              return (
                <div
                  key={friend._id}
                  className="bg-[#0D0F13] border border-[#262626] rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-[#262626] bg-[#1F232B] shrink-0">
                        <img
                          src={friend.photo}
                          alt={friend.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{friend.name}</p>
                        <p className="text-slate-500 text-xs">@{friend.username}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFollow(friend._id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition shrink-0 ${
                        isFollowed
                          ? "bg-transparent border-[#262626] text-slate-400 hover:bg-[#1F232B]"
                          : "bg-blue-600/10 border-blue-600/30 text-blue-500 hover:bg-blue-600/20"
                      }`}
                    >
                      <i className={`fa-solid ${isFollowed ? "fa-user-check" : "fa-user-plus"}`}></i>
                      {isFollowed ? "Following" : "Follow"}
                    </button>
                  </div>

                  <span className="inline-block bg-[#1F232B] border border-[#262626] text-slate-400 text-xs px-2.5 py-1 rounded-full">
                    {friend.followers} followers
                  </span>
                </div>
              );
            })}
          </div>

          {filteredFriends.length === 0 && (
            <p className="text-center text-slate-500 text-sm py-10">
              No results found.
            </p>
          )}

          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="cursor-pointer text-md mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 font-bold bg-[#1F232B] border border-[#262626] text-slate-400 transition hover:bg-[#1F2430] hover:border-[#333333] disabled:opacity-60"
            >
              {isFetchingNextPage ? "Loading..." : "View more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}