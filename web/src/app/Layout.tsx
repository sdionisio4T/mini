import { Link, useLocation } from 'react-router-dom';
import { useMidiStore } from '../features/midi/midiStore';

export function Layout({ children }: { children: React.ReactNode }) {
  const status = useMidiStore(s => s.status);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-bold text-gray-900 text-sm">
            🎛 Minilogue XD
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/curso" className={`text-sm transition-colors ${
              location.pathname.startsWith('/curso') || location.pathname.startsWith('/leccion')
                ? 'text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-800'
            }`}>Curso</Link>
            <Link to="/laboratorio" className={`text-sm transition-colors ${
              location.pathname === '/laboratorio' ? 'text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-800'
            }`}>Laboratorio</Link>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
            }`}>
              {status === 'connected' ? '● MIDI' : '○ MIDI'}
            </span>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
