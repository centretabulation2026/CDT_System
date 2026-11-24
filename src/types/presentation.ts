export interface SlideMeta {
  id: string;
  number: number;
  topic: string;
  title: string;
}

export interface PollingStationTally {
  stationId: string;
  name: string;
  commune: string;
  department: string;
  agentName: string;
  agentId: string;
  registeredVoters: number; // 350 de référence
  totalVoters: number;
  nullVotes: number;
  blankVotes: number;
  validVotes: number;
  competitors: {
    id: string;
    code: string;
    name: string;
    votes: number;
    ratio: number;
  }[];
}
