package com.example.project.dao;

import com.example.project.models.Kitchen;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class KitchenDao {

    @Autowired
    JdbcTemplate jdbcTemplate;

//    @Autowired
//    public KitchenDao() {
//        DriverManagerDataSource dataSource = new DriverManagerDataSource();
//        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
//        dataSource.setUrl("jdbc:mysql://localhost:3306/newdb");
//        dataSource.setUsername("root");
//        dataSource.setPassword("deanwolf1234");
//        jdbcTemplate = new JdbcTemplate(dataSource);
//    }
    public List<Kitchen> getAllKitchen(){
        String sql="select * from kitchen";
        return jdbcTemplate.query(sql,new BeanPropertyRowMapper<Kitchen>(Kitchen.class));
    }

    public List<Kitchen> getKitchenByCity(String city){
//        System.out.println(city+"aa");
        String sql="select * from kitchen where upper(city)=upper(?)";
        return jdbcTemplate.query(sql,new BeanPropertyRowMapper<Kitchen>(Kitchen.class),city);
    }

//    public static   void main(String args[]){
//        KitchenDao kitchenDao=new KitchenDao();
//        var kitchens=kitchenDao.getKitchenByCity("deLhi");
//        for (var i:kitchens){
//            System.out.println("the kitchen -"+i.toString());
//
//        }
//    }
}
