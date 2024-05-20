package com.example.project.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Kitchen {
    public int kitchen_id;
    public String street_name;
    public String city;
    public String state;
    public String pincode;
    public String plot_no;
}
