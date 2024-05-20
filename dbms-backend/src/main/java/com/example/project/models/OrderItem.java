package com.example.project.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    public int order_item_id;
    public int order_id;
    public Pizza pizza;
    public float subtotal;
    public PizzaCrust crust;
    public PizzaSize size;
    public int quantity;
    public List<Toppings> toppings;

    public OrderItem(Cart cart,int order_id){
        this.order_id=order_id;
        this.pizza=cart.getPizza();
        this.subtotal=cart.getPrice();
        this.crust=cart.getPizzaCrust();
        this.size=cart.getPizzaSize();
        this.quantity=cart.getQuantity();
        this.toppings=cart.getToppings();

    }
    public OrderItem(OrderItemDbResp orderItemDbResp){
        this.order_id=orderItemDbResp.getOrder_id();
        this.order_item_id=orderItemDbResp.getOrder_item_id();
        Pizza pizza=new Pizza();
        pizza.setPizza_id(orderItemDbResp.getPizza_id());
        pizza.setPizza_name(orderItemDbResp.getPizza_name());
        pizza.setDescription(orderItemDbResp.getDescription());
        pizza.setPrice(orderItemDbResp.getPizza_price());
        pizza.setPizza_image_url(orderItemDbResp.getPizza_image_url());
        this.pizza=pizza;
        PizzaCrust crust=new PizzaCrust();
        crust.setCrust_id(orderItemDbResp.getCrust_id());
        crust.setCrust_name(orderItemDbResp.getCrust_name());
        crust.setPrice(orderItemDbResp.getCrust_price());
        this.crust=crust;
        PizzaSize size=new PizzaSize();
        size.setSize_id(orderItemDbResp.getSize_id());
        size.setSize_name(orderItemDbResp.getSize_name());
        size.setCost_multiplier(orderItemDbResp.getCost_multiplier());
        this.size=size;
        this.quantity=orderItemDbResp.getQuantity();
        this.subtotal=orderItemDbResp.getSubtotal();
    }
}

