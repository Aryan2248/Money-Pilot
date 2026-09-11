package com.example.Money_tracker.service;

import com.example.Money_tracker.model.User;
import com.example.Money_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WalletService {

    @Autowired
    private UserRepository userRepository;

    public User addIncome(String email, Double amount, Double savingsPercent) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        double toSavings = amount * (savingsPercent / 100);
        double toBalance = amount - toSavings;

        user.setTotalIncome(user.getTotalIncome() + amount);
        user.setRemainingBalance(user.getRemainingBalance() + toBalance);
        user.setSavings(user.getSavings() + toSavings);

        return userRepository.save(user);
    }

    public User emergencyWithdraw(String email, Double amount) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getSavings() < amount) {
            throw new RuntimeException("Insufficient Savings!");
        }

        user.setSavings(user.getSavings() - amount);
        user.setRemainingBalance(user.getRemainingBalance() + amount);

        return userRepository.save(user);
    }

    public User getUserData(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}