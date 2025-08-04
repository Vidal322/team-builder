export type Participant = {
  id: string;
  name: string;
  room: string;
  gender: 'male' | 'female';
  age: number;
  problematic: boolean;
  problematic_friends: Participant[];
};

export type Team = {
  id: string;
  name: string;
  participants: Participant[];
};