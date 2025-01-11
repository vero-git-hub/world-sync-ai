package org.example.worldsyncai.service;

import org.example.worldsyncai.dto.FavoriteTeamDto;

import java.util.List;

public interface FavoriteTeamService {

    List<FavoriteTeamDto> getFavoriteTeamsByUserId(Long userId);

    void addFavoriteTeams(Long userId, List<String> teamNames);

    void removeFavoriteTeams(Long userId, List<String> teamNames);
}