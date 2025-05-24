import { ToastContainer } from 'react-toastify'
import useRouteElements from './useRouteElement'

function App() {
  const routeElement = useRouteElements()

  return (
    <>
      {routeElement}
      <ToastContainer />
    </>
  )
}

export default App
