package com.example.project.controllers;


import com.example.project.dao.KitchenDao;
import com.example.project.models.Kitchen;
import com.example.project.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kitchen")
public class KitchenController {

    @Autowired
    KitchenDao kitchenDao;

    @GetMapping("")
    ResponseEntity<List<Kitchen>> getAll(){

        try {
            var kitchens=kitchenDao.getAllKitchen();
            if(kitchens.size()==0){
                return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(kitchens,HttpStatus.OK);
        }
        catch (Exception e){
            throw e;
        }

    }

    @GetMapping ("/getByCity/{city}")
    ResponseEntity<List<Kitchen>> getByCity(@PathVariable("city") String city){
//        System.out.println(" is the city "+city );
        try {
            var kitchens=kitchenDao.getKitchenByCity(city);
            if(kitchens.size()==0){
                return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(kitchens,HttpStatus.OK);
        }
        catch (Exception e){
            throw e;
        }
    }
}
