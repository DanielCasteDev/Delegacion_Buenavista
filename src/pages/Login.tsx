import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"
import { verificarConexion } from "../services/api"

const API_LOGIN_URL = "https://back-wero.onrender.com/api/login"
const BASE_URL = "https://back-wero.onrender.com"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const iniciar = async () => {
      const activa = await verificarConexion()
      if (!activa) {
        await fetch(BASE_URL) // intenta "despertarla"
        await new Promise((res) => setTimeout(res, 4000)) // espera unos segundos
      }
      setCargando(false)
    }
    iniciar()
  }, [])

  const handleLogin = async () => {
    if (!email || !password) {
      toast.warning("Completa todos los campos")
      return
    }

    // 🔐 VALIDACIÓN PROVISIONAL
    if (email === "admin" && password === "admin") {
      toast.success("¡Bienvenido, administrador!")
      navigate("/menu")
      return
    }

    try {
      const res = await axios.post(API_LOGIN_URL, { email, password })
      if (res.data.success) {
        toast.success("Inicio de sesión exitoso")
        navigate("/menu")
      } else {
        toast.error("Credenciales inválidas")
      }
    } catch {
      toast.error("Error al conectar con el servidor")
    }
  }

  if (cargando) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F3F4F6]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-700 font-medium">Conectando con el servidor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#F3F4F6] px-4">
      <div className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Iniciar Sesión
        </h2>

        <div className="relative mb-4">
          <FiMail className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative mb-4">
          <FiLock className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-[#6C63FF] text-white py-3 rounded-xl font-medium hover:bg-[#574fd6] transition"
        >
          Entrar
        </button>
      </div>
    </div>
  )
}
