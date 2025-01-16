package org.example.worldsyncai.service;

import org.example.worldsyncai.dto.UserDto;
import org.example.worldsyncai.model.User;

import java.util.Optional;

public interface UserService {

    Optional<UserDto> getUserById(Long id);

    Optional<UserDto> getUserByUsername(String username);

    Optional<UserDto> addUser(UserDto userDto);

    Optional<UserDto> updateUser(Long id, UserDto userDto);

    void deleteUser(Long id);

    void updateUserCalendarTokens(Long userId, String accessToken, String refreshToken);

    String getUserCalendarToken(Long userId);

    Optional<User> findUserEntityById(Long id);
}