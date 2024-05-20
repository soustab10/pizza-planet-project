package com.example.project.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDbResp {
    public int order_id;
    public int customer_id;
    public int kitchen_id;
    public int partner_id;
    public String transaction_id;
    public Timestamp order_timestamp;
    public float total_amount;
    public String delivery_status;
}
