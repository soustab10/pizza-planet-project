package com.example.project.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pizza {
    private int pizza_id;
    private String pizza_name;
    private String description;
    private double price;
    private String pizza_image_url;
}

