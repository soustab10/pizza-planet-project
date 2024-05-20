package com.example.project.services;

import com.example.project.dao.DeliveryPartnerDao;
import com.example.project.dao.OrderDao;
import com.example.project.models.DeliveryPartner;
import com.example.project.models.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DeliveryPartnerService {
    @Autowired
    DeliveryPartnerDao deliveryPartnerDao;

    @Autowired
    OrderDao orderDao;

    public Optional<List<DeliveryPartner>> freeDeliveryPartnersInCity (String city){
        var dps=deliveryPartnerDao.getAllDeliveryPartners();
        List<DeliveryPartner> freeDps=new ArrayList<>();
        if(dps.isEmpty()){
            return Optional.empty();
        } else{
            for(var dp:dps.get()){
                if(dp.getCity().equalsIgnoreCase(city)&&dp.getStatus().equalsIgnoreCase("active")){
                    freeDps.add(dp);
                }
            }
            return Optional.of(freeDps);
        }
    }
    public int updateDeliveryPartner(DeliveryPartner deliveryPartner){
        int res=-1;
        try{
            res=deliveryPartnerDao.updatePartnerByUserId(deliveryPartner);
        }catch (Exception e){
            System.out.println(e);
        }
        return res;
    }
    public Optional<List<Order>> deliveryPartnerOrders(int partner_id){
        return orderDao.getOrderByPartnerId(partner_id);
    }
    public int createDeliveryPartners(DeliveryPartner deliveryPartner){
        int ret=deliveryPartnerDao.createDeliveryPartners(deliveryPartner);
        return ret;
    }
}
