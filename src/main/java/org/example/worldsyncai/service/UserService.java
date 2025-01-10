package org.example.worldsyncai.service;

import org.example.worldsyncai.dto.UserDto;

import java.util.Optional;

public interface UserService {

    Optional<UserDto> getUserById(Long id);

    Optional<UserDto> getUserByUsername(String username);

    Optional<UserDto> addUser(UserDto userDto);

    Optional<UserDto> updateUser(Long id, UserDto userDto);

    void deleteUser(Long id);
}