import {Team} from '@/types'

export function getTeamAvgAge(team :Team){

  const participantCount = team.participants.length;
  const averageAge =
    participantCount > 0
      ? Math.round(
          team.participants.reduce((sum, p) => sum + (p.age || 0), 0) / participantCount
        )
      : null;
    
  return averageAge;
  }