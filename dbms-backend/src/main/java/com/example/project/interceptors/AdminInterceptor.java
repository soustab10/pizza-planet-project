package com.example.project.interceptors;

import com.example.project.dao.UserDAO;
import com.example.project.models.User;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
@Component
public class AdminInterceptor implements HandlerInterceptor {
    @Autowired
    UserDAO userDAO;

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,Object handler){
        User user=(User)httpServletRequest.getAttribute("user");
        if(user.getRole()==1){
            return true;
        } else{
            try{
                httpServletResponse.getWriter().write(
                        "You are not authorised to perform admin operations"
                );} catch (Exception e){
                System.out.println(e);
            }
            httpServletResponse.setStatus(403);
            return false;
        }
}
}
