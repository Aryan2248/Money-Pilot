package com.example.Money_tracker.controller;

import com.example.Money_tracker.model.User;
import com.example.Money_tracker.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @GetMapping("/info")
    public ResponseEntity<User> getWalletInfo() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(walletService.getUserData(email));
    }

    @PostMapping("/add-income")
    public ResponseEntity<User> addIncome(@RequestBody Map<String, Object> payload) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Double amount = Double.parseDouble(payload.get("amount").toString());
        Double savingsPercent = Double.parseDouble(payload.get("savingsPercent").toString());

        return ResponseEntity.ok(walletService.addIncome(email, amount, savingsPercent));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<User> withdraw(@RequestBody Map<String, Object> payload) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Double amount = Double.parseDouble(payload.get("amount").toString());

        return ResponseEntity.ok(walletService.emergencyWithdraw(email, amount));
    }
}