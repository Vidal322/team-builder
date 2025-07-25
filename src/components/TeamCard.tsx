import { useDroppable } from '@dnd-kit/core';
import ParticipantCard from './ParticipantCard';
import { Team } from '@/types';

type Props = {
  team: Team;
  activeId?: string | null;
};

export default function TeamColumn({ team, activeId }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: team.id });

  const participantCount = team.participants.length;
  const averageAge =
    participantCount > 0
      ? Math.round(
          team.participants.reduce((sum, p) => sum + (p.age || 0), 0) / participantCount
        )
      : null;

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded shadow min-h-[150px] transition-all duration-200 border ${
        isOver ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-transparent'
      }`}
    >
      <div className="mb-3">
        <h2 className="text-lg font-bold">{team.name}</h2>
        <div className="text-sm text-gray-600 flex justify-between">
          <span>{participantCount} participante{participantCount !== 1 ? 's' : ''}</span>
          {averageAge !== null && <span>Idade Média: {averageAge}</span>}
        </div>
      </div>

      <ul className="space-y-2">
        {team.participants.map((p) => (
          <ParticipantCard key={p.id} participant={p} activeId={activeId} />
        ))}
      </ul>
    </div>
  );
}
