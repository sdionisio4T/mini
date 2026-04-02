import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMidiStore } from '../features/midi/midiStore';
import { useProgressStore } from '../features/gamification/progressStore';
import { eventBus, EVENTS } from '../lib/events/eventBus';
import type { AchievementDef } from '../features/gamification/achievements';

function AchievementToast({ achievement, onDone }: { achievement: AchievementDef; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3 animate-bounce">
      <span className="text-2xl">{achievement.icono}</span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide opacity-80">Logro desbloqueado</p>
        <p className="text-sm font-semibold">{achievement.nombre}</p>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const status = useMidiStore(s => s.status);
  const { xp, nivel } = useProgressStore();
  const location = useLocation();
  const [toast, setToast] = useState<AchievementDef | null>(null);

  useEffect(() => {
    return eventBus.on<AchievementDef>(EVENTS.ACHIEVEMENT_UNLOCKED, (def) => {
      setToast(def);
    });
  }, []);

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
            }`}>Lab</Link>
            <Link to="/patches" className={`text-sm transition-colors ${
              location.pathname.startsWith('/patches') ? 'text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-800'
            }`}>Patches</Link>
            <Link to="/perfil" className={`text-sm transition-colors ${
              location.pathname === '/perfil' ? 'text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-800'
            }`}>
              Nv.{nivel} · {xp}xp
            </Link>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
            }`}>
              {status === 'connected' ? '● MIDI' : '○ MIDI'}
            </span>
          </div>
        </div>
      </nav>
      <main>{children}</main>
      {toast && <AchievementToast achievement={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
