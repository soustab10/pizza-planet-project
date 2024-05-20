package com.example.project.models;


import com.example.project.services.CustomerService;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.lang.reflect.Field;
import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Customer extends User {
    public int cid;
    public String first_name;
    public String last_name;
    public List<CustomerEmailId> email;
    public List<CustomerPhoneNo> phone_no;
    public Date dob;
    public int age;
    public Date date_of_reg;
    public String house_number;
    public String street_name;
    public String city;
    public String state;
    public String pincode;

    public  Map<String,Object> notNullfields(){
        ObjectMapper objectMapper=new ObjectMapper();
        Map<String, Object> map = objectMapper.convertValue(this, new TypeReference<Map<String, Object>>() {});
        List<String> keys = new ArrayList<String>(map.keySet());
        for(var key:keys){
            int val=1;
            boolean flag=false;
            try {

                System.out.printf("Here key is %s. value is %s",key,map.get(key));
                val=(Integer)map.get(key);
            } catch (Exception e){
                System.out.println(e);
                try {
                    flag=(map.get(key)==null);
                } catch (Exception e2){
                    System.out.println(e2);
                }
            }

            System.out.printf("Id is %s\n",map.get("cid"));
            if((val==0)||flag){
                System.out.printf("Removed key %s, Remove value %s\n",key,map.get("key"));
                map.remove(key);
            } else{
                System.out.printf("In model %s\n",key);
                System.out.println(map.get(key));
            }
        }
        System.out.println(map);
        return map;
    }
//    public Customer(int age,String name){
//        this.first_name=name;
//        this.age=age;
//    }
//  static public void main(String[] args) {
//   Customer customer=new Customer(5,"Ankit");
//   Field[] fields=customer.getClass().getFields();
//      for (Field field:fields) {
//          var m=customer.notNullfields();
//         System.out.println(m);
//      }

// }
}
