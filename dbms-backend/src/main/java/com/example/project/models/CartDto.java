package com.example.project.models;

import com.example.project.models.Cart;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Optional;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartDto {
    int user_id;
    double grand_total;
    List<Cart> cart_items;
    public double calculateTotal(){
        double res=0;
        for(var cart_item:this.getCart_items()){
            res+=cart_item.getPrice();
        }
        return res;
    }
}


