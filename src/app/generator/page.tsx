// app/generator/page.tsx
'use client';

import { useState } from 'react';
import { generateBalancedTeams} from '@/lib/generator';
import { Team, Participant } from '@/types'
import TeamBoard from '@/components/TeamBoard';
import ParticipantsBoard from '@/components/ParticipantBoard';
import { v4 as uuidv4 } from 'uuid';
import ParticipantCard from '@/components/ParticipantCard';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useEffect } from 'react';
import { parseCSVParticipants } from '@/lib/parseCSV';


export default function GeneratorPage() {


async function handleCSVUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const parsed = await parseCSVParticipants(file);

    setAllParticipants(parsed);
    setInitialParticipants(parsed);

    const emptyTeams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
      id: `team-${i + 1}`,
      name: `Equipa ${i + 1}`,
      participants: [],
    }));

    setTeams(emptyTeams);
  } catch (err) {
    console.error('Failed to parse CSV:', err);
    alert('There was an error parsing the CSV file. Please check formatting.');
  }
}



const [initialParticipantList] = useState<Participant[]>([
  { id: uuidv4(), name: 'Ana', gender: 'female', room: 'A', age: 12 },
  { id: uuidv4(), name: 'Bruno', gender: 'male', room: 'A', age: 10},
  { id: uuidv4(), name: 'Carla', gender: 'female', room: 'B', age: 13 },
  { id: uuidv4(), name: 'Daniel', gender: 'male', room: 'B', age: 14 },
  { id: uuidv4(), name: 'Eva', gender: 'female', room: 'B', age: 15},
  { id: uuidv4(), name: 'Filipe', gender: 'male', room: 'C', age: 14 },
  { id: uuidv4(), name: 'Gabriela', gender: 'female', room: 'C', age: 9 },
  { id: uuidv4(), name: 'Hugo', gender: 'male', room: 'C', age: 8 },
  { id: uuidv4(), name: 'Inês', gender: 'female', room: 'C', age: 11 },
]);


  const [numTeams, setNumTeams] = useState<number>(2);
  const [teams, setTeams] = useState<Team[]>([]);
  const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
  const [initialParticipants, setInitialParticipants] = useState<Participant[]>([]);

  const sensors = useSensors(useSensor(PointerSensor));


  useEffect(() => {
    setAllParticipants(initialParticipantList);
    setInitialParticipants(initialParticipantList);
        const emptyTeams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
          id: `team-${i + 1}`,
          name: `Equipa ${i + 1}`,
          participants: [],
        }));

        setTeams(emptyTeams);
      }, []); 



  function handleGenerate() {

    const newTeams = generateBalancedTeams(allParticipants, numTeams);
    setTeams(newTeams);
  }


  const assignedIds = teams.flatMap((t) => t.participants.map((p) => p.id));
  const unassignedParticipants = allParticipants.filter((p) => !assignedIds.includes(p.id));

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over) return;

    const participantId = active.id;
    const destinationTeamId = over.id;

    const sourceTeamIndex = teams.findIndex((team) =>
      team.participants.some((p) => p.id === participantId)
    );
    const targetTeamIndex = teams.findIndex((team) => team.id === destinationTeamId);

    if (destinationTeamId === 'unassigned') {
      if (sourceTeamIndex === -1) return;
      const dragged = teams[sourceTeamIndex].participants.find(p => p.id === participantId);
      if (!dragged) return;
      const updatedSource = {
        ...teams[sourceTeamIndex],
        participants: teams[sourceTeamIndex].participants.filter(p => p.id !== participantId),
      };
      const updated = [...teams];
      updated[sourceTeamIndex] = updatedSource;
      setTeams(updated);
      return;
    }

    if (sourceTeamIndex === -1 && targetTeamIndex !== -1) {
      const dragged = allParticipants.find((p) => p.id === participantId);
      if (!dragged) return;

      const updatedTarget = {
        ...teams[targetTeamIndex],
        participants: [...teams[targetTeamIndex].participants, dragged],
      };

      const updated = [...teams];
      updated[targetTeamIndex] = updatedTarget;
      setTeams(updated);
      return;
    }

  if (sourceTeamIndex === -1 || targetTeamIndex === -1) return;
  if (sourceTeamIndex === targetTeamIndex) return;

  const dragged = teams[sourceTeamIndex].participants.find(p => p.id === participantId);
  if (!dragged) return;

  const updatedSource = {
    ...teams[sourceTeamIndex],
    participants: teams[sourceTeamIndex].participants.filter(p => p.id !== participantId),
  };

  const updatedTarget = {
    ...teams[targetTeamIndex],
    participants: [...teams[targetTeamIndex].participants, dragged],
  };

  const updated = [...teams];
  updated[sourceTeamIndex] = updatedSource;
  updated[targetTeamIndex] = updatedTarget;
  setTeams(updated);
}
  
  const [activeId, setActiveId] = useState<string | null>(null);


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToWindowEdges]}
      onDragStart={(event) => setActiveId(String(event.active.id))}
      onDragEnd={(event) => {
        setActiveId(null);
        handleDragEnd(event);
      }}
      onDragCancel={() => setActiveId(null)}

    >
      <div className="h-screen overflow-x-hidden text-gray-900 bg-gray-50">
        <div className="flex h-full">
          <DragOverlay>
            {activeId
              ? (() => {
                  const participant =
                    allParticipants.find((p) => p.id === activeId) ??
                    teams.flatMap((t) => t.participants).find((p) => p.id === activeId);

                  return participant ? <ParticipantCard participant={participant} /> : null;
                })()
              : null}
          </DragOverlay>

          {/* LEFT: Controls + Team Board */}
          <div className="flex-1 min-w-0 p-6 overflow-y-auto">
            <div className="mb-6 flex items-center gap-4">
              <label className="font-medium">Número de equipas:</label>
              <select
                value={numTeams}
                onChange={(e) => setNumTeams(Number(e.target.value))}
                className="border rounded px-2 py-1 bg-white text-gray-800"
              >
                {[2, 3, 4, 5, 6, 7,8,9,10,11,12].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              <button
                onClick={handleGenerate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Gerar Equipas
              </button>

              <button
                onClick={() => {
                  const emptyTeams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
                    id: `team-${i + 1}`,
                    name: `Team ${i + 1}`,
                    participants: [],
                  }));

                  setTeams(emptyTeams);
                  setAllParticipants(initialParticipants);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Limpar Equipas
              </button>
              <label className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
                Upload CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
              </label>
            </div>


            <TeamBoard teams={teams} setTeams={setTeams} activeId={activeId }/>
          </div>

          {/* RIGHT: Unassigned Participants */}
          <div className="w-64 shrink-0 p-6 bg-white overflow-y-auto border-l border-gray-200">
            <ParticipantsBoard participants={unassignedParticipants} />
          </div>
        </div>
      </div>
    </DndContext>
  );
}
