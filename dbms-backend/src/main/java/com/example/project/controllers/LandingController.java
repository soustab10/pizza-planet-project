package com.example.project.controllers;

import com.example.project.dao.PizzaCrustDao;
import com.example.project.dao.PizzaDao;
import com.example.project.dao.PizzaSizeDao;
import com.example.project.dao.ToppingsDao;
import com.example.project.models.Pizza;
import com.example.project.models.PizzaCrust;
import com.example.project.models.PizzaSize;
import com.example.project.models.Toppings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/landing")
public class LandingController {
    @Autowired
    PizzaDao pizzaDao;
    @Autowired
    PizzaCrustDao pizzaCrustDao;
    @Autowired
    PizzaSizeDao pizzaSizeDao;
    @Autowired
    ToppingsDao toppingsDao;
    @GetMapping("/pizza")
    public ResponseEntity<List<Pizza>> getPizza(){
        List<Pizza> p=pizzaDao.getAll();
        return new ResponseEntity<>(p, HttpStatus.OK);
    }
    @GetMapping("/pizza-crust")
    public ResponseEntity<List<PizzaCrust>> getPizzaCrust(){
        List<PizzaCrust> p=pizzaCrustDao.getAll();
        return new ResponseEntity<>(p, HttpStatus.OK);
    }
    @GetMapping("/pizza-size")
    public ResponseEntity<List<PizzaSize>> getPizzaSize(){
        List<PizzaSize> p=pizzaSizeDao.getAll();
        return new ResponseEntity<>(p, HttpStatus.OK);
    }
    @GetMapping("/topping")
    public ResponseEntity<List<Toppings>> getToppings(){
        List<Toppings> t=toppingsDao.getAll();
        return new ResponseEntity<>(t,HttpStatus.OK);
    }
}
