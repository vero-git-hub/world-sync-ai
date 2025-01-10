package org.example.worldsyncai.controller;

import org.example.worldsyncai.dto.FavoriteTeamDto;
import org.example.worldsyncai.service.FavoriteTeamService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;


@ExtendWith(MockitoExtension.class)
public class FavoriteTeamControllerTest {

    private MockMvc mockMvc;

    @Mock
    private FavoriteTeamService favoriteTeamService;

    @InjectMocks
    private FavoriteTeamController favoriteTeamController;

    @Test
    public void testGetFavoriteTeamById_Success() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(favoriteTeamController).build();

        Long teamId = 1L;
        FavoriteTeamDto teamDto = new FavoriteTeamDto(teamId, "Los Angeles Dodgers", 1L);

        when(favoriteTeamService.getFavoriteTeamById(teamId)).thenReturn(Optional.of(teamDto));

        mockMvc.perform(get("/api/favorite-teams/{id}", teamId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(teamId))
                .andExpect(jsonPath("$.teamName").value("Los Angeles Dodgers"));
    }

    @Test
    public void testGetFavoriteTeamById_NotFound() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(favoriteTeamController).build();

        Long teamId = 1L;

        when(favoriteTeamService.getFavoriteTeamById(teamId)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/favorite-teams/{id}", teamId))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetAllFavoriteTeams_Success() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(favoriteTeamController).build();

        List<FavoriteTeamDto> teams = List.of(
                new FavoriteTeamDto(1L, "Los Angeles Dodgers", 1L),
                new FavoriteTeamDto(2L, "New York Yankees", 1L)
        );

        when(favoriteTeamService.getAllFavoriteTeams()).thenReturn(teams);

        mockMvc.perform(get("/api/favorite-teams"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].teamName").value("Los Angeles Dodgers"))
                .andExpect(jsonPath("$[1].teamName").value("New York Yankees"));
    }

    @Test
    public void testAddFavoriteTeam_Success() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(favoriteTeamController).build();

        FavoriteTeamDto newTeam = new FavoriteTeamDto(null, "Boston Red Sox", 1L);
        FavoriteTeamDto savedTeam = new FavoriteTeamDto(1L, "Boston Red Sox", 1L);

        when(favoriteTeamService.addFavoriteTeam(any())).thenReturn(Optional.of(savedTeam));

        mockMvc.perform(post("/api/favorite-teams")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"teamName\":\"Boston Red Sox\",\"userId\":1}"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.teamName").value("Boston Red Sox"));
    }

    @Test
    public void testAddFavoriteTeam_Conflict() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(favoriteTeamController).build();

        when(favoriteTeamService.addFavoriteTeam(any())).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/favorite-teams")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"teamName\":\"Boston Red Sox\",\"userId\":1}"))
                .andExpect(status().isConflict());
    }

    @Test
    public void testDeleteFavoriteTeam_Success() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(favoriteTeamController).build();

        Long teamId = 1L;

        doNothing().when(favoriteTeamService).deleteFavoriteTeam(teamId);

        mockMvc.perform(delete("/api/favorite-teams/{id}", teamId))
                .andExpect(status().isOk());
    }

    @Test
    public void testDeleteFavoriteTeam_NotFound() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(favoriteTeamController).build();

        Long teamId = 1L;

        doThrow(new RuntimeException("Team not found")).when(favoriteTeamService).deleteFavoriteTeam(teamId);

        mockMvc.perform(delete("/api/favorite-teams/{id}", teamId))
                .andExpect(status().isNotFound());
    }
}