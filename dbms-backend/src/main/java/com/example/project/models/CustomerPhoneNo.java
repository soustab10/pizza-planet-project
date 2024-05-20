package com.example.project.models;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.security.Timestamp;


@Data
@NoArgsConstructor
public class CustomerPhoneNo {
   public int cid;
   // TODO: Write validator for phone number
   public String phone_no;
   public  CustomerPhoneNo(int id,String phone_number){
      this.cid=id;
      this.phone_no=phone_number;
   }
}
