package org.example.worldsyncai.service;

import org.example.worldsyncai.dto.FavoriteTeamDto;

import java.util.List;
import java.util.Optional;

public interface FavoriteTeamService {

    Optional<FavoriteTeamDto> getFavoriteTeamById(Long id);

    List<FavoriteTeamDto> getAllFavoriteTeams();

    List<FavoriteTeamDto> getFavoriteTeamsByUserId(Long userId);

    Optional<FavoriteTeamDto> addFavoriteTeam(FavoriteTeamDto teamDto);

    void deleteFavoriteTeam(Long id);
}
