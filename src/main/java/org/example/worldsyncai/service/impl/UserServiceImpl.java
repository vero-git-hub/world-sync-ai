package org.example.worldsyncai.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.dto.UserDto;
import org.example.worldsyncai.mapper.UserMapper;
import org.example.worldsyncai.model.User;
import org.example.worldsyncai.repository.UserRepository;
import org.example.worldsyncai.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Optional<UserDto> getUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDto);
    }

    @Override
    public Optional<UserDto> getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(userMapper::toDto);
    }

    @Override
    public Optional<UserDto> addUser(UserDto userDto) {
        if (userRepository.findByUsername(userDto.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists.");
        }

        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists.");
        }

        User user = userMapper.toEntity(userDto);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        User savedUser = userRepository.save(user);
        return Optional.of(userMapper.toDto(savedUser));
    }

    @Override
    public Optional<UserDto> updateUser(Long id, UserDto userDto) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setUsername(userDto.getUsername());
                    existingUser.setEmail(userDto.getEmail());
                    if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
                        existingUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
                    }
                    User updatedUser = userRepository.save(existingUser);
                    return userMapper.toDto(updatedUser);
                });
    }

    @Override
    public void deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new RuntimeException("User not found with id: " + id);
        }
    }

    @Override
    public void updateUserCalendarToken(Long userId, String accessToken) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setGoogleCalendarAccessToken(accessToken);
            userRepository.save(user);
        });
    }

    @Override
    public String getUserCalendarToken(Long userId) {
        return userRepository.findById(userId)
                .map(User::getGoogleCalendarAccessToken)
                .orElse(null);
    }
}