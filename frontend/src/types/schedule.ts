export interface Team {
    id: number;
    name: string;
    teamName: string;
    shortName: string;
    abbreviation: string;
    locationName: string;
    franchiseName: string;
    clubName: string;
    firstYearOfPlay: string;
    active: boolean;
    league: {
        id: number;
        name: string;
        link: string;
    };
    division: {
        id: number;
        name: string;
        link: string;
    };
    sport: {
        id: number;
        name: string;
        link: string;
    };
    venue: {
        id: number;
        name: string;
        link: string;
    };
    springLeague?: {
        id: number;
        name: string;
        link: string;
        abbreviation: string;
    };
    springVenue?: {
        id: number;
        link: string;
    };
    allStarStatus: string;
    teamCode: string;
    fileCode: string;
    season: number;
}

export interface FavoriteTeam {
    teamName: string;
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