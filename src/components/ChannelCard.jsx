export default function ChannelCard({ channel, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-150 cursor-pointer
        ${isActive
          ? 'bg-red-600/20 border border-red-500/60 shadow-lg shadow-red-900/20'
          : 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15'
        }`}
    >
      <span className="text-2xl shrink-0">{channel.logo}</span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm text-white truncate">{channel.name}</p>
        <p className="text-xs text-gray-400 truncate">{channel.country} · {channel.category}</p>
      </div>
      {channel.live && (
        <span className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-red-400">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
          EN VIVO
        </span>
      )}
    </button>
  )
}
