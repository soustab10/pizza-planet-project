package com.example.project;

import com.example.project.dao.CartDaoImpl;
import com.example.project.dao.UserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@AutoConfiguration
@SpringBootApplication
public class PizzaplanetApplication  {

	public static void main(String[] args) {
		SpringApplication.run(PizzaplanetApplication.class, args);

	}

}