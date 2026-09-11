package com.example.Money_tracker.service;

import com.example.Money_tracker.model.Budget;
import com.example.Money_tracker.model.Expense;
import com.example.Money_tracker.repository.BudgetRepository;
import com.example.Money_tracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {
    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    public String checkBudgetStatus(String email, String category, String monthStr) {
        Optional<Budget> budgetOpt = budgetRepository.findByUserEmailAndCategoryAndMonth(email, category, monthStr);
        if (budgetOpt.isEmpty()) return "No budget set for " + category + " in " + monthStr;

        Double limit = budgetOpt.get().getLimitAmount();


        YearMonth targetMonth = YearMonth.parse(monthStr);


        List<Expense> expenses = expenseRepository.findByUserEmailAndCategory(email, category);

        Double actualSpending = expenses.stream()
                .filter(e -> {
                    YearMonth expenseMonth = YearMonth.from(e.getDate());
                    return expenseMonth.equals(targetMonth);
                })
                .mapToDouble(Expense::getAmount)
                .sum();


        if (actualSpending > limit) {
            return "⚠️ BUDGET EXCEEDED: You spent " + actualSpending + " on " + category + ". Limit was " + limit;
        } else {
            return "✅ ON TRACK: You have " + (limit - actualSpending) + " remaining for " + category + ".";
        }
    }
}