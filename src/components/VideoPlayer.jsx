import { useEffect, useRef, useState, useCallback } from 'react'
import Hls from 'hls.js'

const QUALITIES = [
  { label: '1080p', value: -2 },
  { label: '720p',  value: -3 },
  { label: '540p',  value: -4 },
  { label: '360p',  value: -5 },
  { label: 'Auto',  value: -1 },
]

export default function VideoPlayer({ channel }) {
  const videoRef   = useRef(null)
  const hlsRef     = useRef(null)
  const hideTimer  = useRef(null)
  const wrapperRef = useRef(null)

  const [playing,     setPlaying]     = useState(false)
  const [muted,       setMuted]       = useState(false)
  const [volume,      setVolume]      = useState(0.8)
  const [isLive,      setIsLive]      = useState(true)
  const [atLiveEdge,  setAtLiveEdge]  = useState(true)
  const [levels,      setLevels]      = useState([])
  const [currentLevel,setCurrentLevel]= useState(-1)
  const [showQuality, setShowQuality] = useState(false)
  const [showControls,setShowControls]= useState(true)
  const [fullscreen,  setFullscreen]  = useState(false)

  // --- HLS setup ---
  useEffect(() => {
    const video = videoRef.current
    if (!video || !channel) return

    hlsRef.current?.destroy()
    setPlaying(false)
    setAtLiveEdge(true)
    setLevels([])
    setCurrentLevel(-1)
    setShowQuality(false)

    if (channel.type === 'hls' && Hls.isSupported()) {
      const hls = new Hls({ capLevelToPlayerSize: true, liveSyncDurationCount: 3 })
      hlsRef.current = hls
      hls.loadSource(channel.url)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setIsLive(hls.levels?.length > 0)
        // build quality list from real levels
        const lvls = hls.levels.map((l, i) => ({
          label: l.height ? `${l.height}p` : `Nivel ${i}`,
          index: i,
        }))
        setLevels(lvls)
        video.play().catch(() => {})
      })

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setCurrentLevel(data.level)
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad()
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError()
          else hls.destroy()
        }
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = channel.url
      video.play().catch(() => {})
    }

    const onPlay  = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onTime  = () => {
      const hls = hlsRef.current
      if (!hls) return
      const liveSyncPos = hls.liveSyncPosition
      if (liveSyncPos && video.currentTime < liveSyncPos - 5) {
        setAtLiveEdge(false)
      } else {
        setAtLiveEdge(true)
      }
    }

    video.addEventListener('play',       onPlay)
    video.addEventListener('pause',      onPause)
    video.addEventListener('timeupdate', onTime)

    return () => {
      video.removeEventListener('play',       onPlay)
      video.removeEventListener('pause',      onPause)
      video.removeEventListener('timeupdate', onTime)
      hlsRef.current?.destroy()
      hlsRef.current = null
    }
  }, [channel])

  // --- Controls auto-hide ---
  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowControls(false), 3000)
  }, [])

  useEffect(() => {
    resetHideTimer()
    return () => clearTimeout(hideTimer.current)
  }, [resetHideTimer])

  // --- Actions ---
  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    v.paused ? v.play() : v.pause()
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const changeVolume = (val) => {
    const v = videoRef.current
    if (!v) return
    v.volume = val
    setVolume(val)
    v.muted = val === 0
    setMuted(val === 0)
  }

  const goToLive = () => {
    const hls = hlsRef.current
    const v   = videoRef.current
    if (!v) return
    if (hls?.liveSyncPosition) {
      v.currentTime = hls.liveSyncPosition
    }
    v.play()
    setAtLiveEdge(true)
  }

  const setQuality = (index) => {
    const hls = hlsRef.current
    if (!hls) return
    hls.currentLevel = index   // -1 = auto
    hls.loadLevel   = index
    setCurrentLevel(index)
    setShowQuality(false)
  }

  const toggleFullscreen = () => {
    const el = wrapperRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  const currentQualityLabel = () => {
    const hls = hlsRef.current
    if (!hls || currentLevel < 0) return 'Auto'
    const l = hls.levels?.[currentLevel]
    return l?.height ? `${l.height}p` : 'Auto'
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full bg-black select-none"
      onMouseMove={resetHideTimer}
      onMouseLeave={() => {
        clearTimeout(hideTimer.current)
        setShowControls(false)
      }}
      onClick={() => { togglePlay(); resetHideTimer() }}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
      />

      {/* GRADIENT overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${showControls ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* CONTROLS */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-4 pb-3 pt-6 flex flex-col gap-2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Bottom bar */}
        <div className="flex items-center gap-3">

          {/* Play/Pause */}
          <button onClick={togglePlay} className="text-white hover:text-red-400 transition p-1" title={playing ? 'Pausar' : 'Reproducir'}>
            {playing
              ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            }
          </button>

          {/* Volume */}
          <button onClick={toggleMute} className="text-white hover:text-red-400 transition p-1" title="Silenciar">
            {muted || volume === 0
              ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 19L19 20.27 20.27 19 5.27 4 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
              : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            }
          </button>
          <input
            type="range" min="0" max="1" step="0.05"
            value={muted ? 0 : volume}
            onChange={e => changeVolume(parseFloat(e.target.value))}
            className="w-20 accent-red-500 cursor-pointer"
          />

          {/* Live badge / Go to live */}
          {isLive && (
            atLiveEdge
              ? <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                  EN VIVO
                </span>
              : <button
                  onClick={goToLive}
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-gray-700 hover:bg-red-600 px-2 py-0.5 rounded transition"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 12l-5-5v3H5v4h7v3z"/><path d="M19 3H5a2 2 0 00-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg>
                  IR AL DIRECTO
                </button>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Quality selector */}
          <div className="relative">
            <button
              onClick={() => setShowQuality(q => !q)}
              className="text-white hover:text-red-400 transition text-xs font-bold px-2 py-1 rounded bg-white/10 hover:bg-white/20"
              title="Calidad"
            >
              {currentQualityLabel()} {levels.length > 0 && '▲'}
            </button>

            {showQuality && (
              <div className="absolute bottom-9 right-0 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[110px] z-50">
                {/* Auto */}
                <button
                  onClick={() => setQuality(-1)}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition flex items-center justify-between
                    ${currentLevel === -1 ? 'text-red-400 font-bold' : 'text-white'}`}
                >
                  Auto
                  {currentLevel === -1 && <span className="text-red-400">✓</span>}
                </button>
                {[...levels].reverse().map((l) => (
                  <button
                    key={l.index}
                    onClick={() => setQuality(l.index)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition flex items-center justify-between
                      ${currentLevel === l.index ? 'text-red-400 font-bold' : 'text-white'}`}
                  >
                    {l.label}
                    {currentLevel === l.index && <span className="text-red-400">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className="text-white hover:text-red-400 transition p-1" title="Pantalla completa">
            {fullscreen
              ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
              : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
            }
          </button>

        </div>
      </div>

      {/* Center play icon (big) on pause */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 rounded-full p-5">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      )}
    </div>
  )
}
