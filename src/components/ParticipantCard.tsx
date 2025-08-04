import { useDraggable } from '@dnd-kit/core';
import { Participant } from '@/types';

type Props = {
  participant: Participant;
  activeId?: string | null;
};

export default function ParticipantCard({ participant, activeId }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: participant.id,
  });

  const style = {
    transform:
      activeId === participant.id ? undefined : transform
        ? `translate(${transform.x}px, ${transform.y}px)`
        : undefined,
    opacity: isDragging ? 0.2 : 1,
  };

  const colorClass =
    participant.gender === 'female'
      ? 'bg-pink-200 border-pink-400'
      : 'bg-blue-200 border-blue-400';

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`border rounded px-3 py-2 shadow text-gray-800 max-w-xs w-full transition-opacity duration-200 ${colorClass}`}
    >
      <div className="flex items-center justify-between">
        <span>
          {participant.name}{" "}
          <span className="text-xs text-gray-500">
            ({participant.age} anos, {participant.room})
          </span>
        </span>
        {participant.problematic && (
          <span
            className="text-red-600 text-xl ml-2"
            title="Participante problemático"
            role="img"
            aria-label="danger"
          >
            ⚠️
          </span>
        )}
      </div>
    </li>
  );
}
