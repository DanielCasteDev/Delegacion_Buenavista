import axios from "axios"

const baseUrl = "https://back-wero.onrender.com"
const apiUrl = `${baseUrl}/api/jovenes`

// 📥 Obtener lista de jóvenes
export const obtenerJovenes = async () => {
  const res = await axios.get(apiUrl)
  return res.data // ya regresa la lista como array de objetos
}

// ➕ Registrar nuevo joven
export const registrarJoven = async ({
  nombre,
  correo,
  telefono,
  montoAsignado,
}: {
  nombre: string
  correo: string
  telefono: string
  montoAsignado: number
}) => {
  try {
    const res = await axios.post(apiUrl, {
      nombre,
      correo,
      telefono,
      montoAsignado,
      abonos: [],
    })
    return res.status === 200
  } catch (err) {
    return false
  }
}

// 💸 Registrar un abono
export const registrarAbono = async (idJoven: string, cantidad: number) => {
  const res = await axios.post(`${apiUrl}/${idJoven}/abono`, {
    cantidad,
  })
  if (res.status !== 200) throw new Error("Error al registrar abono")
}

// 🔌 Verificar conexión (para SplashScreen)
export const verificarConexion = async () => {
  try {
    const res = await axios.get(`${baseUrl}/ping`, { timeout: 30000 })
    return res.status === 200
  } catch (err) {
    console.error("❌ Error al conectar con la API:", err)
    return false
  }
}
