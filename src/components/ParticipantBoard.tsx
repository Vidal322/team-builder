import { useDroppable } from '@dnd-kit/core';
import ParticipantCard from './ParticipantCard';
import { Participant } from '@/types';

type Props = {
  participants: Participant[];
  activeId?: string | null;
};

export default function ParticipantsBoard({ participants, activeId }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: 'unassigned' });

  const grouped = participants.reduce((acc, p) => {
    if (!acc[p.room]) acc[p.room] = [];
    acc[p.room].push(p);
    return acc;
  }, {} as Record<string, Participant[]>);

  return (
    <div
      ref={setNodeRef}
      className={`w-full h-full p-4 rounded shadow overflow-y-auto transition-all duration-200 ${
        isOver ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'
      }`}
    >
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Não Atribuídos</h2>
      <div className="space-y-4">
        {Object.entries(grouped).map(([roomName, people]) => (
          <div key={roomName}>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">{roomName}</h3>
            <ul className="space-y-2">
              {people.map((p) => (
                <ParticipantCard key={p.id} participant={p} activeId={activeId} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
