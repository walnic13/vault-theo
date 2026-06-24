// Vault Theo — minimal scaffold landing page. Mirrors the vault-origin Vite + React + TS +
// Tailwind toolchain so the Azure Static Web App can build (npm run build -> dist) on each
// push to `development`. Real application surfaces will replace this placeholder.
export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
        <h1 className="text-4xl font-extrabold mb-3">
          <span className="text-gray-700">Vault </span>
          <span className="bg-gradient-to-r from-blue-900 via-yellow-400 via-orange-500 via-red-600 to-rose-900 bg-clip-text text-transparent">
            Theo
          </span>
        </h1>
        <p className="text-gray-600">
          Scaffold is live. This placeholder confirms the build and Azure Static Web Apps
          deployment pipeline are working.
        </p>
      </div>
    </div>
  );
}
