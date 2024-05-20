package com.example.project.models;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Coupons {
    private Integer coupon_id;
    private String coupon_code;
    private Double ActivationPrice;
    private Double DiscountPrice;
}
