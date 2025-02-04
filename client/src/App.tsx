import './App.css'
import { ToastContainer, Bounce } from 'react-toastify'
import ImageUpload from './components/ImageUpload';

function App() {
  return (
    <>
      <ImageUpload />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  )
}

export default App