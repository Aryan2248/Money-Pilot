package com.example.Money_tracker.controller;

import com.example.Money_tracker.model.Budget;
import com.example.Money_tracker.repository.BudgetRepository;
import com.example.Money_tracker.service.BudgetService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private BudgetRepository budgetRepository;
    //to set the budget
    @PostMapping("/set")
    public ResponseEntity<String> setBudget(
            @RequestBody Budget budget
    ) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        budget.setUserEmail(email);

        budgetRepository.save(budget);

        return ResponseEntity.ok(
                "Budget set successfully!"
        );
    }


    // this will check budget status
    @GetMapping("/status/{category}")
    public ResponseEntity<String> getStatus(
            @PathVariable String category
    ) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();


        String currentMonth = YearMonth.now().toString();

        return ResponseEntity.ok(
                budgetService.checkBudgetStatus(
                        email,
                        category,
                        currentMonth
                )
        );
    }
}