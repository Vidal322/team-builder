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