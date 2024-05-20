package com.example.project.controllers;


import com.example.project.dao.CartDao;
import com.example.project.dao.OrderDao;
import com.example.project.dao.TransactionDao;
import com.example.project.models.*;
import com.example.project.services.CartService;
import com.example.project.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {
    @Autowired
    OrderDao orderDao;
    @Autowired
    CartDao cartDao;
    @Autowired
    CartService cartService;
    @Autowired
    TransactionDao transactionDao;
    @Autowired
    OrderService orderService;

    @PostMapping("/place")
    ResponseEntity<String> placeOrder(@RequestBody PlaceOrder placeOrder, @RequestAttribute("user") User user){
        try {
            var transactions=transactionDao.getTransactionId();
            System.out.println(transactions);
            if(transactions.contains(placeOrder.getTransaction().getTransaction_id())){
                return new ResponseEntity<>("Transaction Id already used",HttpStatus.BAD_REQUEST);
            }
            Integer res=orderService.placeOrder(user,placeOrder);
            if(res==1){
                var cart=this.cartService.getAllItemsInCart(user).get();
                for (var cart_item:cart){
                    cartDao.removeItemFromCart(cart_item);
                }
                return new ResponseEntity<>("Order placed", HttpStatus.OK);
            }
            else if(res==-1){
                return new ResponseEntity<>("No partner available", HttpStatus.CONFLICT);
            }
        }catch(Exception e){
            System.out.println(e);
        }
        return new ResponseEntity<>("Order couldn't be placed", HttpStatus.BAD_REQUEST);
    }
    @GetMapping("")
    public ResponseEntity<List<Order>> getOrders(@RequestAttribute("user") User user){
        List<Order> res=orderDao.getOrderByCustomerId(user.getId()).get();
        return new ResponseEntity<>(res,HttpStatus.OK);
    }
    @GetMapping("/{order_id}")
    public ResponseEntity<List<OrderItem>> getOrderItems(@RequestAttribute("user") User user,@PathVariable("order_id") int order_id){
        List<OrderItem> res=orderDao.getOrderItemsByOrderId(order_id).get();
        return new ResponseEntity<>(res,HttpStatus.OK);
    }
}
