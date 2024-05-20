package com.example.project.models;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CustomerPhoneNoUpdate {
    public int cid;
    public String new_phone_no;
    public String old_phone_no;

    public CustomerPhoneNoUpdate(String new_phone_no,String old_phone_no){
        this.old_phone_no=old_phone_no;
        this.new_phone_no=new_phone_no;
    }

}
