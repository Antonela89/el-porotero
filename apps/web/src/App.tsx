import './App.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <header className="text-center">
        <h1 className="text-5xl text-primary mb-2">El Porotero</h1>
        <p className="text-text-muted">Anotador de timba profesional</p>
      </header>

      <main className="card-player w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-xl">Mesa de Loba</h2>
        <input
          type="text"
          placeholder="Nombre del jugador..."
          className="input-field"
        />
        <button className="btn-primary">
          Empezar Partida
        </button>
      </main>
    </div>
  )
}
export default App