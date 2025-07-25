// components/TeamBoard.tsx

import TeamCard from './TeamCard';
import { Team } from '@/types';

type Props = {
  teams: Team[];
  activeId?: string | null;
};

export default function TeamBoard({ teams, activeId }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} activeId={activeId} />
      ))}
    </div>
  );
}
