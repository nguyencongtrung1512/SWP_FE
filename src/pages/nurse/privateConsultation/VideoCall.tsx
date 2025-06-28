import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, MessageSquare, Users } from 'lucide-react'
import { toast } from 'react-toastify'
import Loading from '../../../components/Loading/Loading'
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng'
import { chatService, ChatMessage } from '../../../services/chatService'

const VideoCall: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>()
  const navigate = useNavigate()
  
  const [client, setClient] = useState<IAgoraRTCClient | null>(null)
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null)
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null)
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([])
  const [isJoined, setIsJoined] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isChatConnected, setIsChatConnected] = useState(false)
  
  const localVideoRef = useRef<HTMLDivElement>(null)
  const remoteVideoRef = useRef<HTMLDivElement>(null)
  
  const agoraConfig = {
    appId: 'aab8b8f5a8cd4469a63042fcfafe7063', // Alternative test App ID
    channel: `consultation-${appointmentId}`,
    token: null, // Test App ID doesn't require tokens
    uid: Math.floor(Math.random() * 100000)
  }

  const messageCallbackRef = useRef<((message: ChatMessage) => void) | null>(null);

  useEffect(() => {
    let isMounted = true;

    initializeAgora()
    
    // Connect to chat service
    const connectChat = async () => {
      if (appointmentId) {
        const connected = await chatService.connect(appointmentId)
        setIsChatConnected(connected)
        
        if (connected) {
          // Load existing messages for this appointment
          const existingMessages = chatService.getMessages(appointmentId)
          setMessages(existingMessages)
          
          // Only register the callback ONCE
          if (!messageCallbackRef.current) {
            messageCallbackRef.current = (message: ChatMessage) => {
              if (isMounted && message.appointmentId === appointmentId) {
                setMessages(prev => [...prev, message])
              }
            }
            chatService.onMessage(messageCallbackRef.current)
          }
        }
      }
    }
    
    connectChat()
    
    return () => {
      isMounted = false;
      leaveChannel()
      chatService.disconnect(appointmentId || '')
      if (messageCallbackRef.current) {
        chatService.offMessage(messageCallbackRef.current)
        messageCallbackRef.current = null;
      }
    }
  }, [appointmentId])

  const initializeAgora = async () => {
    try {
      setIsLoading(true)
      const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
      setClient(agoraClient)
      
      agoraClient.on('user-published', handleUserPublished)
      agoraClient.on('user-unpublished', handleUserUnpublished)
      agoraClient.on('user-joined', handleUserJoined)
      agoraClient.on('user-left', handleUserLeft)
      
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to initialize Agora:', error)
      toast.error('Không thể khởi tạo cuộc gọi video!')
      setIsLoading(false)
    }
  }

  const joinChannel = async () => {
    if (!client) return
    
    try {
      setIsLoading(true)
      
      console.log('Attempting to join channel:', agoraConfig.channel)
      console.log('App ID:', agoraConfig.appId)
      console.log('Token:', agoraConfig.token)
      console.log('UID:', agoraConfig.uid)
      
      // Join the channel first
      await client.join(agoraConfig.appId, agoraConfig.channel, agoraConfig.token, agoraConfig.uid)
      console.log('Successfully joined channel')
      
      // Create and publish local tracks (this will request permissions)
      console.log('Creating local tracks...')
      let audioTrack, videoTrack
      
      try {
        [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks()
      } catch (trackError) {
        console.error('Failed to create tracks:', trackError)
        
        // Try to create audio-only if video fails
        try {
          audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
          videoTrack = null
          toast.warning('Không thể truy cập camera, chỉ sử dụng âm thanh')
        } catch (audioError) {
          console.error('Failed to create audio track:', audioError)
          toast.error('Không thể truy cập camera và microphone!')
          setIsLoading(false)
          return
        }
      }
      
      setLocalAudioTrack(audioTrack)
      setLocalVideoTrack(videoTrack)
      
      console.log('Publishing tracks...')
      const tracksToPublish: (IMicrophoneAudioTrack | ICameraVideoTrack)[] = []
      if (audioTrack) tracksToPublish.push(audioTrack)
      if (videoTrack) tracksToPublish.push(videoTrack)
      
      await client.publish(tracksToPublish)
      
      console.log('Tracks published successfully')
      
      if (localVideoRef.current && videoTrack) {
        console.log('Playing video track in local video ref')
        audioTrack?.play()
        videoTrack.play(localVideoRef.current)
      } else if (localVideoRef.current && !videoTrack) {
        // Show placeholder for audio-only
        console.log('Showing audio-only placeholder')
        localVideoRef.current.innerHTML = `
          <div class="w-full h-full flex items-center justify-center bg-gray-700">
            <div class="text-center">
              <Mic className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p class="text-sm text-gray-400">Chỉ âm thanh</p>
            </div>
          </div>
        `
      } else {
        console.log('Local video ref not available or no video track')
      }
      
      setIsJoined(true)
      setIsLoading(false)
      toast.success('Đã tham gia cuộc gọi!')
      
    } catch (error: any) {
      console.error('Failed to join channel:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack
      })
      
      // Check if it's a permission error
      if (error.message && error.message.includes('permission')) {
        toast.error('Cần cấp quyền camera và microphone để tham gia cuộc gọi!')
      } else if (error.message && error.message.includes('NOT_READABLE')) {
        toast.error('Không thể truy cập camera/microphone. Vui lòng kiểm tra quyền truy cập!')
      } else if (error.message && error.message.includes('CAN_NOT_GET_GATEWAY_SERVER')) {
        toast.error('Không thể kết nối đến máy chủ Agora. Vui lòng kiểm tra kết nối internet!')
      } else {
        toast.error(`Không thể tham gia cuộc gọi! Lỗi: ${error.message}`)
      }
      setIsLoading(false)
    }
  }

  const leaveChannel = async () => {
    if (!client) return
    
    try {
      if (localAudioTrack) {
        localAudioTrack.close()
        setLocalAudioTrack(null)
      }
      if (localVideoTrack) {
        localVideoTrack.close()
        setLocalVideoTrack(null)
      }
      
      await client.leave()
      setIsJoined(false)
      setRemoteUsers([])
      
      toast.info('Đã rời khỏi cuộc gọi!')
      navigate('/nurse/private-consultation')
      
    } catch (error) {
      console.error('Failed to leave channel:', error)
    }
  }

  const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
    await client?.subscribe(user, mediaType)
    
    if (mediaType === 'video') {
      setRemoteUsers(prev => [...prev, user])
      if (remoteVideoRef.current) {
        user.videoTrack?.play(remoteVideoRef.current)
      }
    }
    if (mediaType === 'audio') {
      user.audioTrack?.play()
    }
  }

  const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
    setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid))
  }

  const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
    setRemoteUsers(prev => [...prev, user])
  }

  const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
    setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid))
  }

  const toggleAudio = async () => {
    if (localAudioTrack) {
      if (isAudioEnabled) {
        await localAudioTrack.setEnabled(false)
      } else {
        await localAudioTrack.setEnabled(true)
      }
      setIsAudioEnabled(!isAudioEnabled)
    }
  }

  const toggleVideo = async () => {
    if (localVideoTrack) {
      if (isVideoEnabled) {
        await localVideoTrack.setEnabled(false)
      } else {
        await localVideoTrack.setEnabled(true)
      }
      setIsVideoEnabled(!isVideoEnabled)
    }
  }

  const sendMessage = async () => {
    if (newMessage.trim()) {
      const message: Omit<ChatMessage, 'id' | 'timestamp'> = {
        sender: 'Y tá',
        text: newMessage,
        appointmentId: appointmentId || ''
      }
      const success = await chatService.sendMessage(message)
      if (success) {
        setNewMessage('')
      } else {
        toast.error('Không thể gửi tin nhắn!')
      }
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Cuộc gọi tư vấn</h1>
          <Badge variant="secondary">ID: {appointmentId}</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">
            {remoteUsers.length > 0 ? `${remoteUsers.length} người tham gia` : 'Chờ kết nối...'}
          </span>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isChatConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-400">
              {isChatConnected ? 'Chat đã kết nối' : 'Chat đang kết nối...'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="text-gray-300 hover:text-white"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <div className={`flex-1 flex flex-col ${showChat ? 'mr-80' : ''}`}>
          <div className="flex-1 relative bg-black">
            <div 
              ref={remoteVideoRef}
              className="w-full h-full bg-gray-800 flex items-center justify-center"
            >
              {remoteUsers.length === 0 && (
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">Chờ phụ huynh tham gia cuộc gọi...</p>
                </div>
              )}
            </div>

            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
              <div 
                ref={localVideoRef}
                className="w-full h-full bg-gray-700"
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <VideoOff className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-4">
            <div className="flex justify-center items-center space-x-4">
              {!isJoined ? (
                <Button
                  onClick={joinChannel}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Tham gia cuộc gọi
                </Button>
              ) : (
                <>
                  <Button
                    onClick={toggleAudio}
                    variant={isAudioEnabled ? "default" : "destructive"}
                    size="lg"
                    className="rounded-full w-12 h-12"
                  >
                    {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    onClick={toggleVideo}
                    variant={isVideoEnabled ? "default" : "destructive"}
                    size="lg"
                    className="rounded-full w-12 h-12"
                  >
                    {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    onClick={leaveChannel}
                    variant="destructive"
                    size="lg"
                    className="rounded-full w-12 h-12"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {showChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold">Tin nhắn</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Chưa có tin nhắn nào</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-green-400">{message.sender}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  onClick={sendMessage}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Gửi
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoCall 