export interface TeamInfo {
    id: number;
    name: string;
    venue: { name: string; city: string };
    league?: { name: string };
    division?: { name: string };
}

export interface RosterPlayer {
    person: { fullName: string; id: number };
    position: { name: string };
}