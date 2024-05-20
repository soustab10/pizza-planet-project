package com.example.project.services;

import com.example.project.dao.CustomerDao;
import com.example.project.dao.UserDAO;
import com.example.project.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    @Autowired
    CustomerDao customerDao;
    @Autowired
    UserService userService;
    @Autowired
    UserDAO userDAO;

    public  int register(Customer customer) {
        User user = new User(customer.getUsername(), customer.getPassword());
        int status = userService.register(user);
        if (status == -1) {
            return -1;
        }
        int id = userDAO.getByUsername(user.username).getId();
        customer.setCid(id);
        int ret1;
        try {
            ret1 = customerDao.CreateCustomer(customer);
        } catch (Exception e) {
            throw e;
        }
        if (ret1 == 1) {
            try {
                List<CustomerPhoneNo> phone_nos = customer.getPhone_no();
                for (CustomerPhoneNo phone_no : phone_nos) {
                    phone_no.setCid(id);
                    ret1 = customerDao.CreatePhoneNo(phone_no);

                }
            } catch (Exception e) {
                throw e;
            }
        }
        if (ret1 == 1) {
            try {
                List<CustomerEmailId> email_ids = customer.getEmail();
                for (CustomerEmailId emailId : email_ids) {
                    emailId.setCid(id);
                    ret1 = customerDao.CreateEmail(emailId);
                }
            } catch (Exception e) {
                throw e;
            }
        }
        return ret1;
    }
    public int update(Customer customer){
        int ret=-1;
        try {
            ret=customerDao.updateCustomerById(customer);
        } catch (Exception e){
            throw e;
        }
        return ret;
    }
    public int updatePhoneNo(CustomerPhoneNoUpdate customerPhoneNoUpdate){
        int ret=-1;
        try{
            ret=customerDao.updateCustomerPhoneNo(customerPhoneNoUpdate);
            ret=1;
        } catch (Exception e){
            throw e;
        }
        return ret;
    }

    public Customer getCustomerById(int id){
        Customer customer=null;
        try{
            return customerDao.getCustomerById(id);
        } catch (Exception e){
            throw e;
        }

    }
}