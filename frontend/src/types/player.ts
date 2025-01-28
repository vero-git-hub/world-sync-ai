export interface PlayerInfo {
    id: number;
    fullName: string;
    birthDate: string;
    currentAge: number;
    primaryPosition: { name: string };
    height: string;
    weight: number;
    mlbDebutDate: string;
    batSide: { description: string };
    pitchHand: { description: string };
}

export interface LocationState {
    fromTeamPath?: string;
}