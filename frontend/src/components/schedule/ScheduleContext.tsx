import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

interface MlbScheduleResponse {
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
        }[];
    }[];
}

interface GameSchedule {
    date: string;
    teams: string;
    time: string;
    venue: string;
}

interface ScheduleContextType {
    schedule: GameSchedule | null;
    loading: boolean;
    fetchSchedule: () => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [schedule, setSchedule] = useState<GameSchedule | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchSchedule = async () => {
        try {
            const response = await axios.get<MlbScheduleResponse>("/api/schedule/mlb");
            if (response.status === 200 && response.data.dates.length > 0) {
                const now = new Date();
                const futureGames = response.data.dates.flatMap(date =>
                    date.games.filter(game => new Date(game.gameDate) > now)
                );

                if (futureGames.length > 0) {
                    const nextGame = futureGames[0];

                    setSchedule({
                        date: nextGame.officialDate || "Unknown Date",
                        teams: `${nextGame.teams.away.team.name} vs ${nextGame.teams.home.team.name}`,
                        time: new Date(nextGame.gameDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        venue: nextGame.venue.name,
                    });
                }
            }
        } catch (error) {
            console.error("Failed to fetch schedule", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    return (
        <ScheduleContext.Provider value={{ schedule, loading, fetchSchedule }}>
            {children}
        </ScheduleContext.Provider>
    );
};

export const useSchedule = (): ScheduleContextType => {
    const context = useContext(ScheduleContext);
    if (!context) {
        throw new Error("useSchedule must be used within a ScheduleProvider");
    }
    return context;
};