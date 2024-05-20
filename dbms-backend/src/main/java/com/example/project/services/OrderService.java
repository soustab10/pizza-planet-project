package com.example.project.services;

import com.example.project.dao.*;
import com.example.project.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Locale;
import java.util.Random;

@Service
public class OrderService {

    @Autowired
    CustomerDao customerDao;
    @Autowired
    OrderDao orderDao;
    @Autowired
    CartDao cartDao;
    @Autowired
    CouponsDao couponsDao;
    @Autowired
    DeliveryPartnerDao deliveryPartnerDao;
    @Autowired
    CartService cartService;
    @Autowired
    DeliveryPartnerService deliveryPartnerService;

    @Autowired
    KitchenDao kitchenDao;
    @Autowired
    TransactionDao transactionDao;

    public Integer placeOrder(User user,PlaceOrder placeOrder){
        var cart_items=this.cartService.getAllItemsInCart(user).get();
        System.out.println(cart_items);
        if(!cart_items.isEmpty()) {
            Order order=new Order();
            order.setCustomer(customerDao.getCustomerById(user.getId()));
            var partner=deliveryPartnerService.freeDeliveryPartnersInCity(order.getCustomer().getCity()).get();
            if(partner.isEmpty()){
                return -1;
            }
            else{
                order.setPartner(partner.get(new Random().nextInt(partner.size())));
                deliveryPartnerDao.updateStatus(order.getPartner().getPartner_id(),"Engaged");
            }
            var kitchen=kitchenDao.getKitchenByCity(StringUtils.capitalize(order.getCustomer().getCity().toLowerCase()));
            System.out.println("Kitchen " + kitchen.size());
            if(kitchen.isEmpty()){
                return -2;
            }
            order.setKitchen(kitchen.get(new Random().nextInt(kitchen.size())));
            var trans=new Transaction();
            trans.setTransaction_id(placeOrder.getTransaction().getTransaction_id());
            trans.setCustomer_id(user.getId());
            transactionDao.createTransaction(trans);
            order.setTransaction(trans);
            System.out.println(trans);
            System.out.println(order);
            Number i=orderDao.insertOrderStub(order);
            System.out.println(order);
            float amount=0;
            for (var cart_item : cart_items) {
                OrderItem orderItem = new OrderItem(cart_item, i.intValue());
                amount+=orderItem.getSubtotal();
                orderDao.createOrderItems(orderItem);
                System.out.println(cart_item);
            }
            Coupons coupon=couponsDao.getCoupon(placeOrder.getCoupons().getCoupon_code()).get(0);
            Double discount=coupon.getDiscountPrice();
            Double activation=coupon.getActivationPrice();
            if(amount>activation){
                amount-=discount;
            }
            orderDao.setOrderAmount(i.intValue(),amount);
            transactionDao.updateAmount(placeOrder.getTransaction().getTransaction_id(),amount);
        }
        else {
            return 0;
        }
        return 1;
    }
}
