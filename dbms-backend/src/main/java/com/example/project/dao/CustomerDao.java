package com.example.project.dao;

import com.example.project.models.Customer;
import com.example.project.models.CustomerEmailId;
import com.example.project.models.CustomerPhoneNo;
import com.example.project.models.CustomerPhoneNoUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.lang.reflect.Field;
import java.security.spec.NamedParameterSpec;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Repository
public class CustomerDao {
    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;


    public int CreatePhoneNo(CustomerPhoneNo customerPhoneNo){
        String SQL_CREATE="INSERT INTO Customer_Phone_no (cid,phone_no) VALUES (? ,?)";
        try {
            jdbcTemplate.update(SQL_CREATE, customerPhoneNo.getCid(), customerPhoneNo.getPhone_no());
        } catch (Exception e){
            throw e;
        }
        return 1;
    }
    public int CreateEmail(CustomerEmailId customerEmailId){
        String SQL_CREATE="INSERT INTO Customer_Email_ID(cid,email) VALUES (? ,?)";
        try {
            jdbcTemplate.update(SQL_CREATE, customerEmailId.getCid(), customerEmailId.getEmail());
        } catch (Exception e){
            throw e;
        }
        return 1;
    }
    public int CreateCustomer(Customer customer){
        String SQL_CREATE="INSERT INTO Customer (cid,first_name, last_name, dob, age, date_Of_reg, house_number, street_name, city, state, pincode) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try {
            System.out.println(customer.getDob());
            jdbcTemplate.update(SQL_CREATE, customer.getCid(),customer.getFirst_name(), customer.getLast_name(), customer.getDob(),
                    customer.getAge(), customer.getDate_of_reg(), customer.getHouse_number(),
                    customer.getStreet_name(), customer.getCity(), customer.getState(), customer.getPincode());
        } catch (Exception e){
            throw e;
        }
        return 1;
    }
    public Customer getCustomerById(int customerId) {
        String sql = "SELECT * FROM Customer WHERE cid = ?";
        System.out.println(customerId);
        List<Customer> customers= jdbcTemplate.query(sql,new BeanPropertyRowMapper<Customer>(Customer.class),customerId);
        System.out.println(customers);
        var customer=customers.get(0);
        String sql2="SELECT * FROM Customer_Phone_No WHERE cid=?";
        String sql3="SELECT * FROM Customer_Email_Id WHERE cid=?";
        var phone_nos=jdbcTemplate.query(sql2,new BeanPropertyRowMapper<CustomerPhoneNo>(CustomerPhoneNo.class),customerId);
        customer.setPhone_no(phone_nos);
        var emails=jdbcTemplate.query(sql3,new BeanPropertyRowMapper<CustomerEmailId>(CustomerEmailId.class),customerId);
        customer.setEmail(emails);
        return customer;
    }
    // Might look cursed, but it's the only way to handle multiple attribute update in a sane way
    // We get the attributes passed by the user and build sql based on them
    public int updateCustomerById(Customer customer){
        // BUG: Does not work for dates
        String sql="UPDATE Customer SET ";
        String set="";
        var map=customer.notNullfields();
        System.out.printf("map here %s\n",map);
        List<String> keys = new ArrayList<String>(map.keySet());
        for(var key:keys){
            if(!key.equals("cid")) {
                set += key + "=?, ";
            }
        }
        set=set.substring(0,set.length()-2);
        set+=" WHERE cid=?";
        sql+=set;
        var a=new Object[keys.size()];
        int i=0;
        for(var key:keys){
            if(!key.equals("cid")){
                System.out.println(((Object) map.get(key)).getClass());
                a[i]=(Object) map.get(key);
                i++;
            }
        }
        a[i]=map.get("cid");
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
    public int updateCustomerPhoneNo(CustomerPhoneNoUpdate customerPhoneNoUpdate) {
        String sql = "UPDATE Customer_Phone_no SET phone_no=? WHERE cid=? AND phone_no=? ";
        int status = -1;
        try {
            jdbcTemplate.update(sql, customerPhoneNoUpdate.getNew_phone_no(), customerPhoneNoUpdate.getCid(),
                    customerPhoneNoUpdate.getOld_phone_no());
            status = 1;
        } catch (Exception e) {
            throw e;
        }
        return status;
        // TODO: write method to update email
    }

}


