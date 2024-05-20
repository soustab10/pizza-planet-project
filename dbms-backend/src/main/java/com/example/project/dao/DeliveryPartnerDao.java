package com.example.project.dao;

import com.example.project.models.DeliveryPartner;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Repository
public class DeliveryPartnerDao {
    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    DataSource dataSource;
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }





    @Autowired
    public DeliveryPartnerDao() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/newdb");
        dataSource.setUsername("root");
        dataSource.setPassword("#Nilima29");
        jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public Optional<List<DeliveryPartner>> getAllDeliveryPartners(){
        String sql="SELECT * FROM DeliveryPartners";
        List<DeliveryPartner>dps;
        try {
             dps = jdbcTemplate.query(sql, new BeanPropertyRowMapper<DeliveryPartner>(DeliveryPartner.class));
        } catch (Exception e){
            System.out.println(e);
            return Optional.empty();
        }
        return Optional.of(dps);
    }
    public int createDeliveryPartners(DeliveryPartner deliveryPartner){
        ObjectMapper objectMapper=new ObjectMapper();
        String sql="INSERT INTO DeliveryPartners(user_id,vehicle_number,first_name,last_name,phone_number,city) VALUES(?,?,?,?,?,?)";
        final Map<String, Object> parameters = objectMapper.convertValue(deliveryPartner, new TypeReference<Map<String, Object>>() {});
        int i=0;
        try {
            jdbcTemplate.update(sql, deliveryPartner.getUser_id(),deliveryPartner.getVehicle_number(),deliveryPartner.getFirst_name(),
                    deliveryPartner.getLast_name(),deliveryPartner.getPhone_number(),deliveryPartner.getCity());
            i=1;
        } catch (Exception e){
            i=-1;
            System.out.println(e);
        }
        return i;
    }

    public int updateStatus(int id,String status){
        int i=1;
        String sql="UPDATE DeliveryPartners SET status=? WHERE partner_id=?";
        try{
            jdbcTemplate.update(sql,status,id);
        }catch(Exception e){
            i=-1;
            System.out.println(e);
        }
        return i;
    }
    public Optional<DeliveryPartner> getPartnerByUserId(int id){
        String sql="SELECT * FROM  DeliveryPartners WHERE user_id=?";
        try {
            var dp = jdbcTemplate.query(sql, new BeanPropertyRowMapper<DeliveryPartner>(DeliveryPartner.class),id);
            return dp.stream().findFirst();
        } catch (Exception e){
            System.out.println(e);
            return Optional.empty();
        }
    }
    public int updatePartnerByUserId(DeliveryPartner deliveryPartner){
        String sql="UPDATE DeliveryPartners SET ";
        String set="";
        var map=deliveryPartner.notNullfields();
        List<String> keys = new ArrayList<String>(map.keySet());
        for(var key:keys){
            if(!key.equals("user_id")&&!key.equals("partner_id")) {
                set += key + "=?, ";
            }
        }
        set=set.substring(0,set.length()-2);
        set+=" WHERE user_id=?";
        sql+=set;
        var a=new Object[keys.size()];
        int i=0;
        for(var key:keys){
            if(!key.equals("user_id")&&!key.equals("partner_id")){
                System.out.println(((Object) map.get(key)).getClass());
                a[i]=(Object) map.get(key);
                i++;
            }
        }
        a[i]=map.get("user_id");
        System.out.println(a[0]);
        System.out.println(sql);
        System.out.printf("map here %s\n",map);
        try{
            jdbcTemplate.update(sql,a);
        } catch (Exception e){
            throw e;
        }
        return 1;
    }
    public static void main(String[] args) {
        DeliveryPartner dp=new DeliveryPartner();
        DeliveryPartnerDao deliveryPartnerDao=new DeliveryPartnerDao();
        dp.setUser_id(20);
        dp.setPartner_id(900);
        dp.setPhone_number("12345678");
        System.out.println(dp);
        deliveryPartnerDao.updatePartnerByUserId(dp);
        System.out.println(deliveryPartnerDao.getPartnerByUserId(20));
    }
}
