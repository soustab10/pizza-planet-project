package com.example.project.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {
    public String transaction_id;
    public int customer_id;
    public float amount;
    public Timestamp transaction_date;
}
