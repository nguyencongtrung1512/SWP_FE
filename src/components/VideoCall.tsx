import React, { useEffect, useRef, useState } from 'react'
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng'
import { getAgoraToken } from '../apis/healthConsultationBooking.api'
import { useParams } from 'react-router-dom'
import Loading from './Loading/Loading'

const APP_ID = '3e9d60aafb8645a69fbb30b9a42045bc'

// Minimal Video Player for each user
const VideoPlayer: React.FC<{ user: any }> = ({ user }) => {
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
    <div style={{ margin: 8 }}>
      <div>Uid: {user.uid}</div>
      <div ref={ref} style={{ width: 240, height: 180, background: '#222', borderRadius: 8 }} />
    </div>
  )
}

const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

const VideoCall: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>()
  const [users, setUsers] = useState<any[]>([])
  const [localTracks, setLocalTracks] = useState<(IMicrophoneAudioTrack | ICameraVideoTrack)[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [channel, setChannel] = useState<string>('')
  const [uid, setUid] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      } catch (e) {
        setToken(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchToken()
  }, [appointmentId])

  useEffect(() => {
    if (!token || !channel) return
    let mounted = true
    const joinedUsers: any[] = []
    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType)
      if (mediaType === 'video') {
        setUsers(prev => {
          if (prev.find(u => u.uid === user.uid)) return prev
          return [...prev, user]
        })
      }
    }
    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      setUsers(prev => prev.filter(u => u.uid !== user.uid))
    }
    client.on('user-published', handleUserPublished)
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
      for (let localTrack of localTracks) {
        localTrack.stop()
        localTrack.close()
      }
      client.removeAllListeners()
      client.unpublish(localTracks).then(() => client.leave())
    }
    // eslint-disable-next-line
  }, [token, channel])

  if (isLoading) return <Loading />
  if (!token) return <div className="text-center text-red-500 mt-10">Không thể lấy token cho cuộc gọi video.</div>

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#18181b' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 260px)', gap: 16 }}>
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
    </div>
  )
}

export default VideoCall