import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Menu from './pages/Menu'
import Registrar from './pages/RegistrarJoven'
import Abono from './pages/Abono'
import Listado from './pages/Listado'
import Resumen from './pages/Resumen'


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/registro" element={<Registrar />} />
        <Route path="/abono/:id" element={<Abono />} />
        <Route path="/listado" element={<Listado />} />
        <Route path="/resumen" element={<Resumen />} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
