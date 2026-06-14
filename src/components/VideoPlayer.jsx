import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

export default function VideoPlayer({ channel }) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    // Evitar doble mount de StrictMode
    if (mountedRef.current) return
    mountedRef.current = true

    const video = videoRef.current
    if (!video || !channel) return

    const setupHls = () => {
      if (Hls.isSupported()) {
        const hls = new Hls({ capLevelToPlayerSize: true })
        hlsRef.current = hls
        hls.loadSource(channel.url)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {})
        })
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad()
            else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError()
            else hls.destroy()
          }
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari nativo
        video.src = channel.url
        video.play().catch(() => {})
      }
    }

    if (channel.type === 'hls') {
      setupHls()
    } else {
      video.src = channel.url
      video.play().catch(() => {})
    }

    return () => {
      hlsRef.current?.destroy()
      hlsRef.current = null
    }
  }, [channel])

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
        style={{ maxHeight: '100%', display: 'block' }}
      />
    </div>
  )
}
