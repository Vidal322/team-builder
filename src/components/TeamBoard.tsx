// components/TeamBoard.tsx

import TeamCard from './TeamCard';
import { Team } from '@/types';

type TeamBoardProps = {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  activeId?: string | null;
};

export default function TeamBoard({ teams, setTeams, activeId }: TeamBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} activeId={activeId} />
      ))}
    </div>
  );
}
