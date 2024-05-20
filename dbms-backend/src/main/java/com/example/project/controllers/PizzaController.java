package com.example.project.controllers;


import com.example.project.models.Pizza;
import com.example.project.models.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pizza")
public class PizzaController {
    @PostMapping("/addPizza")
    ResponseEntity<String> addPizza(@RequestBody Pizza pizza, @RequestAttribute("user") User user){

        return null;
    }
}