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
  DragOverlay,
  DragEndEvent
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
  { id: uuidv4(), name: 'Ana', gender: 'female', room: 'A', age: 12, problematic: true, problematic_friends: [] },
  { id: uuidv4(), name: 'Bruno', gender: 'male', room: 'A', age: 10, problematic: true, problematic_friends: [] },
  { id: uuidv4(), name: 'Carla', gender: 'female', room: 'B', age: 13, problematic: true, problematic_friends: []  },
  { id: uuidv4(), name: 'Daniel', gender: 'male', room: 'B', age: 14, problematic: true, problematic_friends: []  },
  { id: uuidv4(), name: 'Eva', gender: 'female', room: 'B', age: 15, problematic: true, problematic_friends: [] },
  { id: uuidv4(), name: 'Filipe', gender: 'male', room: 'C', age: 14, problematic: true, problematic_friends: []  },
  { id: uuidv4(), name: 'Gabriela', gender: 'female', room: 'C', age: 9, problematic: true, problematic_friends: []  },
  { id: uuidv4(), name: 'Hugo', gender: 'male', room: 'C', age: 8, problematic: true, problematic_friends: []  },
  { id: uuidv4(), name: 'Inês', gender: 'female', room: 'C', age: 11, problematic: true, problematic_friends: []  },
]);


  const [numTeams, setNumTeams] = useState<number>(2);
  const [teams, setTeams] = useState<Team[]>([]);
  const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
  const [initialParticipants, setInitialParticipants] = useState<Participant[]>([]);

  const sensors = useSensors(useSensor(PointerSensor));


  const assignedIds = teams.flatMap((t) => t.participants.map((p) => p.id));
  const unassignedParticipants = allParticipants.filter((p) => !assignedIds.includes(p.id));

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setAllParticipants(initialParticipantList);
    setInitialParticipants(initialParticipantList);
        const emptyTeams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
          id: `team-${i + 1}`,
          name: `Equipa ${i + 1}`,
          participants: [],
        }));

        setTeams(emptyTeams);
      }, [initialParticipantList, numTeams]); 

  function handleGenerate() {

    const newTeams = generateBalancedTeams(allParticipants, numTeams);
    setTeams(newTeams);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const participantId = active.id;
    const destinationId = over.id;

    const participantInTeams = teams.flatMap((team) => team.participants).find((p) => p.id === participantId);
    const participant = participantInTeams ?? allParticipants.find((p) => p.id === participantId);
    if (!participant) return;

    const sourceTeamIndex = teams.findIndex((team) => team.participants.some((p) => p.id === participantId));
    const targetTeamIndex = teams.findIndex((team) => team.id === destinationId);

    const updatedTeams = [...teams];

    if (sourceTeamIndex !== -1) {
      const sourceTeam = updatedTeams[sourceTeamIndex];
      updatedTeams[sourceTeamIndex] = {
        ...sourceTeam,
        participants: sourceTeam.participants.filter((p) => p.id !== participantId),
      };
    }

    if (destinationId === 'unassigned') {
      setTeams(updatedTeams);
      return;
    }

    if (targetTeamIndex !== -1) {
      const targetTeam = updatedTeams[targetTeamIndex];
      updatedTeams[targetTeamIndex] = {
        ...targetTeam,
        participants: [...targetTeam.participants, participant],
      };
      setTeams(updatedTeams);
    }
  }

  

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


            <TeamBoard teams={teams}/>
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
