import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaUser, FaPhoneAlt, FaMoneyBillWave, FaSave } from "react-icons/fa"
import DashboardLayout from "../components/DashboardLayout"
import { toast } from "sonner"
import { registrarJoven } from "../services/api"

export default function RegistrarJoven() {
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [monto, setMonto] = useState("")
  const [guardando, setGuardando] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !telefono || !monto) {
      toast.warning("⚠️ Todos los campos son requeridos")
      return
    }

    const montoNum = parseInt(monto)
    if (isNaN(montoNum) || montoNum <= 0) {
      toast.error("❌ El monto debe ser un número válido")
      return
    }

    setGuardando(true)

    try {
      const exito = await registrarJoven({
        nombre,
        correo: "",
        telefono,
        montoAsignado: montoNum,
      })

      if (exito) {
        toast.success("✅ Joven registrado correctamente")
        navigate("/listado")
      } else {
        toast.error("❌ Error al registrar joven")
      }
    } catch {
      toast.error("⚠️ No se pudo conectar con el servidor")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">Registrar Joven</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md">
          <div>
            <label className="text-sm font-medium block mb-1">Nombre</label>
            <div className="flex items-center border rounded-md px-3">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full py-2 outline-none"
                placeholder="Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Teléfono</label>
            <div className="flex items-center border rounded-md px-3">
              <FaPhoneAlt className="text-gray-400 mr-2" />
              <input
                type="tel"
                className="w-full py-2 outline-none"
                placeholder="3312345678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Monto asignado</label>
            <div className="flex items-center border rounded-md px-3">
              <FaMoneyBillWave className="text-gray-400 mr-2" />
              <input
                type="number"
                className="w-full py-2 outline-none"
                placeholder="1000"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={guardando}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg flex justify-center items-center gap-2 hover:bg-indigo-700 transition"
          >
            <FaSave />
            {guardando ? "Guardando..." : "Registrar"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
