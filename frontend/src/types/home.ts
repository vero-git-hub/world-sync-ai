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