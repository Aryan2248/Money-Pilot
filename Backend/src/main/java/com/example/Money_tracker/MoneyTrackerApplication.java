package com.example.Money_tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.example.Money_tracker"})
public class MoneyTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoneyTrackerApplication.class, args);
	}

}
