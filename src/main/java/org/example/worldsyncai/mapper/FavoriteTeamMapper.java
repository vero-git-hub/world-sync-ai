package org.example.worldsyncai.mapper;

import org.example.worldsyncai.dto.FavoriteTeamDto;
import org.example.worldsyncai.model.FavoriteTeam;
import org.springframework.stereotype.Component;

@Component
public class FavoriteTeamMapper {

    public FavoriteTeamDto toDto(FavoriteTeam favoriteTeam) {
        return new FavoriteTeamDto(favoriteTeam.getId(), favoriteTeam.getTeamName(), favoriteTeam.getUserId());
    }

    public FavoriteTeam toEntity(FavoriteTeamDto favoriteTeamDto) {
        FavoriteTeam favoriteTeam = new FavoriteTeam();
        favoriteTeam.setTeamName(favoriteTeamDto.teamName());
        favoriteTeam.setUserId(favoriteTeamDto.userId());
        return favoriteTeam;
    }
}