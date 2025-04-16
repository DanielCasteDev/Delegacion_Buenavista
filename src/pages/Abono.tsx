import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import DashboardLayout from "../components/DashboardLayout"
import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaHistory,
  FaSpinner,
} from "react-icons/fa"
import { registrarAbono, obtenerJovenes } from "../services/api"
import { toast } from "sonner"

type Joven = {
  _id: string
  nombre: string
  telefono: string
  montoAsignado: number
  abonos: { cantidad: number; fecha: string }[]
}

export default function Abono() {
  const { id } = useParams()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [joven, setJoven] = useState<Joven | null>(null)
  const [monto, setMonto] = useState("")
  const [procesando, setProcesando] = useState(false)
  const [cargando, setCargando] = useState(true)

  const cargarJoven = async () => {
    setCargando(true)
    try {
      const data = await obtenerJovenes()
      const encontrado = data.find((j: Joven) => j._id === id)
      setJoven(encontrado ?? null)
    } catch (err) {
      toast.error("❌ Error al cargar los datos del joven.")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarJoven()
  }, [id])

  const totalAbonado = joven?.abonos?.reduce((s, a) => s + a.cantidad, 0) ?? 0
  const restante = (joven?.montoAsignado ?? 0) - totalAbonado

  const handleAbonar = async (e: React.FormEvent) => {
    e.preventDefault()
    const cantidad = Number(monto)

    if (!cantidad || cantidad <= 0) {
      toast.warning("⚠️ Ingresa un monto válido")
      return
    }

    if (cantidad > restante) {
      toast.error(`❌ El abono no puede superar $${restante}`)
      return
    }

    setProcesando(true)

    try {
      await toast.promise(registrarAbono(id!, cantidad), {
        success: "✅ Abono registrado correctamente",
        error: "❌ Error al registrar el abono",
      })

      setMonto("")
      await cargarJoven()
      setTimeout(() => inputRef.current?.focus(), 150)

      setTimeout(() => {
        navigate("/listado")
      }, 1000)
    } catch {
      // error ya manejado
    } finally {
      setProcesando(false)
    }
  }

  if (cargando || !joven) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh] text-gray-600">
          <FaSpinner className="animate-spin mr-2" />
          Cargando...
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Abono para {joven.nombre}
        </h1>

        {/* Resumen */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <p className="text-sm font-medium text-indigo-800">
            Asignado: ${joven.montoAsignado}
          </p>
          <p className="text-sm text-gray-700">
            Abonado: <strong>${totalAbonado}</strong>
          </p>
          <p className="text-sm text-gray-700">
            Restante: <strong className="text-red-600">${restante}</strong>
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleAbonar}
          className="bg-white p-6 rounded-xl shadow-md space-y-6"
        >
          <div>
            <label className="text-sm font-medium block mb-1">
              Monto del abono
            </label>
            <div className="flex items-center border rounded-md px-3">
              <FaMoneyBillWave className="text-gray-400 mr-2" />
              <input
                ref={inputRef}
                type="number"
                className="w-full py-2 outline-none"
                placeholder="500"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={procesando}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg flex justify-center items-center gap-2 hover:bg-green-700 transition"
          >
            <FaCheckCircle />
            {procesando ? "Guardando..." : "Registrar abono"}
          </button>
        </form>

        {/* Historial */}
        <div>
          <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2 mb-4">
            <FaHistory />
            Historial de abonos
          </h2>

          {joven.abonos.length === 0 ? (
            <p className="text-sm text-gray-500">Sin abonos aún.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-indigo-100 text-indigo-800 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Cantidad</th>
                    <th className="px-4 py-3 font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {joven.abonos
                    .slice()
                    .reverse()
                    .map((abono, i) => {
                      const fecha = new Date(abono.fecha)
                      const formato = fecha.toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })

                      return (
                        <tr
                          key={i}
                          className="border-t border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3 font-medium">{i + 1}</td>
                          <td className="px-4 py-3 text-green-600 font-semibold">
                            ${abono.cantidad}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{formato}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
