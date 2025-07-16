import { ToastContainer } from 'react-toastify'
import useRouteElements from './useRouteElement'
import { AuthProvider } from './contexts/auth.context'
import 'react-toastify/dist/ReactToastify.css'
import ChatBot from './components/ChatBot/Chatbot.tsx'
import { useLocation } from 'react-router-dom'

function App() {
  const routeElement = useRouteElements()
  const location = useLocation()

  const showChatBot =
    location.pathname.startsWith('/parent') ||
    location.pathname === '/' ||
    location.pathname.startsWith('/blog')

  return (
    <AuthProvider>
      {routeElement}
      <ToastContainer />
      {showChatBot && <ChatBot />}
    </AuthProvider>
  )
}

export default App
