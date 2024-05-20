package com.example.project.controllers;

import com.example.project.dao.DeliveryPartnerDao;
import com.example.project.dao.OrderDao;
import com.example.project.models.DeliveryPartner;
import com.example.project.models.Order;
import com.example.project.models.User;
import com.example.project.services.DeliveryPartnerService;
import com.example.project.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/partner")
public class DeliveryPartnerController {

    @Autowired
    DeliveryPartnerService deliveryPartnerService;
    @Autowired
    OrderDao orderDao;

    @Autowired
    OrderService orderService;

    @Autowired
    DeliveryPartnerDao deliveryPartnerDao;

    @PostMapping("/create")
    public ResponseEntity<String> createDeliveryPartner(@RequestBody DeliveryPartner deliveryPartner, @RequestAttribute("user") User user){
        deliveryPartner.setUser_id(user.getId());
        int ret=deliveryPartnerService.createDeliveryPartners(deliveryPartner);
        if(ret==1){
            return new ResponseEntity<>("Successfully Created", HttpStatus.CREATED);
        }
        else{
            return new ResponseEntity<>("Bad request", HttpStatus.BAD_REQUEST);
        }
    }
    @RequestMapping(value = "/update-order-status/{status}/{id}",method = RequestMethod.PUT)
    public ResponseEntity<String> updateOrderStatus(@RequestAttribute("user") User user,@PathVariable("status") String status,@PathVariable("id") int id){

       DeliveryPartner partner=new DeliveryPartner();
        try {
            partner=deliveryPartnerDao.getPartnerByUserId(user.getId()).get();
        } catch (Exception e){
            System.out.println(e);
        }
        if(!(status.equalsIgnoreCase("OTW")||status.equalsIgnoreCase("DELIVERED")||
        status.equalsIgnoreCase("WITH RESTAURANT"))){
            return new ResponseEntity<>("This state is not allowed",HttpStatus.BAD_REQUEST);
        }
        else{
             if(status.equalsIgnoreCase("DELIVERED")){
                 try {
                     deliveryPartnerDao.updateStatus(partner.getPartner_id(), "Active");
                 } catch (Exception e){
                     System.out.println(e);
                 }
             }
            Number ret=orderDao.updateOrderStatus(id,status.toUpperCase(),partner.getPartner_id());
            if(ret.equals(1)){
                return new ResponseEntity<>("Updated successfully!!",HttpStatus.OK);
            }else{
                return new ResponseEntity<>("Bad request",HttpStatus.BAD_REQUEST);
            }
        }
    }
    @GetMapping("/profile")
    public ResponseEntity<DeliveryPartner> getDeliveryPartner(@RequestAttribute("user") User user){
        return new ResponseEntity<>(deliveryPartnerDao.getPartnerByUserId(user.getId()).get(),HttpStatus.OK);
    }
    @PutMapping("/update")
    public ResponseEntity<String> update(@RequestBody DeliveryPartner deliveryPartner,@RequestAttribute("user") User user){
        int status=0;
        deliveryPartner.setUser_id(user.getId());
        System.out.println(deliveryPartner);
        try{
            status=deliveryPartnerService.updateDeliveryPartner(deliveryPartner);
        }catch (Exception e){
            System.out.println(e);
        }
        if(status==1){
            return  new ResponseEntity<>("Updated succesfully",HttpStatus.OK);
        } else{
            return  new ResponseEntity<>("Some error occured",HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> partnerOrders(@RequestAttribute("user") User user){
        int pid=deliveryPartnerDao.getPartnerByUserId(user.getId()).get().getPartner_id();
        var orders=deliveryPartnerService.deliveryPartnerOrders(pid);
        if(!orders.isPresent()){
            return new ResponseEntity<>(new ArrayList<Order>(),HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(orders.get(),HttpStatus.OK);
    }
}
