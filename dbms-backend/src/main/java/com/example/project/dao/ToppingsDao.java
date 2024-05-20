package com.example.project.dao;

import com.example.project.models.PizzaSize;
import com.example.project.models.Toppings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ToppingsDao {
    @Autowired
    JdbcTemplate jdbcTemplate;
    public List<Toppings> getAll(){
        String SQL_SELECT="SELECT * FROM toppings";
        return jdbcTemplate.query(SQL_SELECT,new BeanPropertyRowMapper<Toppings>(Toppings.class));
    }
}
