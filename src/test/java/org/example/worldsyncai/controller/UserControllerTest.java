package org.example.worldsyncai.controller;

import org.example.worldsyncai.dto.UserDto;
import org.example.worldsyncai.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @Test
    public void testGetUserById_Success() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        Long userId = 1L;
        UserDto userDto = new UserDto(userId, "john_doe", "john.doe@example.com", List.of());

        when(userService.getUserById(userId)).thenReturn(Optional.of(userDto));

        mockMvc.perform(get("/api/users/{id}", userId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(userId))
                .andExpect(jsonPath("$.username").value("john_doe"));
    }

    @Test
    public void testGetUserById_NotFound() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        Long userId = 1L;

        when(userService.getUserById(userId)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/{id}", userId))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testGetUserByUsername_Success() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        String username = "john_doe";
        UserDto userDto = new UserDto(1L, username, "john.doe@example.com", List.of());

        when(userService.getUserByUsername(username)).thenReturn(Optional.of(userDto));

        mockMvc.perform(get("/api/users/username/{username}", username))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username").value(username));
    }

    @Test
    public void testGetUserByUsername_NotFound() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        String username = "john_doe";

        when(userService.getUserByUsername(username)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/username/{username}", username))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testAddUser_Success() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        UserDto newUser = new UserDto(null, "john_doe", "john.doe@example.com", List.of());
        UserDto savedUser = new UserDto(1L, "john_doe", "john.doe@example.com", List.of());

        when(userService.addUser(any())).thenReturn(Optional.of(savedUser));

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"john_doe\",\"email\":\"john.doe@example.com\",\"favoriteTeams\":[]}"))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("john_doe"));
    }

    @Test
    public void testAddUser_Conflict() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        UserDto newUser = new UserDto(null, "john_doe", "john.doe@example.com", List.of());

        when(userService.addUser(any())).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"john_doe\",\"email\":\"john.doe@example.com\",\"favoriteTeams\":[]}"))
                .andExpect(status().isConflict());
    }

    @Test
    public void testUpdateUser_Success() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        Long userId = 1L;
        UserDto updatedUser = new UserDto(userId, "updated_doe", "updated.doe@example.com", List.of());

        when(userService.updateUser(eq(userId), any())).thenReturn(Optional.of(updatedUser));

        mockMvc.perform(put("/api/users/{id}", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"updated_doe\",\"email\":\"updated.doe@example.com\",\"favoriteTeams\":[]}"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username").value("updated_doe"));
    }

    @Test
    public void testUpdateUser_NotFound() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        Long userId = 1L;

        when(userService.updateUser(eq(userId), any())).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/users/{id}", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"updated_doe\",\"email\":\"updated.doe@example.com\",\"favoriteTeams\":[]}"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testDeleteUser_Success() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        Long userId = 1L;

        doNothing().when(userService).deleteUser(userId);

        mockMvc.perform(delete("/api/users/{id}", userId))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testDeleteUser_NotFound() throws Exception {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        Long userId = 1L;

        doThrow(new RuntimeException("User not found")).when(userService).deleteUser(userId);

        mockMvc.perform(delete("/api/users/{id}", userId))
                .andExpect(status().isNotFound());
    }
}