package org.example.worldsyncai.controller.schedule;

import lombok.RequiredArgsConstructor;
import org.example.worldsyncai.dto.FavoriteTeamDto;
import org.example.worldsyncai.dto.FavoriteTeamsUpdateRequest;
import org.example.worldsyncai.exception.UserNotFoundException;
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

    /**
     * Get the user's favorite teams.
     *
     * @param userId The user's ID.
     * @return a list of favorite teams.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FavoriteTeamDto>> getFavoriteTeamsByUserId(@PathVariable Long userId) {
        List<FavoriteTeamDto> teams = favoriteTeamService.getFavoriteTeamsByUserId(userId);
        return teams.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(teams);
    }

    /**
     * Update the user's favorite teams list.
     *
     * @param userId User ID.
     * @param request Data to update (add or remove teams).
     * @return operation status.
     */
    @PostMapping("/user/{userId}/update")
    public ResponseEntity<?> updateFavoriteTeams(
            @PathVariable Long userId,
            @RequestBody FavoriteTeamsUpdateRequest request) {
        try {
            if ("add".equalsIgnoreCase(request.getAction())) {
                favoriteTeamService.addFavoriteTeams(userId, request.getTeamNames());
            } else if ("remove".equalsIgnoreCase(request.getAction())) {
                if (request.getTeamNames() == null || request.getTeamNames().isEmpty()) {
                    return ResponseEntity.badRequest().body("No teams provided for removal.");
                }
                favoriteTeamService.removeFavoriteTeams(userId, request.getTeamNames());
            } else {
                return ResponseEntity.badRequest().body("Invalid action. Use 'add' or 'remove'.");
            }
            return ResponseEntity.ok("Favorite teams updated successfully.");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating favorite teams: " + e.getMessage());
        }
    }
}