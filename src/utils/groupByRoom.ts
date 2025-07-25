import { Participant } from '@/types';

export function groupParticipantsByRoom(participants: Participant[]) {
  return participants.reduce((acc, p) => {
    if (!acc[p.room]) acc[p.room] = [];
    acc[p.room].push(p);
    return acc;
  }, {} as Record<string, Participant[]>);
}
