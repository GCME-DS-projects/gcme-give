
export default function Dashboard() {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-4xl rounded-2xl bg-white p-8 shadow-lg text-center">
                <h1 className="mb-4 text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="mb-6 text-gray-600">This is the dashboard page. You are logged in!</p>
                {/* Add your dashboard content here */}
            </div>
        </div>
    )
}