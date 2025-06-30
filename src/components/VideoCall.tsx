import React, { useEffect, useRef, useState } from 'react'
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack, IRemoteVideoTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng'
import { getAgoraToken } from '../apis/healthConsultationBooking.api'
import { useParams } from 'react-router-dom'
import Loading from './Loading/Loading'

const APP_ID = '3e9d60aafb8645a69fbb30b9a42045bc'

type VideoUser = {
  uid: string | number
  videoTrack?: ICameraVideoTrack | IRemoteVideoTrack
  audioTrack?: IMicrophoneAudioTrack | IRemoteAudioTrack
}

const VideoPlayer: React.FC<{ user: VideoUser; style?: React.CSSProperties }> = ({ user, style }) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (user.videoTrack && ref.current) {
      user.videoTrack.play(ref.current)
    }
    return () => {
      if (user.videoTrack) user.videoTrack.stop()
    }
  }, [user.videoTrack])
  return (
    <div style={{ ...style, background: '#222', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
      <div ref={ref} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

const VideoCall: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>()
  const [users, setUsers] = useState<VideoUser[]>([])
  const [localTracks, setLocalTracks] = useState<(IMicrophoneAudioTrack | ICameraVideoTrack)[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [channel, setChannel] = useState<string>('')
  const [uid, setUid] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [joined, setJoined] = useState(false)
  const [camPreview, setCamPreview] = useState(true)

  // Fetch token from backend
  useEffect(() => {
    const fetchToken = async () => {
      if (!appointmentId) return
      setIsLoading(true)
      try {
        const response = await getAgoraToken(Number(appointmentId))
        const tokenData = response.data
        setToken(tokenData.token)
        setChannel(tokenData.channelName)
        setUid(tokenData.uid)
      } catch {
        setToken(null)
      } finally {
      setIsLoading(false)
      }
    }
    fetchToken()
  }, [appointmentId])

  // Join logic is now triggered by button
  useEffect(() => {
    if (!token || !channel || !joined) return
    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType)
      if (mediaType === 'video') {
        setUsers(prev => {
          const existing = prev.find(u => u.uid === user.uid)
          if (existing) {
            // Update videoTrack/audioTrack if user already exists
            return prev.map(u => u.uid === user.uid ? { ...u, videoTrack: user.videoTrack, audioTrack: user.audioTrack } : u)
          }
          return [...prev, { uid: user.uid, videoTrack: user.videoTrack, audioTrack: user.audioTrack }]
        })
      }
    }
    const handleUserUnpublished = (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      if (mediaType === 'video') {
        setUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, videoTrack: undefined } : u))
      }
    }
    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      setUsers(prev => prev.filter(u => u.uid !== user.uid))
    }
    client.on('user-published', handleUserPublished)
    client.on('user-unpublished', handleUserUnpublished)
    client.on('user-left', handleUserLeft)
    client
      .join(APP_ID, channel, token, uid || null)
      .then((joinedUid) =>
        Promise.all([
          AgoraRTC.createMicrophoneAndCameraTracks(),
          joinedUid,
        ])
      )
      .then(([tracks, joinedUid]) => {
        const [audioTrack, videoTrack] = tracks
        setLocalTracks(tracks)
        setUsers(prev => [
          ...prev.filter(u => u.uid !== joinedUid),
          { uid: joinedUid, videoTrack, audioTrack },
        ])
        client.publish([audioTrack, videoTrack])
      })
    return () => {
      for (const localTrack of localTracks) {
        localTrack.stop()
        localTrack.close()
      }
      client.removeAllListeners()
      // Remove specific event listeners for safety
      client.off('user-published', handleUserPublished)
      client.off('user-unpublished', handleUserUnpublished)
      client.off('user-left', handleUserLeft)
      client.unpublish(localTracks).then(() => client.leave())
    }
    // eslint-disable-next-line
  }, [token, channel, joined])

  // Hide/show local preview handler
  const handleToggleCamPreview = async () => {
    const videoTrack = localTracks.find(track => track && 'setEnabled' in track && track.getTrackLabel && track.getTrackLabel().toLowerCase().includes('camera')) as ICameraVideoTrack | undefined
    if (!videoTrack) {
      setCamPreview((prev) => !prev)
      return
    }
    if (camPreview) {
      // Hide: unpublish and disable
      await client.unpublish([videoTrack])
      videoTrack.setEnabled(false)
      setCamPreview(false)
    } else {
      // Show: enable and publish
      videoTrack.setEnabled(true)
      await client.publish([videoTrack])
      setCamPreview(true)
    }
  }

  // End call handler
  const handleEndCall = () => {
    for (const localTrack of localTracks) {
      localTrack.stop()
      localTrack.close()
    }
    client.removeAllListeners()
    client.unpublish(localTracks).then(() => client.leave())
    setUsers([])
    setJoined(false)
    setCamPreview(true)
  }

  if (isLoading) return <Loading />
  if (!token) return <div className="text-center text-red-500 mt-10">Không thể lấy token cho cuộc gọi video.</div>

  // Find local and remote users
  const localUser = users.find(u => u.uid === uid)
  const remoteUser = users.find(u => u.uid !== uid)

  return (
    <div style={{ minHeight: '100vh', background: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {!joined ? (
        <button
          onClick={() => setJoined(true)}
          style={{
            padding: '16px 32px',
            fontSize: 20,
            borderRadius: 8,
            background: '#2563eb',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          Tham gia cuộc gọi
        </button>
      ) : (
        <div style={{ position: 'relative', width: 1100, height: 700, background: '#111', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.25)' }}>
          {/* Remote user big cam */}
          <div style={{ width: '100%', height: '100%', borderRadius: 20, overflow: 'hidden', background: '#222' }}>
            {remoteUser ? (
              remoteUser.videoTrack ? (
                <VideoPlayer user={remoteUser} style={{ width: '100%', height: '100%' }} />
              ) : (
                <div style={{ color: '#aaa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  {/* Camera-off SVG icon */}
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 1l22 22" />
                    <path d="M17 17H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z" />
                    <path d="M23 7l-5 5" />
                  </svg>
                  <span style={{ marginTop: 16 }}>Người dùng đã tắt camera</span>
                </div>
              )
            ) : (
              <div style={{ color: '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                Đang chờ người tham gia khác...
              </div>
            )}
          </div>
          {/* Local user small cam */}
          {localUser && camPreview && (
            <div style={{ position: 'absolute', left: 36, bottom: 36, width: 300, height: 220, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', borderRadius: 12, border: '2px solid #fff' }}>
              <VideoPlayer user={localUser} style={{ width: '100%', height: '100%' }} />
            </div>
          )}
          {/* End Call & Hide Cam Buttons */}
          <div style={{ position: 'absolute', left: '50%', bottom: 36, transform: 'translateX(-50%)', display: 'flex', gap: 24, zIndex: 10 }}>
            <button
              onClick={handleToggleCamPreview}
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#374151',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                cursor: 'pointer',
              }}
              title={camPreview ? 'Ẩn xem trước camera của bạn' : 'Hiện xem trước camera của bạn'}
            >
              {camPreview ? (
                // Eye-off SVG
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7 1.21-2.61 3.16-4.77 5.66-6.11M1 1l22 22" /><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c1.38 0 2.63-.83 3.16-2.03" /><path d="M14.47 14.47A3.5 3.5 0 0 1 12 8.5c-.62 0-1.2.18-1.69.49" /></svg>
              ) : (
                // Eye SVG
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="10" ry="7" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
            <button
              onClick={handleEndCall}
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#ef4444',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                cursor: 'pointer',
              }}
              title="Kết thúc cuộc gọi"
            >
              {/* Simple phone SVG icon */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0 1 22 16.92z"></path></svg>
            </button>
            </div>
          </div>
        )}
    </div>
  )
}

export default VideoCall 