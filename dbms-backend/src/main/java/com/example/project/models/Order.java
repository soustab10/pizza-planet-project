package com.example.project.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    public int order_id;
    public Customer customer;
    public Kitchen kitchen;
    public DeliveryPartner partner;
    public Transaction transaction;
    public Timestamp order_date;
    public float total_amount;
    public String delivery_status;
    public Order(OrderDbResp orderDbResp,Customer customer,Kitchen kitchen,DeliveryPartner partner,Transaction transaction){
        this.order_id=orderDbResp.getOrder_id();
        this.order_date=orderDbResp.getOrder_timestamp();
        this.total_amount=orderDbResp.getTotal_amount();
        this.delivery_status=orderDbResp.getDelivery_status();
        this.customer=customer;
        this.partner=partner;
        this.kitchen=kitchen;
        this.transaction=transaction;
    }
}
