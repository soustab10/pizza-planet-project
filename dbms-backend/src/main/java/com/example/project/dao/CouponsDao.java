package com.example.project.dao;

import com.example.project.models.Coupons;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CouponsDao {

    @Autowired
    public CouponsDao() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/newdb");
        dataSource.setUsername("root");
        dataSource.setPassword("deanwolf1234");
        jdbcTemplate = new JdbcTemplate(dataSource);
    }
    @Autowired
    JdbcTemplate jdbcTemplate;
    public List<Coupons> getCoupon(String code){
        String sql="select * from Coupons where coupon_code=?";
        System.out.println(code);
        return jdbcTemplate.query(sql,new BeanPropertyRowMapper<Coupons>(Coupons.class),code);
    }
    public List<Coupons> getAllCoupons(){
        String sql="SELECT * FROM Coupons";
        return jdbcTemplate.query(sql,new BeanPropertyRowMapper<Coupons>(Coupons.class));
    }
//    public static void main(String args[]){
//        CouponsDao couponsDao=new CouponsDao();
//        var res=couponsDao.getCoupon("FLAT250").get(0).toString();
//        System.out.println("coupon is "+res);
//    }
}
