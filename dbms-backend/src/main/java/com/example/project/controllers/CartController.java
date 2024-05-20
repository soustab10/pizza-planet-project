package com.example.project.controllers;

import com.example.project.dao.UserDAO;
import com.example.project.models.Cart;
import com.example.project.models.User;
import com.example.project.services.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    UserDAO userDAO;


    @Autowired
    CartService cartService;

    @GetMapping("")
    ResponseEntity<List<Cart>> getAllItems(@RequestAttribute("user") User user){

        var cart=this.cartService.getAllItemsInCart(user).get();
        System.out.println(cart);
        if(cart.isEmpty()){
            return new ResponseEntity<>(new ArrayList<Cart>(),HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @PostMapping("/remove-all")
    ResponseEntity<String> emptyCart(@RequestAttribute("user") User user){
        var cart=cartService.getAllItemsInCart(user).get();
        System.out.println(cart);
        if(cart.isEmpty()){
            return new ResponseEntity<>("Cart is Empty",HttpStatus.NO_CONTENT);
        }
        for(var cartitem:cart){
            cartService.removePizza(cartitem);
        }
        return new ResponseEntity<>("Cart cleared",HttpStatus.OK);
    }

    @PostMapping("/add")
    ResponseEntity<String> addPizza(@RequestBody Cart cart, @RequestAttribute("user") User user){
        System.out.println(cart);
        cart.setUser_id(user.getId());
        String response = this.cartService.insertPizza(cart);
        return new ResponseEntity<>(response, HttpStatus.CREATED);

    }
    @PostMapping("/update")
    ResponseEntity<String> updatePizzaQuantity(@RequestBody Cart cart, @RequestAttribute("user") User user){
        cart.setUser_id(user.getId());
        String response = this.cartService.updatePizzaQuantity(cart);
        return new ResponseEntity<>(response, HttpStatus.CREATED);

    }
    @PostMapping("/delete")
    ResponseEntity<String> deletePIzza(@RequestBody Cart cart, @RequestAttribute("user") User user){
        cart.setUser_id(user.getId());
        String response = this.cartService.removePizza(cart);
        return new ResponseEntity<>(response, HttpStatus.CREATED);

    }


}
