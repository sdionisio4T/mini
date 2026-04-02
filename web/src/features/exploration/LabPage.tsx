import { useState } from 'react';
import { MidiConnectionPanel } from '../midi/MidiConnectionPanel';
import { MidiMonitor } from '../midi/MidiMonitor';
import { FilterPanel } from '../synth-ui/panels/FilterPanel';
import { CalibrationWizard } from '../midi/mapping/CalibrationWizard';

type Tab = 'paneles' | 'calibrar' | 'monitor';

export function LabPage() {
  const [tab, setTab] = useState<Tab>('paneles');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Laboratorio</h1>
        <p className="text-sm text-gray-500 mt-1">Explora el sintetizador sin seguir el curso.</p>
      </div>

      <MidiConnectionPanel />

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {(['paneles', 'calibrar', 'monitor'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t === 'paneles' ? 'Paneles' : t === 'calibrar' ? 'Calibrar' : 'Monitor MIDI'}
          </button>
        ))}
      </div>

      {tab === 'paneles' && <FilterPanel />}
      {tab === 'calibrar' && <CalibrationWizard />}
      {tab === 'monitor' && <MidiMonitor />}
    </div>
  );
}
