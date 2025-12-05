'use client';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">Ritielle</h1>
                    <ul className="flex gap-6">
                        <li><a href="#" className="text-gray-700 hover:text-indigo-600">Home</a></li>
                        <li><a href="#" className="text-gray-700 hover:text-indigo-600">About</a></li>
                        <li><a href="#" className="text-gray-700 hover:text-indigo-600">Contact</a></li>
                    </ul>
                </div>
            </nav>

            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center">
                    <h2 className="text-5xl font-bold text-gray-900 mb-4">Welcome to Ritielle</h2>
                    <p className="text-xl text-gray-600 mb-8">Create amazing experiences</p>
                    <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                        Get Started
                    </button>
                </div>
            </section>
        </main>
    );
}