package com.example.project.controllers;

import com.example.project.dao.CustomerDao;
import com.example.project.models.Customer;
import com.example.project.models.CustomerPhoneNo;
import com.example.project.models.CustomerPhoneNoUpdate;
import com.example.project.models.User;
import com.example.project.services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customer")
public class CustomerController {
    @Autowired
    CustomerService customerService;
    @Autowired
    CustomerDao customerDao;

    @PostMapping("/signup")
    public ResponseEntity<String> register(@RequestBody Customer customer){
        int status=-1;
        try{
            status= customerService.register(customer);
            System.out.println(status);
        } catch(Exception e){
            throw e;
        }
        if(status==1){
            return new ResponseEntity<>("Successfully registered", HttpStatus.CREATED);
        } else if (status==-1){
            return  new ResponseEntity<>("Username Already Taken",HttpStatus.CONFLICT);
        }else{
            return  new ResponseEntity<>("Bad request", HttpStatus.BAD_REQUEST);
        }
    }
    @RequestMapping(method=RequestMethod.GET,path="/")
    public ResponseEntity<Customer> getCustomer(@RequestAttribute("user") User user){
        System.out.println(user.getId());
        Customer customer=customerService.getCustomerById(user.getId());
        customer.setUsername(user.getUsername());
        customer.setId(user.getId());
        customer.setRole(user.getRole());
        return new ResponseEntity<>(customer,HttpStatus.OK);
    }
    @PutMapping("/update")
    public ResponseEntity<String> update(@RequestBody Customer customer,@RequestAttribute("user") User user){
        int status=0;
        customer.setCid(user.getId());
        System.out.println(customer);
        try{
            status= customerService.update(customer);
        } catch (Exception e){
            throw e;
        }
        if(status==1){
            return  new ResponseEntity<>("Updated succesfully",HttpStatus.OK);
        } else{
            return  new ResponseEntity<>("Some error occured",HttpStatus.BAD_REQUEST);
        }
    }
    @PutMapping("/update-phone")
    public ResponseEntity<String> updatePhoneNo(@RequestBody CustomerPhoneNoUpdate customerPhoneNoUpdate,@RequestAttribute("user") User user){
        customerPhoneNoUpdate.setCid(user.getId());
        int status=0;
        try{
            status= customerService.updatePhoneNo(customerPhoneNoUpdate);
        } catch (Exception e){
            throw e;
        }
        if(status==1){
            return  new ResponseEntity<>("Updated succesfully",HttpStatus.OK);
        } else{
            return  new ResponseEntity<>("Some error occured",HttpStatus.BAD_REQUEST);
        }
    }
}