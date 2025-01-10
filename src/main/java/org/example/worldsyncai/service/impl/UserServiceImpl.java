package org.example.worldsyncai.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.worldsyncai.dto.UserDto;
import org.example.worldsyncai.mapper.UserMapper;
import org.example.worldsyncai.model.User;
import org.example.worldsyncai.repository.UserRepository;
import org.example.worldsyncai.service.UserService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

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
        return userRepository.findByUsername(userDto.username())
                .map(existingUser -> Optional.<UserDto>empty())
                .orElseGet(() -> {
                    User user = userMapper.toEntity(userDto);
                    User savedUser = userRepository.save(user);
                    return Optional.of(userMapper.toDto(savedUser));
                });
    }

    @Override
    public Optional<UserDto> updateUser(Long id, UserDto userDto) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setUsername(userDto.username());
                    existingUser.setEmail(userDto.email());
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
}