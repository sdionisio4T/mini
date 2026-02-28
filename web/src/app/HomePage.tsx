import { Link } from 'react-router-dom';
import { MidiConnectionPanel } from '../features/midi/MidiConnectionPanel';

export function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Aprende síntesis con tu<br/>
          <span className="text-indigo-600">Minilogue XD</span>
        </h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Conecta tu sintetizador y aprende síntesis sustractiva desde cero, paso a paso, en español.
        </p>
      </div>

      <div className="mb-8">
        <MidiConnectionPanel />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/curso"
          className="bg-indigo-600 text-white rounded-xl p-6 text-center hover:bg-indigo-700 transition-colors">
          <div className="text-2xl mb-2">📚</div>
          <div className="font-semibold">Empezar el curso</div>
          <div className="text-xs text-indigo-200 mt-1">Lecciones guiadas paso a paso</div>
        </Link>
        <Link to="/laboratorio"
          className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-indigo-300 transition-colors">
          <div className="text-2xl mb-2">🔬</div>
          <div className="font-semibold text-gray-800">Laboratorio</div>
          <div className="text-xs text-gray-400 mt-1">Explora libremente</div>
        </Link>
      </div>
    </div>
  );
}
