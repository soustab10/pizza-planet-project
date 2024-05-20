package com.example.project.controllers;


import com.example.project.dao.UserDAO;
import com.example.project.models.User;
import com.example.project.models.signInResponse;
import com.example.project.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    UserService userService;
    @Autowired
    UserDAO userDAO;
    @Autowired
    JdbcTemplate jd;
    @Autowired
    PasswordEncoder encoder;
    @PostMapping("/signup")
    public ResponseEntity<String> createUser(@RequestBody User user) {
        int res = 0;
        try {
            res = userService.register(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        if (res == -1) {
            return new ResponseEntity<>("username already taken", HttpStatus.CONFLICT);
        } else if (res == 0) {
            return new ResponseEntity<>("Sorry some fault", HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>("Success! new user created", HttpStatus.OK);
        }
    }
    @PostMapping("/login")
    public ResponseEntity<signInResponse> signIn(@RequestBody User user) {
        signInResponse response = new signInResponse();
        System.out.println(user);
        Boolean exists = userDAO.exists(user.getUsername());
        int status=-1;
        if(exists){
            boolean match=encoder.matches(user.getPassword(),userDAO.getByUsername(user.getUsername()).getPassword());
            if(match){
                status=1;
                response.setToken(userDAO.getByUsername(user.getUsername()).getToken());
                response.setRole(userDAO.getByUsername(user.getUsername()).getRole());
            }
            else{
                status=-1;
            }
        }
        if(status==1) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else{
            return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
        }
    }
    @GetMapping("/user/{username}")
    public User getUserDetails(@PathVariable String username){
        return userDAO.getByUsername(username);
    }
}