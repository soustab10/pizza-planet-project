package com.example.project.models;




import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.security.Timestamp;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    public int id;

    public String username;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    public String password;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    public String token;
    //    role: 1 - customer, 2 - admin
    public int role;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
