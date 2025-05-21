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

  const exportarPDFIndividual = (joven: Joven) => {
    const doc = new jsPDF()
    
    // Configuración de estilos
    const primaryColor: [number, number, number] = [41, 128, 185] // Azul profesional
    const secondaryColor: [number, number, number] = [52, 152, 219] // Azul más claro
    const accentColor: [number, number, number] = [231, 76, 60] // Rojo para acentos
    const successColor: [number, number, number] = [46, 204, 113] // Verde para éxito
    const grayColor: [number, number, number] = [200, 200, 200]
    const lightGrayColor: [number, number, number] = [245, 245, 245]
    const darkGrayColor: [number, number, number] = [60, 60, 60]
    
    // Logo o encabezado decorativo
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 40, 'F')
    
    // Título principal
    doc.setFontSize(28)
    doc.setTextColor(255, 255, 255)
    doc.text("RECIBO DE PAGOS", 105, 25, { align: "center" })
    
    // Subtítulo
    doc.setFontSize(12)
    doc.text("Delegación Buenavista", 105, 35, { align: "center" })
    
    // Línea decorativa
    doc.setDrawColor(...secondaryColor)
    doc.setLineWidth(0.5)
    doc.line(20, 50, 190, 50)
    
    // Número de recibo y fecha
    const fecha = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    doc.setFontSize(10)
    doc.setTextColor(...darkGrayColor)
    doc.text(`Recibo #${joven._id.slice(-6).toUpperCase()}`, 20, 60)
    doc.text(`Fecha: ${fecha}`, 190, 60, { align: "right" })
    
    // Información del joven
    doc.setFontSize(14)
    doc.setTextColor(...primaryColor)
    doc.text("INFORMACIÓN DEL BENEFICIARIO", 20, 75)
    
    // Cuadro de información con sombra
    doc.setDrawColor(...grayColor)
    doc.setFillColor(...lightGrayColor)
    doc.roundedRect(20, 80, 170, 45, 3, 3, "F")
    
    const abonado = totalAbonos(joven.abonos)
    const restante = joven.montoAsignado - abonado
    
    // Información detallada
    doc.setFontSize(11)
    doc.setTextColor(...darkGrayColor)
    
    // Primera columna
    doc.text(`Nombre:`, 25, 90)
    doc.setFont('helvetica', 'bold')
    doc.text(joven.nombre, 65, 90)
    doc.setFont('helvetica', 'normal')
    
    doc.text(`Teléfono:`, 25, 100)
    doc.text(joven.telefono, 65, 100)
    
    // Segunda columna
    doc.text(`Monto Asignado:`, 110, 90)
    doc.setFont('helvetica', 'bold')
    doc.text(`$${joven.montoAsignado.toLocaleString()}`, 170, 90, { align: "right" })
    doc.setFont('helvetica', 'normal')
    
    // Resumen financiero
    doc.setFontSize(14)
    doc.setTextColor(...primaryColor)
    doc.text("RESUMEN FINANCIERO", 20, 135)
    
    // Cuadro de resumen con sombra
    doc.roundedRect(20, 140, 170, 35, 3, 3, "F")
    
    // Estado del pago con ícono visual
    const estadoColor: [number, number, number] = restante <= 0 ? successColor : accentColor
    const estado = restante <= 0 ? "PAGADO" : "PENDIENTE"
    
    // Círculo de estado
    doc.setFillColor(...estadoColor)
    doc.circle(170, 150, 5, 'F')
    doc.setTextColor(...estadoColor)
    doc.text(`Estado: ${estado}`, 155, 155, { align: "right" })
    
    // Información financiera
    doc.setTextColor(...darkGrayColor)
    doc.text(`Total Abonado:`, 25, 150)
    doc.setFont('helvetica', 'bold')
    doc.text(`$${abonado.toLocaleString()}`, 120, 150, { align: "right" })
    doc.setFont('helvetica', 'normal')
    
    doc.text(`Restante:`, 25, 160)
    doc.setFont('helvetica', 'bold')
    doc.text(`$${restante.toLocaleString()}`, 120, 160, { align: "right" })
    doc.setFont('helvetica', 'normal')
    
    // Historial de abonos
    if (joven.abonos.length > 0) {
      doc.setFontSize(14)
      doc.setTextColor(...primaryColor)
      doc.text("HISTORIAL DE ABONOS", 20, 185)
      
      const abonosData = joven.abonos
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .map(abono => {
          const fecha = new Date(abono.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
          const saldoRestante = joven.montoAsignado - totalAbonos(joven.abonos.filter(a => 
            new Date(a.fecha) <= new Date(abono.fecha)
          ))
          return [
            fecha,
            `$${abono.cantidad.toLocaleString()}`,
            `$${saldoRestante.toLocaleString()}`
          ]
        })

      autoTable(doc, {
        head: [["Fecha", "Cantidad", "Saldo Restante"]],
        body: abonosData,
        startY: 190,
        styles: { 
          fontSize: 10,
          cellPadding: 5,
          lineColor: grayColor,
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: primaryColor,
          textColor: 255,
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center',
        },
        columnStyles: {
          0: { halign: 'center' },
          1: { halign: 'right' },
          2: { halign: 'right' },
        },
        alternateRowStyles: {
          fillColor: lightGrayColor,
        },
        margin: { left: 20, right: 20 },
        theme: 'grid',
      })
    }
    
    // Pie de página
    const pageHeight = doc.internal.pageSize.height
    doc.setDrawColor(...grayColor)
    doc.line(20, pageHeight - 30, 190, pageHeight - 30)
    
    doc.setFontSize(9)
    doc.setTextColor(128, 128, 128)
    doc.text(
      "Este documento es generado automáticamente y sirve como comprobante oficial de pagos.",
      105,
      pageHeight - 20,
      { align: "center" }
    )
    doc.text(
      `Generado el ${fecha}`,
      105,
      pageHeight - 10,
      { align: "center" }
    )

    doc.save(`${joven.nombre.replace(/\s+/g, '_')}_recibo.pdf`)
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
                  className="bg-white shadow-md p-5 rounded-xl border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{j.nombre}</h2>
                      <p className="text-sm text-gray-500">
                        Teléfono: {j.telefono}
                      </p>
                      <p className="text-sm text-gray-500">
                        Asignado: ${j.montoAsignado.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Abonado: ${abonado.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Restante:{" "}
                        <span
                          className={
                            restante > 0 ? "text-red-600" : "text-green-600"
                          }
                        >
                          ${restante.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 justify-end">
                      <button
                        className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition w-full sm:w-auto"
                        onClick={() => navigate(`/abono/${j._id}`)}
                      >
                        <FaPlusCircle />
                        Abonar
                      </button>
                      <button
                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition w-full sm:w-auto"
                        onClick={() => exportarPDFIndividual(j)}
                      >
                        <FaFilePdf />
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
