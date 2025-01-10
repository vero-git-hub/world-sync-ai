package org.example.worldsyncai.dto;

import java.util.List;

public record UserDto(Long id, String username, String email, List<FavoriteTeamDto> favoriteTeams) {
}