import { BrowserRouter, Routes } from 'react-router-dom'
import { appRoutes } from './routeConfig'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {appRoutes()}
      </Routes>
    </BrowserRouter>
  )
}
