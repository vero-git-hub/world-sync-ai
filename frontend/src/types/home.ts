export interface FavoriteTeam {
    id: number;
    teamName: string;
    userId: number;
}

export interface UserData {
    id: number;
    username: string;
    email: string;
    password: string;
    favoriteTeams: FavoriteTeam[];
    hasGoogleCalendarToken: boolean;
}

export interface Team {
    id: number;
    name: string;
    logoUrl?: string;
    franchiseName: string;
    locationName: string;
    firstYearOfPlay: string;
    abbreviation: string;
    league: {
        id: number;
        name: string;
    };
    division: {
        id: number;
        name: string;
    };
    venue: {
        id: number;
        name: string;
    };
    springLeague: {
        id: number;
        name: string;
        abbreviation: string;
    };
    allStarStatus: string;
}

export interface MlbScheduleResponse {
    dates: {
        date: string;
        games: {
            gamePk: number;
            gameDate: string;
            officialDate: string;
            teams: {
                away: { team: { name: string } };
                home: { team: { name: string } };
            };
            venue: { name: string };
            description: string;
            seriesGameNumber: number;
            gamesInSeries: number;
            dayNight: string;
        }[];
    }[];
}

export interface GameSchedule {
    date: string;
    teams: {
        away: string;
        home: string;
    };
    time: string;
    venue: string;
    description: string;
    seriesInfo: string;
    dayNight: string;
}

export interface ScheduleContextType {
    schedule: GameSchedule | null;
    loading: boolean;
    fetchSchedule: () => Promise<void>;
}