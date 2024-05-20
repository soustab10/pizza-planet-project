package com.example.project.dao;

import com.example.project.models.PizzaCrust;
import com.example.project.models.PizzaSize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PizzaSizeDao {
    @Autowired
    JdbcTemplate jdbcTemplate;
    public List<PizzaSize> getAll(){
        String SQL_SELECT="SELECT * FROM pizza_size";
        return jdbcTemplate.query(SQL_SELECT,new BeanPropertyRowMapper<PizzaSize>(PizzaSize.class));
    }
}
