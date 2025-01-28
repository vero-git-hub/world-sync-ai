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
}