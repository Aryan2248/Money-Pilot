package com.example.Money_tracker.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static class OtpEntry {
        String otp;
        long expiryTime;
        OtpEntry(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }

    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    private static final long OTP_VALID_MS = 5 * 60 * 1000; // 5 minutes
    private final SecureRandom random = new SecureRandom();

    public String generateOtp(String email) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        otpStore.put(email, new OtpEntry(otp, System.currentTimeMillis() + OTP_VALID_MS));
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        OtpEntry entry = otpStore.get(email);
        if (entry == null) return false;
        if (System.currentTimeMillis() > entry.expiryTime) {
            otpStore.remove(email);
            return false;
        }
        return entry.otp.equals(otp);
    }

    public void clearOtp(String email) {
        otpStore.remove(email);
    }
}