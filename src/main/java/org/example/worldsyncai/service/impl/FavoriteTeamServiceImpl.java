package org.example.worldsyncai.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.worldsyncai.dto.FavoriteTeamDto;
import org.example.worldsyncai.exception.UserNotFoundException;
import org.example.worldsyncai.mapper.FavoriteTeamMapper;
import org.example.worldsyncai.model.FavoriteTeam;
import org.example.worldsyncai.model.User;
import org.example.worldsyncai.repository.FavoriteTeamRepository;
import org.example.worldsyncai.repository.UserRepository;
import org.example.worldsyncai.service.FavoriteTeamService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteTeamServiceImpl implements FavoriteTeamService {

    private final FavoriteTeamRepository favoriteTeamRepository;
    private final UserRepository userRepository;
    private final FavoriteTeamMapper favoriteTeamMapper;

    @Override
    public List<FavoriteTeamDto> getFavoriteTeamsByUserId(Long userId) {
        return favoriteTeamRepository.findByUserId(userId)
                .stream()
                .map(favoriteTeamMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void addFavoriteTeams(Long userId, List<String> teamNames) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        teamNames.forEach(teamName -> {
            if (!favoriteTeamRepository.existsByTeamNameAndUserId(teamName, userId)) {
                FavoriteTeam favoriteTeam = new FavoriteTeam();
                favoriteTeam.setTeamName(teamName);
                favoriteTeam.setUser(user);
                favoriteTeamRepository.save(favoriteTeam);
            }
        });
    }

    @Override
    @Transactional
    public void removeFavoriteTeams(Long userId, List<String> teamNames) {
        if (teamNames == null || teamNames.isEmpty()) {
            throw new IllegalArgumentException("No team names provided for removal.");
        }

        List<FavoriteTeam> teamsToRemove = favoriteTeamRepository.findByTeamNameInAndUserId(teamNames, userId);
        if (teamsToRemove.isEmpty()) {
            throw new IllegalArgumentException("No matching teams found for removal.");
        }

        favoriteTeamRepository.deleteAll(teamsToRemove);
    }
}