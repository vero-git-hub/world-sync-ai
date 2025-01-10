package org.example.worldsyncai.mapper;

import org.example.worldsyncai.dto.FavoriteTeamDto;
import org.example.worldsyncai.model.FavoriteTeam;
import org.example.worldsyncai.model.User;
import org.springframework.stereotype.Component;

@Component
public class FavoriteTeamMapper {

    public FavoriteTeamDto toDto(FavoriteTeam favoriteTeam) {
        return new FavoriteTeamDto(favoriteTeam.getId(), favoriteTeam.getTeamName(), favoriteTeam.getUser().getId());
    }

    public FavoriteTeam toEntity(FavoriteTeamDto favoriteTeamDto, User user) {
        FavoriteTeam favoriteTeam = new FavoriteTeam();
        favoriteTeam.setId(favoriteTeamDto.id());
        favoriteTeam.setTeamName(favoriteTeamDto.teamName());
        favoriteTeam.setUser(user);
        return favoriteTeam;
    }
}