import React, { createContext, useState, useEffect, useContext } from "react";
import {useAuth} from "../auth/AuthContext.tsx";
import API from "../../api.ts";
import {GameSchedule, MlbScheduleResponse, ScheduleContextType} from "../../types/home.ts";

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [schedule, setSchedule] = useState<GameSchedule | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { token } = useAuth();

    const fetchSchedule = async () => {
        if (!token) {
            console.warn("⚠️ Skipping schedule fetch: user not authenticated");
            setLoading(false);
            return;
        }

        try {
            const response = await API.get<MlbScheduleResponse>("/schedule/mlb");
            if (response.status === 200 && response.data.dates.length > 0) {
                const now = new Date();
                const futureGames = response.data.dates.flatMap(date =>
                    date.games.filter(game => new Date(game.gameDate) > now)
                );

                if (futureGames.length > 0) {
                    const nextGame = futureGames[0];

                    setSchedule({
                        date: nextGame.officialDate || "Unknown Date",
                        teams: {
                            away: nextGame.teams.away.team.name,
                            home: nextGame.teams.home.team.name,
                        },
                        time: new Date(nextGame.gameDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        venue: nextGame.venue.name,
                        description: nextGame.description,
                        seriesInfo: `Game ${nextGame.seriesGameNumber} of ${nextGame.gamesInSeries}`,
                        dayNight: nextGame.dayNight,
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
    }, [token]);

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