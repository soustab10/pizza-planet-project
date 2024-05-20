package com.example.project.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class signInResponse {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String token;
    int role;
}

