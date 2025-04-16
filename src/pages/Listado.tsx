import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../components/DashboardLayout"
import {
  FaSearch,
  FaPlusCircle,
  FaFilePdf,
  FaSpinner,
} from "react-icons/fa"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { obtenerJovenes } from "../services/api"

type Joven = {
  _id: string
  nombre: string
  telefono: string
  montoAsignado: number
  abonos: { cantidad: number; fecha: string }[]
}

export default function Listado() {
  const [jovenes, setJovenes] = useState<Joven[]>([])
  const [filtrados, setFiltrados] = useState<Joven[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [filtro, setFiltro] = useState("Todos")
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setCargando(true)
      try {
        const data = await obtenerJovenes()
        setJovenes(data)
        setFiltrados(data)
      } catch (error) {
        alert("❌ Error al cargar jóvenes")
      } finally {
        setCargando(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    filtrar()
  }, [busqueda, filtro, jovenes])

  const totalAbonos = (abonos: Joven["abonos"]) =>
    abonos.reduce((sum, a) => sum + a.cantidad, 0)

  const filtrar = () => {
    const resultado = jovenes.filter((j) => {
      const nombreMatch = j.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase())

      const abonado = totalAbonos(j.abonos)
      const restante = j.montoAsignado - abonado

      if (filtro === "Todos") return nombreMatch
      if (filtro === "Pendientes") return nombreMatch && restante > 0
      if (filtro === "Pagados") return nombreMatch && restante <= 0
      return true
    })

    setFiltrados(resultado)
  }

  const exportarPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Lista de Jóvenes", 14, 18)

    const tableData = filtrados.map((j) => {
      const abonado = totalAbonos(j.abonos)
      const restante = j.montoAsignado - abonado
      return [
        j.nombre,
        j.telefono,
        `$${j.montoAsignado}`,
        `$${abonado}`,
        `$${restante}`,
      ]
    })

    autoTable(doc, {
      head: [["Nombre", "Teléfono", "Asignado", "Abonado", "Restante"]],
      body: tableData,
      startY: 25,
      styles: { fontSize: 10 },
    })

    doc.save("jovenes.pdf")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">Lista de Jóvenes</h1>

        {/* Búsqueda */}
        <div className="flex items-center gap-4">
          <div className="flex items-center w-full border rounded-lg px-3 py-2 bg-white shadow-sm">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              className="w-full outline-none"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* PDF */}
          {filtrados.length > 0 && (
            <button
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              onClick={exportarPDF}
            >
              <FaFilePdf />
              PDF
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex gap-3">
          {["Todos", "Pendientes", "Pagados"].map((opcion) => (
            <button
              key={opcion}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                filtro === opcion
                  ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                  : "text-gray-600 hover:bg-gray-100 border-gray-300"
              }`}
              onClick={() => setFiltro(opcion)}
            >
              {opcion}
            </button>
          ))}
        </div>

        {/* Lista */}
        {cargando ? (
          <div className="text-center py-10 text-gray-500 flex justify-center items-center gap-2">
            <FaSpinner className="animate-spin" /> Cargando...
          </div>
        ) : filtrados.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No hay resultados.</p>
        ) : (
          <div className="grid gap-6">
            {filtrados.map((j) => {
              const abonado = totalAbonos(j.abonos)
              const restante = j.montoAsignado - abonado

              return (
                <div
                  key={j._id}
                  className="bg-white shadow-md p-5 rounded-xl flex justify-between items-center border border-gray-200"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{j.nombre}</h2>
                    <p className="text-sm text-gray-500">
                      Teléfono: {j.telefono}
                    </p>
                    <p className="text-sm text-gray-500">
                      Asignado: ${j.montoAsignado}
                    </p>
                    <p className="text-sm text-gray-500">Abonado: ${abonado}</p>
                    <p className="text-sm text-gray-500">
                      Restante:{" "}
                      <span
                        className={
                          restante > 0 ? "text-red-600" : "text-green-600"
                        }
                      >
                        ${restante}
                      </span>
                    </p>
                  </div>
                  <button
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    onClick={() => navigate(`/abono/${j._id}`)}
                  >
                    <FaPlusCircle />
                    Abonar
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
