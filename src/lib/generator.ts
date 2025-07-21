
export type Participant = {
  id: string;
  name: string;
  room: string;
  gender: 'male' | 'female';
  age: number;
};

export type Team = {
  id: string;
  name: string;
  participants: Participant[];
};

export function generateBalancedTeams(participants: Participant[], numTeams: number): Team[] {
  const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
    id: `team-${i + 1}`,
    name: `Team ${i + 1}`,
    participants: [],
  }));

  const shuffled = [...participants].sort(() => Math.random() - 0.5);
  shuffled.forEach((participant, i) => {
    const teamIndex = i % numTeams;
    teams[teamIndex].participants.push(participant);
  });

  return teams;
}

