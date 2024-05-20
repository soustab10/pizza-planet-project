package com.example.project.models;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.security.Timestamp;


@Data
@NoArgsConstructor
public class CustomerEmailId {
    public int cid;
    // TODO: Write validator for email
    public String email;
    public  CustomerEmailId(int id,String email){
        this.cid=id;
        this.email=email;
    }
}
