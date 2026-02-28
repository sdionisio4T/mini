import { MidiConnectionPanel } from '../midi/MidiConnectionPanel';
import { MidiMonitor } from '../midi/MidiMonitor';
import { FilterPanel } from '../synth-ui/panels/FilterPanel';

export function LabPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Laboratorio</h1>
        <p className="text-sm text-gray-500 mt-1">Explora el sintetizador sin seguir el curso.</p>
      </div>
      <MidiConnectionPanel />
      <FilterPanel />
      <MidiMonitor />
    </div>
  );
}
