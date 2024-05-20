package com.example.project.models;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.relational.core.sql.In;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ToppingsDbResp {
    private Integer order_item_id;
    private Integer topping_id;
    private String topping_name;
    private Double price;

}
