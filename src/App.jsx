import { useState } from 'react'
import channels from './channels'
import VideoPlayer from './components/VideoPlayer'
import ChannelCard from './components/ChannelCard'

export default function App() {
  const [active, setActive] = useState(channels[0])
  const [search, setSearch] = useState('')

  const filtered = channels.filter(ch =>
    ch.name.toLowerCase().includes(search.toLowerCase()) ||
    ch.country.toLowerCase().includes(search.toLowerCase()) ||
    ch.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">

      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-3 bg-[#111] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">📡</span>
          <h1 className="text-base font-bold tracking-wider uppercase text-white">TV Local</h1>
        </div>
        <span className="ml-1 text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded">LIVE</span>
        <div className="ml-auto text-xs text-gray-500">
          {channels.length} canal{channels.length !== 1 ? 'es' : ''}
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar canales */}
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
            {filtered.length === 0 ? (
              <p className="text-gray-500 text-sm text-center mt-8">Sin resultados</p>
            ) : (
              filtered.map(ch => (
                <ChannelCard
                  key={ch.id}
                  channel={ch}
                  isActive={active?.id === ch.id}
                  onClick={() => setActive(ch)}
                />
              ))
            )}
          </div>
        </aside>

        {/* Player principal */}
        <main className="flex-1 flex flex-col bg-black overflow-hidden">
          {active ? (
            <>
              <div className="flex-1 bg-black overflow-hidden" style={{ minHeight: 0 }}>
                <VideoPlayer key={active.id} channel={active} />
              </div>
              <div className="shrink-0 px-5 py-3 bg-[#111] border-t border-white/10 flex items-center gap-3">
                <span className="text-xl">{active.logo}</span>
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
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600">
              <p>Selecciona un canal</p>
            </div>
          )}
        </main>

      </div>
    </div>
  )
}
