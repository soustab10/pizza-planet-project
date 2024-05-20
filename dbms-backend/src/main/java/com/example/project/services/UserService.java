package com.example.project.services;

import com.example.project.dao.UserDAO;
import com.example.project.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;


@Service
public class UserService {
    @Autowired
    private UserDAO user_dao;
    @Autowired
    PasswordEncoder encoder;
    public int register(User user) {
        try {
            System.out.println("inside register");
            if (this.user_dao.exists(user.getUsername())) {
                return -1;
            }
            String token=generateToken(8);
            while(!(user_dao.tokenExists(token).isEmpty())){
                token=generateToken(8);
            }
            user.setToken(token);
            user.setPassword(encoder.encode(user.getPassword()));
            return this.user_dao.create(user);
        } catch (Exception e) {
            System.out.println(e);
        }
        return 0;
    }
    private static final String CHARACTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    public static String generateToken(int length) {
        SecureRandom secureRandom = new SecureRandom();
        StringBuilder token = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(CHARACTERS.length());
            char randomChar = CHARACTERS.charAt(randomIndex);
            token.append(randomChar);
        }

        return token.toString();
    }
}
