import DashboardLayout from "../components/DashboardLayout"
import { FaBell, FaRegCalendarCheck, FaUserEdit, FaClipboardList, FaCog } from "react-icons/fa"

export default function MenuPrincipal() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10 w-full">
        {/* Bienvenida */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-start md:items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 flex-shrink-0">
            <FaBell size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">¡Bienvenido, Administrador!</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Hoy es un buen día para mantener todo en orden.
            </p>
          </div>
        </div>

        {/* Acciones rápidas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <FaUserEdit size={20} />,
              title: "Registrar nuevo joven",
              description: "Agrega un nuevo integrante al sistema.",
              color: "indigo"
            },
            {
              icon: <FaClipboardList size={20} />,
              title: "Lista de jóvenes",
              description: "Consulta, edita o elimina registros existentes.",
              color: "blue"
            },
            {
              icon: <FaRegCalendarCheck size={20} />,
              title: "Revisiones próximas",
              description: "Gestiona pagos y seguimientos pendientes.",
              color: "green"
            },
            {
              icon: <FaCog size={20} />,
              title: "Configuración",
              description: "Ajusta los parámetros del sistema.",
              color: "purple"
            }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-${item.color}-100 text-${item.color}-600`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </section>

        {/* Consejo */}
        <aside className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
          <h4 className="text-lg font-semibold text-indigo-700 mb-2">Consejo del día</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            Mantén los datos actualizados y comunica los cambios importantes a los miembros del equipo. Un sistema actualizado es un sistema eficiente.
          </p>
        </aside>
      </div>
    </DashboardLayout>
  )
}
