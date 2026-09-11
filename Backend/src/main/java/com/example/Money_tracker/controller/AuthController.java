package com.example.Money_tracker.controller;

import com.example.Money_tracker.dto.ResetPasswordRequest;
import com.example.Money_tracker.model.User;
import com.example.Money_tracker.repository.UserRepository;
import com.example.Money_tracker.security.JwtUtil;
import com.example.Money_tracker.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OtpService otpService; // NEW

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().isBlank() ||
                user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Error: Email and password are required");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email already exists!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User Registered Successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            return ResponseEntity.status(401).body("Invalid password");
        }
        String token = jwtUtil.generateToken(existingUser.getEmail());
        return ResponseEntity.ok(token);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Error: Email is required");
        }

        if (userRepository.findByEmail(email).isEmpty()) {
            return ResponseEntity.badRequest().body("Error: No account found with this email");
        }

        String otp = otpService.generateOtp(email);

        // OTP is returned directly since no email provider is configured.
        return ResponseEntity.ok(Map.of(
                "message", "OTP generated (demo mode — shown here instead of emailed)",
                "otp", otp
        ));
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank() ||
                request.getOtp() == null || request.getOtp().isBlank() ||
                request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Error: Email, OTP and new password are required");
        }

        if (!otpService.validateOtp(request.getEmail(), request.getOtp())) {
            return ResponseEntity.badRequest().body("Error: Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No account found with this email"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        otpService.clearOtp(request.getEmail());

        return ResponseEntity.ok("Password reset successfully. Please login with your new password.");
    }
}