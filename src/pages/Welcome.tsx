import { useNavigate } from "react-router-dom"
import { FaBuilding } from "react-icons/fa"

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="h-screen w-full bg-[#F0F4F8] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <FaBuilding size={64} className="text-[#6C63FF]" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Administración
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Delegación Buenavista
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-[#6C63FF] text-white py-3 px-10 rounded-xl shadow hover:bg-[#574fd6] transition"
        >
          Comenzar
        </button>
      </div>
    </div>
  )
}
