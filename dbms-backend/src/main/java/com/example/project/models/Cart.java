package com.example.project.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.relational.core.sql.In;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Cart {
    private Integer cart_id;
    private Integer user_id;
    private Pizza pizza;
    private Integer quantity;
    private PizzaCrust pizzaCrust;
    private PizzaSize pizzaSize;
    private float price;
    private String identifier;
    public List<Toppings> toppings;

    public void calculatePrice(){
        float sum=0;
        sum+=this.getPizza().getPrice();
        sum+=this.getPizzaCrust().getPrice();
        for(int i=0;i<toppings.size();i++){
           var topping=toppings.get(i);
            sum+=topping.getPrice();
        }
        sum*=this.getPizzaSize().getCost_multiplier();
        sum*=this.getQuantity();
        this.price=sum;
    }
    public Cart(CartItemDbResp cartItemDbResp){
        this.cart_id=cartItemDbResp.getCart_id();
        this.user_id=cartItemDbResp.getUser_id();
        Pizza pizza=new Pizza();
        pizza.setPizza_id(cartItemDbResp.getPizza_id());
        pizza.setPizza_name(cartItemDbResp.getPizza_name());
        pizza.setDescription(cartItemDbResp.getDescription());
        pizza.setPrice(cartItemDbResp.getPizza_price());
        pizza.setPizza_image_url(cartItemDbResp.getPizza_image_url());
        this.pizza=pizza;
        PizzaCrust crust=new PizzaCrust();
        crust.setCrust_id(cartItemDbResp.getCrust_id());
        crust.setCrust_name(cartItemDbResp.getCrust_name());
        crust.setPrice(cartItemDbResp.getCrust_price());
        this.pizzaCrust=crust;
        PizzaSize size=new PizzaSize();
        size.setSize_id(cartItemDbResp.getSize_id());
        size.setSize_name(cartItemDbResp.getSize_name());
        size.setCost_multiplier(cartItemDbResp.getCost_multiplier());
        this.pizzaSize=size;
        this.quantity=cartItemDbResp.getQuantity();
        this.identifier=cartItemDbResp.getIdentifier();
    }
}
