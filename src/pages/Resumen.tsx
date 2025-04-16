import { useEffect, useState } from "react"
import { FaUsers, FaMoneyBillAlt, FaWallet } from "react-icons/fa"
import DashboardLayout from "../components/DashboardLayout"
import { obtenerJovenes } from "../services/api"

export default function Resumen() {
  const [cargando, setCargando] = useState(true)
  const [totalJovenes, setTotalJovenes] = useState(0)
  const [totalAsignado, setTotalAsignado] = useState(0)
  const [totalAbonado, setTotalAbonado] = useState(0)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const lista = await obtenerJovenes()
        let asignado = 0
        let abonado = 0

        for (const joven of lista) {
          asignado += joven.montoAsignado
          abonado += joven.abonos.reduce(
            (sum: number, a: { cantidad: number }) => sum + a.cantidad,
            0
          )
        }

        setTotalJovenes(lista.length)
        setTotalAsignado(asignado)
        setTotalAbonado(abonado)
      } catch {
        alert("❌ Error al obtener los datos del resumen.")
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  const progreso =
    totalAsignado === 0 ? 0 : totalAbonado / totalAsignado

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">Resumen General</h1>

        {cargando ? (
          <div className="text-center py-20 text-gray-500">
            Cargando información...
          </div>
        ) : (
          <div className="space-y-8">
            {/* Tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ResumenCard
                icon={<FaUsers size={20} />}
                label="Total de jóvenes"
                value={totalJovenes.toString()}
                color="indigo"
              />
              <ResumenCard
                icon={<FaMoneyBillAlt size={20} />}
                label="Total abonado"
                value={`$${totalAbonado}`}
                color="green"
              />
              <ResumenCard
                icon={<FaWallet size={20} />}
                label="Monto asignado"
                value={`$${totalAsignado}`}
                color="orange"
              />
            </div>

            {/* Progreso */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Progreso general
              </h2>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    progreso >= 1 ? "bg-green-600" : "bg-indigo-500"
                  }`}
                  style={{ width: `${(progreso * 100).toFixed(1)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {(progreso * 100).toFixed(1)}% completado
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function ResumenCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: "indigo" | "green" | "orange"
}) {
  const bg = {
    indigo: "bg-indigo-100 text-indigo-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
  }[color]

  const border = {
    indigo: "border-indigo-200",
    green: "border-green-200",
    orange: "border-orange-200",
  }[color]

  return (
    <div className={`bg-white p-5 rounded-xl shadow-md border ${border} flex items-center gap-4`}>
      <div className={`p-3 rounded-full ${bg}`}>{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-lg font-semibold text-gray-800">{value}</span>
      </div>
    </div>
  )
}
