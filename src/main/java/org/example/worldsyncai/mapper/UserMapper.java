package org.example.worldsyncai.mapper;

import org.example.worldsyncai.dto.FavoriteTeamDto;
import org.example.worldsyncai.dto.UserDto;
import org.example.worldsyncai.model.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    private final FavoriteTeamMapper favoriteTeamMapper;

    public UserMapper(FavoriteTeamMapper favoriteTeamMapper) {
        this.favoriteTeamMapper = favoriteTeamMapper;
    }

    public UserDto toDto(User user) {
        List<FavoriteTeamDto> favoriteTeamDtos = user.getFavoriteTeams()
                .stream()
                .map(favoriteTeamMapper::toDto)
                .collect(Collectors.toList());
        return new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getEmail(), favoriteTeamDtos);
    }

    public User toEntity(UserDto userDto) {
        User user = new User();
        user.setId(userDto.getId());
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());

        return user;
    }
}