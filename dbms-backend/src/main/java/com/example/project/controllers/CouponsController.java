package com.example.project.controllers;


import com.example.project.dao.CouponsDao;
import com.example.project.models.Coupons;
import com.example.project.models.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/coupons")
public class CouponsController {
    @Autowired
    CouponsDao couponsDao;

    @GetMapping("/{code}")
    public ResponseEntity<Coupons> getCoupon(@RequestAttribute("user") User user,@PathVariable String code){
        try{
            System.out.println("code is.."+code);
            var coupons=this.couponsDao.getCoupon(code);
            if(!coupons.isEmpty())
                return new ResponseEntity<>(coupons.get(0), HttpStatus.OK);
            else
                return new ResponseEntity<>( HttpStatus.NO_CONTENT);
        }
        catch (Exception e){
            throw(e);
        }
    }
    @GetMapping("")
    public ResponseEntity<List<Coupons>> getAllCoupons(@RequestAttribute("user") User user){
        try{
            var coupons=this.couponsDao.getAllCoupons();
            if(!coupons.isEmpty())
                return new ResponseEntity<>(coupons,HttpStatus.OK);
        }catch (Exception e){
            System.out.println(e);
        }
        return new ResponseEntity<>(new ArrayList<Coupons>(),HttpStatus.NO_CONTENT);
    }
}
