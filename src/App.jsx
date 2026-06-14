import { useState } from 'react'
import channels from './channels'
import VideoPlayer from './components/VideoPlayer'
import ChannelCard from './components/ChannelCard'

export default function App() {
  const [active, setActive] = useState(channels[0])
  const [search, setSearch] = useState('')
  const [mobileTab, setMobileTab] = useState('player') // 'player' | 'channels'

  const filtered = channels.filter(ch =>
    ch.name.toLowerCase().includes(search.toLowerCase()) ||
    ch.country.toLowerCase().includes(search.toLowerCase()) ||
    ch.category.toLowerCase().includes(search.toLowerCase())
  )

  const selectChannel = (ch) => {
    setActive(ch)
    setMobileTab('player')
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0a0a0a] overflow-hidden">

      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-2.5 bg-[#111] border-b border-white/10 shrink-0">
        <span className="text-lg">📡</span>
        <h1 className="text-sm font-bold tracking-wider uppercase text-white">TV Local</h1>
        <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded">LIVE</span>
        <div className="ml-auto text-xs text-gray-500">{channels.length} canales</div>
      </header>

      {/* ── DESKTOP layout (md+) ── */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 shrink-0 flex flex-col bg-[#111] border-r border-white/10 overflow-hidden">
          <div className="p-3 border-b border-white/10">
            <input
              type="search"
              placeholder="Buscar canal..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500/60 transition"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {filtered.map(ch => (
              <ChannelCard key={ch.id} channel={ch} isActive={active?.id === ch.id} onClick={() => selectChannel(ch)} />
            ))}
          </div>
        </aside>

        {/* Player */}
        <main className="flex-1 flex flex-col bg-black overflow-hidden">
          {active && (
            <>
              <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                <VideoPlayer key={active.id} channel={active} />
              </div>
              <div className="shrink-0 px-4 py-2.5 bg-[#111] border-t border-white/10 flex items-center gap-3">
                <span className="text-lg">{active.logo}</span>
                <div>
                  <p className="font-semibold text-sm text-white">{active.name}</p>
                  <p className="text-xs text-gray-400">{active.country} · {active.category}</p>
                </div>
                {active.live && (
                  <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                    EN DIRECTO
                  </span>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* ── MOBILE layout ── */}
      <div className="flex md:hidden flex-1 flex-col overflow-hidden">

        {mobileTab === 'player' ? (
          /* Player view */
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Video */}
            <div className="w-full bg-black" style={{ aspectRatio: '16/9' }}>
              {active && <VideoPlayer key={active.id} channel={active} />}
            </div>

            {/* Info del canal activo */}
            {active && (
              <div className="px-4 py-3 bg-[#111] border-b border-white/10 flex items-center gap-3">
                <span className="text-xl">{active.logo}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white truncate">{active.name}</p>
                  <p className="text-xs text-gray-400">{active.country} · {active.category}</p>
                </div>
                {active.live && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                    EN VIVO
                  </span>
                )}
              </div>
            )}

            {/* Lista compacta de canales debajo del player */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {channels.map(ch => (
                <ChannelCard key={ch.id} channel={ch} isActive={active?.id === ch.id} onClick={() => selectChannel(ch)} />
              ))}
            </div>
          </div>

        ) : (
          /* Channels view con búsqueda */
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="p-3 border-b border-white/10">
              <input
                type="search"
                placeholder="Buscar canal..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500/60 transition"
                autoFocus
              />
            </div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {filtered.map(ch => (
                <ChannelCard key={ch.id} channel={ch} isActive={active?.id === ch.id} onClick={() => selectChannel(ch)} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom tab bar */}
        <nav className="shrink-0 flex bg-[#111] border-t border-white/10">
          <button
            onClick={() => setMobileTab('player')}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition
              ${mobileTab === 'player' ? 'text-red-400' : 'text-gray-500'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/>
            </svg>
            Ver
          </button>
          <button
            onClick={() => setMobileTab('channels')}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition
              ${mobileTab === 'channels' ? 'text-red-400' : 'text-gray-500'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
            </svg>
            Canales
          </button>
        </nav>
      </div>

    </div>
  )
}
