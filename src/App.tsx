import { ToastContainer } from 'react-toastify'
import useRouteElements from './useRouteElement'
import { AuthProvider } from './contexts/auth.context'
import 'react-toastify/dist/ReactToastify.css'
import ChatBot from './components/ChatBot/Chatbot.tsx'

function App() {
  const routeElement = useRouteElements()

  return (
    <AuthProvider>
      {routeElement}
      <ToastContainer />
      <ChatBot />
    </AuthProvider>
  )
}

export default App
