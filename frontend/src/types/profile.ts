export interface SelectOption {
    value: string;
    label: string;
}

export interface UserData {
    id: number;
    username: string;
    email: string;
    password: string;
    favoriteTeams: any[];
    hasGoogleCalendarToken: boolean;
}