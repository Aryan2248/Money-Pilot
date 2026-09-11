package com.example.Money_tracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "budgets")
public class Budget {
    @Id
    private String id;
    private String userEmail;
    private String category;
    private Double limitAmount;
    private String month; // Format: "2026-04"

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Double getLimitAmount() { return limitAmount; }
    public void setLimitAmount(Double limitAmount) { this.limitAmount = limitAmount; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
}