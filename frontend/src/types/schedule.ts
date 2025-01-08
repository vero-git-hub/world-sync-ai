export interface Team {
    name: string;
}

export interface Game {
    gameDate: string;
    teams: {
        home: { team: Team };
        away: { team: Team };
    };
    venue: { name: string };
}

export interface ScheduleDate {
    date: string;
    games: Game[];
}