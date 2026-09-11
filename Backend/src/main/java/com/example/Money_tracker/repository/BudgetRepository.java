package com.example.Money_tracker.repository;

import com.example.Money_tracker.model.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface BudgetRepository extends MongoRepository<Budget, String> {
    Optional<Budget> findByUserEmailAndCategoryAndMonth(String email, String category, String month);
}