import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { MantineProvider } from '@mantine/core'
import AuthPage from './pages/AuthPage/AuthPage'
import Dashboard from './pages/Dashboard/Dashboard'

function App() {

  return (
   <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage/>} />
           <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
