package org.example.worldsyncai.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.worldsyncai.dto.FavoriteTeamDto;
import org.example.worldsyncai.exception.FavoriteTeamNotFoundException;
import org.example.worldsyncai.mapper.FavoriteTeamMapper;
import org.example.worldsyncai.model.FavoriteTeam;
import org.example.worldsyncai.repository.FavoriteTeamRepository;
import org.example.worldsyncai.service.FavoriteTeamService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteTeamServiceImpl implements FavoriteTeamService {

    private final FavoriteTeamRepository favoriteTeamRepository;
    private final FavoriteTeamMapper favoriteTeamMapper;

    @Override
    public Optional<FavoriteTeamDto> getFavoriteTeamById(Long id) {
        return favoriteTeamRepository.findById(id)
                .map(favoriteTeamMapper::toDto);
    }

    @Override
    public List<FavoriteTeamDto> getAllFavoriteTeams() {
        return favoriteTeamRepository.findAll()
                .stream()
                .map(favoriteTeamMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FavoriteTeamDto> getFavoriteTeamsByUserId(Long userId) {
        return favoriteTeamRepository.findByUserId(userId)
                .stream()
                .map(favoriteTeamMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<FavoriteTeamDto> addFavoriteTeam(FavoriteTeamDto teamDto) {
        if (favoriteTeamRepository.existsByTeamNameAndUserId(teamDto.teamName(), teamDto.userId())) {
            return Optional.empty();
        }

        FavoriteTeam team = favoriteTeamMapper.toEntity(teamDto);
        FavoriteTeam savedTeam = favoriteTeamRepository.save(team);
        return Optional.of(favoriteTeamMapper.toDto(savedTeam));
    }

    @Override
    public void deleteFavoriteTeam(Long id) {
        favoriteTeamRepository.findById(id)
                .ifPresentOrElse(
                        favoriteTeamRepository::delete,
                        () -> {
                            throw new FavoriteTeamNotFoundException("Favorite team not found with id: " + id);
                        }
                );
    }
}