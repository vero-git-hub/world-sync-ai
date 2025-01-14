package org.example.worldsyncai.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import jakarta.validation.Valid;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.example.worldsyncai.dto.UserDto;


@Controller
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register(Model model) {
        model.addAttribute("registerUser", new UserDto());
        return "register";
    }

    @PostMapping("/register")
    public String handleRegister(@ModelAttribute("registerUser") @Valid UserDto userDto,
                                 BindingResult result,
                                 Model model) {
        if (result.hasErrors()) {
            log.error("Validation errors: {}", result.getAllErrors());
            return "register";
        }

        try {
            userService.addUser(userDto);
        } catch (Exception e) {
            log.error("Error while registering user: {}", e.getMessage());
            model.addAttribute("error", "Registration failed: " + e.getMessage());
            return "register";
        }

        return "redirect:/login";
    }
}