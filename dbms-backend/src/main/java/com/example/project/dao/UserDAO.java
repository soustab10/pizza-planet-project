package com.example.project.dao;

import com.example.project.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Repository
public class UserDAO{

    @Autowired
    private JdbcTemplate jdbcTemplate;


    public int create(User user) {
        try {
            System.out.println("in user create dao");
            String SQL_CREATE_USER = "INSERT INTO users (username, password, token) VALUES (?, ?, ?)";
            return jdbcTemplate.update(SQL_CREATE_USER, user.getUsername(), user.getPassword(), user.getToken());
        } catch (Exception e) {
            System.out.println(e);
        }
        return 0;
    }
    public User getByUsername(String username) {
        try {

            String SQL_GET_BY_USERNAME = "SELECT * FROM users WHERE username=?";
            return jdbcTemplate.queryForObject(SQL_GET_BY_USERNAME, new BeanPropertyRowMapper<User>(User.class), username);
        } catch (Exception e) {
            System.out.println("error in get by username" + e);
        }
        return null;
    }

    public Boolean exists(String username) {
        String query = "SELECT * FROM users WHERE username=?";
        try {
            List<User> result = jdbcTemplate.query(query, new BeanPropertyRowMapper<User>(User.class), username);
            System.out.println("check exists: " + result);
            return !result.isEmpty();
        } catch (Exception e) {
            System.out.println(e);
        }
        return false;

    }
    public Optional<User> tokenExists(String token) {
        String query = "SELECT * FROM users WHERE token=?";
        try {
            List<User> result = jdbcTemplate.query(query, new BeanPropertyRowMapper<User>(User.class), token);
            System.out.println("token exists: " + result);
            return result.stream().findFirst();
        } catch (Exception e) {
            System.out.println(e);
        }
        return Optional.empty();

    }

    public String removeUser(int user_id) {
        try{
            String sql = "delete from users where id=?";
            this.jdbcTemplate.update(sql, user_id);
            return "User deleted";
        }
        catch (Exception e){
            System.out.println(e);
        }
        return "Some error occured";
    }

    public Integer getRole(int user_id)
    {
        String sql = "SELECT role FROM users WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, user_id);
    }


}
