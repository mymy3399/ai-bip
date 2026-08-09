import { BrowserRouter, Routes } from 'react-router-dom'
import { appRoutes } from './routeConfig'

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {appRoutes()}
      </Routes>
    </BrowserRouter>
  )
}
