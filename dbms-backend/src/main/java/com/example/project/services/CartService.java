package com.example.project.services;

import com.example.project.models.Cart;
import com.example.project.models.User;

import java.util.List;
import java.util.Optional;


public interface CartService {
    Optional<List<Cart>> getAllItemsInCart(User user);
    String insertPizza(Cart cart);


    String updatePizzaQuantity(Cart cart);
    String removePizza(Cart cart);
}
