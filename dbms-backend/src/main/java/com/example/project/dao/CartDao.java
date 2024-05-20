package com.example.project.dao;

import com.example.project.models.Cart;
import com.example.project.models.User;

import java.util.List;
import java.util.Optional;

public interface CartDao {



    Integer insertToppings(Cart cart,Integer topping);

    Integer insertPizza(Cart cart);
    Optional<List<Cart>> getAllItemsInCart(int id);
    List<Cart> getCartId(String identifier);
    int updateQuantity(Cart cart);
    int removeItemFromCart(Cart cart);
}
