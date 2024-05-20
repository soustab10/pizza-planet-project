package com.example.project.dao;

import com.example.project.models.Pizza;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PizzaDao {
    @Autowired
    JdbcTemplate jdbcTemplate;
    public List<Pizza> getAll(){
        String SQL_SELECT="SELECT * FROM pizza";
        return jdbcTemplate.query(SQL_SELECT,new BeanPropertyRowMapper<Pizza>(Pizza.class));
    }
}
