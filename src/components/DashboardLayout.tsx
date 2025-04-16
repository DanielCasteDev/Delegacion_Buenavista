import {
    FaBars,
    FaUserPlus,
    FaListAlt,
    FaChartBar,
    
    FaHome,
  } from "react-icons/fa"
  import { useNavigate, useLocation } from "react-router-dom"
  import { useState } from "react"
  
  const links = [
    { label: "Inicio", icon: <FaHome />, path: "/menu" },
    { label: "Registrar joven", icon: <FaUserPlus />, path: "/registro" },
    { label: "Lista de jóvenes", icon: <FaListAlt />, path: "/listado" },
    { label: "Resumen general", icon: <FaChartBar />, path: "/resumen" },
  ]
  
  export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate()
    const location = useLocation()
    const [open, setOpen] = useState(false)
  
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-white via-indigo-50 to-purple-50 text-gray-800 font-inter">
        {/* Sidebar */}
        <aside
          className={`w-72 fixed md:relative z-50 h-screen flex flex-col justify-between bg-white border-r border-gray-200 p-6 shadow-lg transition-transform duration-300 ease-in-out ${
            open ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div>
            <h2 className="text-2xl font-bold text-indigo-800 mb-8 text-center tracking-wide">
              Delegación Buenavista
            </h2>
            <nav className="space-y-2">
              {links.map((link, index) => (
                <button
                  key={index}
                  onClick={() => {
                    navigate(link.path)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? "bg-indigo-100 text-indigo-800"
                      : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
          <p className="text-xs text-center text-gray-400">Panel de administración</p>
        </aside>
  
        {/* Main */}
        <div className="flex-1 flex flex-col md:ml-72">
          {/* Header móvil */}
          <header className="md:hidden flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
            <h1 className="text-lg font-semibold"></h1>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 bg-indigo-100 rounded-lg text-indigo-800 hover:bg-indigo-200 transition"
            >
              <FaBars />
            </button>
          </header>
  
          {/* Contenido */}
          <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-white md:rounded-tl-3xl md:shadow-inner">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    )
  }
  