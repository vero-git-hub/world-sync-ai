export interface GameCardProps {
    homeTeam: string;
    awayTeam: string;
    homeLogo: string;
    awayLogo: string;
    homeTeamId: number;
    awayTeamId: number;
    gameTime: string;
    venue: string;
    onTeamClick: (teamId: number) => void;
}