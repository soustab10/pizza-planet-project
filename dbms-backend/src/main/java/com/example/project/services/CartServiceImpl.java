package com.example.project.services;

import com.example.project.dao.CartDao;
import com.example.project.models.Cart;
import com.example.project.models.Toppings;
import com.example.project.models.User;
import com.example.project.models.CartDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    CartDao cartDao;
    @Override
    public Optional<List<Cart>> getAllItemsInCart(User user) {
        var cart=cartDao.getAllItemsInCart(user.getId());
        CartDto cartDto=new CartDto();
        cartDto.setUser_id(user.getId());
        cartDto.setCart_items(cart.stream().findFirst().orElse(null));
        cartDto.setGrand_total(cartDto.calculateTotal());
        return cart;
    }

    @Override
    public String insertPizza(Cart cart) {

        try{
            String identifier=getIdentifier(cart);
            cart.setIdentifier(identifier);

            if(!cartDao.getCartId(identifier).isEmpty()){
                return "pizza exists";
            }
            cart.setCart_id(cartDao.insertPizza(cart));
            List<Toppings> toppings=cart.getToppings();
            for(var topping :toppings){
            this.cartDao.insertToppings(cart,topping.getTopping_id());}
            return "pizza inserted successfully!";
        }catch (Exception e){
            System.out.println(e);
        }
        return null;
    }



    @Override
    public String updatePizzaQuantity(Cart cart) {
        try{
            this.cartDao.updateQuantity(cart);
            return "quantity updated successfully";

        }catch (Exception e){
            System.out.println(e);
        }
        return null;
    }

    @Override
    public String removePizza(Cart cart) {
        try{
            this.cartDao.removeItemFromCart(cart);
            return "pizza removed successfully";
        }catch (Exception e){
            System.out.println(e);
        }
        return null;
    }


    public String getIdentifier(Cart cart){
        List<Toppings> toppings=cart.getToppings();
        List<Integer> topping_id=new ArrayList<Integer>();
        for (var toppingid:toppings){
            topping_id.add(toppingid.getTopping_id());
        }
        Collections.sort(topping_id);
        StringBuilder s= new StringBuilder(cart.getUser_id() + "-" + cart.getPizza().getPizza_id() + "-" + cart.getPizzaCrust().getCrust_id() + "-" + cart.getPizzaSize().getSize_id());
        for(var topping:topping_id){
            s.append("-").append(topping);
        }
        System.out.println(s);
        return s.toString();

    }
}
