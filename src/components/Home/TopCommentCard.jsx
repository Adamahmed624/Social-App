export default function TopCommentCard({ topComment, onViewAllComments }) {
  return (
    <>
      {topComment && (
        <div className="mt-3 bg-[#0D0F13] border border-[#262626] rounded-xl p-4">
          <p className="text-[10px] tracking-wide text-[#5c6270] font-semibold uppercase mb-2">
            Top comment
          </p>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1F232B] flex items-center justify-center overflow-hidden border border-[#262626] shrink-0">
              {topComment.commentCreator?.photo ? (
                <img
                  src={topComment.commentCreator.photo}
                  alt={topComment.commentCreator.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="fa-solid fa-user text-[#5c6270] text-xs" />
              )}
            </div>
            <div className="bg-[#171B21] border border-[#262626] rounded-2xl px-3 py-2">
              <p className="text-white font-semibold text-xs">{topComment.commentCreator.name}</p>
              <p className="text-sm text-[#C2C6D6] mt-0.5">{topComment.content}</p>
            </div>
          </div>

          <button
            onClick={() => {
              console.log("clicked!");
              onViewAllComments();
            }}
            className="cursor-pointer text-blue-400 hover:text-blue-300 text-xs font-medium mt-2 transition-colors"
          >
            View all comments
          </button>
        </div>
      )}
    </>
  )
}