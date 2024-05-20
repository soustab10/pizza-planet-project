package com.example.project.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDbResp {
    public int order_item_id;
    public int order_id;
    public int pizza_id;
    public int crust_id;
    public int size_id;
    private String pizza_name;
    private String description;
    private double pizza_price;
    private String pizza_image_url;
    private String crust_name;
    private Double crust_price;
    private String size_name;
    private Double cost_multiplier;
    private float subtotal;
    public int quantity;

}
