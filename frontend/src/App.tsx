import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { MantineProvider } from '@mantine/core'
import AuthPage from './pages/AuthPage/AuthPage'

function App() {

  return (
   <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage/>} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
