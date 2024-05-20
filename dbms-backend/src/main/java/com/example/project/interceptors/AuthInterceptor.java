package com.example.project.interceptors;

import com.example.project.dao.UserDAO;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
@Component
public class AuthInterceptor implements HandlerInterceptor {
    @Autowired
    UserDAO userDAO;

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,Object handler){
        if(httpServletRequest.getRequestURI().contains("login")||
                httpServletRequest.getRequestURI().contains("signup")||httpServletRequest.getRequestURI().contains("docs")
        ||httpServletRequest.getRequestURI().contains("swagger")) {
            return true;
        };
        String token=httpServletRequest.getHeader("Authorization");
        if(token==null||token.isBlank()){
            try{
            httpServletResponse.getWriter().write(
                    "Please send Authorization token"
            );} catch (Exception e){
                System.out.println(e);
            }
            httpServletResponse.setStatus(403);
            return false;
        } else{
            var auth=token.split("\\s+");
            token="";
            if(auth.length>=2){
                token=auth[1];
            }
            var user=userDAO.tokenExists(token);
            if(user.isEmpty()){
                try{
                    httpServletResponse.getWriter().write(
                            "Invalid Token!!"
                    );} catch (Exception e){
                    System.out.println(e);
                }
                httpServletResponse.setStatus(403);
                return false;
            } else{
                httpServletRequest.setAttribute("user",user.get());
                return true;
            }
        }
    }
}
