package com.example.project.dao;

import com.example.project.models.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class TransactionDao {
    @Autowired
    JdbcTemplate jdbcTemplate;
    public int createTransaction(Transaction transaction){
        String sql="INSERT INTO transactions(transaction_id,customer_id) VALUES(?,?)";
        try{
            jdbcTemplate.update(sql,transaction.getTransaction_id(),transaction.getCustomer_id());
        }catch (Exception e){
            System.out.println(e);
        }
        return 1;
    }
    public List<String> getTransactionId(){
        String sql="SELECT transaction_id FROM transactions";
        return jdbcTemplate.queryForList(sql,String.class);
    }

    public int updateAmount(String transaction_id,float amount){
        String sql="UPDATE transactions SET amount=? WHERE transaction_id=?";
        return jdbcTemplate.update(sql,amount,transaction_id);
    }
}
