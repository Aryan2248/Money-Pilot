package com.example.Money_tracker.repository;

import com.example.Money_tracker.model.Expense;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends MongoRepository<Expense, String> {


    List<Expense> findByUserEmail(String userEmail);

    List<Expense> findByUserEmailAndCategory(String userEmail, String category);
    List<Expense> findByUserEmailAndDateBetween(
            String email,
            LocalDate start,
            LocalDate end
    );
}