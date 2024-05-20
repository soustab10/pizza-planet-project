package com.example.project.models;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ToppingsCartDbResp {
    private Integer cart_id;
    private Integer topping_id;
    private String topping_name;
    private Double price;

}
