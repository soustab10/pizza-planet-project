package com.example.project.models;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPartner {
    public int partner_id;
    public int user_id;
    public String first_name;
    public String last_name;
    public String phone_number;
    public String vehicle_number;
    public String status;
    public String city;
    public Map<String,Object> notNullfields(){
        ObjectMapper objectMapper=new ObjectMapper();
        Map<String, Object> map = objectMapper.convertValue(this, new TypeReference<Map<String, Object>>() {});
        List<String> keys = new ArrayList<String>(map.keySet());
        for(var key:keys){
            int val=1;
            boolean flag=false;
            try {
                val=(Integer)map.get(key);
            } catch (Exception e){
                System.out.println(e);
                try {
                    flag=(map.get(key)==null);
                } catch (Exception e2){
                    System.out.println(e2);
                }
            }
            if((val==0)||flag||key=="partner_id"){
                map.remove(key);
            }
        }
        return map;
    }
}

