package org.example.worldsyncai.controller;

import lombok.RequiredArgsConstructor;
import org.example.worldsyncai.dto.FavoriteTeamDto;
import org.example.worldsyncai.service.FavoriteTeamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorite-teams")
@RequiredArgsConstructor
public class FavoriteTeamController {

    private final FavoriteTeamService favoriteTeamService;

    @GetMapping("/{id}")
    public ResponseEntity<FavoriteTeamDto> getFavoriteTeamById(@PathVariable Long id) {
        return favoriteTeamService.getFavoriteTeamById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<FavoriteTeamDto>> getFavoriteTeams() {
        List<FavoriteTeamDto> teams = favoriteTeamService.getAllFavoriteTeams();
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FavoriteTeamDto>> getFavoriteTeamsByUserId(@PathVariable Long userId) {
        List<FavoriteTeamDto> teams = favoriteTeamService.getFavoriteTeamsByUserId(userId);
        return teams.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(teams);
    }

    @PostMapping
    public ResponseEntity<FavoriteTeamDto> addFavoriteTeam(@RequestBody FavoriteTeamDto teamDto) {
        return favoriteTeamService.addFavoriteTeam(teamDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFavoriteTeam(@PathVariable Long id) {
        try {
            favoriteTeamService.deleteFavoriteTeam(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}