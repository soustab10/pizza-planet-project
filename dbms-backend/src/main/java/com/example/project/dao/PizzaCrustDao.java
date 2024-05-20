package com.example.project.dao;

import com.example.project.models.PizzaCrust;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PizzaCrustDao {
    @Autowired
    JdbcTemplate jdbcTemplate;
    public List<PizzaCrust> getAll(){
        String SQL_SELECT="SELECT * FROM pizza_crust";
        return jdbcTemplate.query(SQL_SELECT,new BeanPropertyRowMapper<PizzaCrust>(PizzaCrust.class));
    }
}
