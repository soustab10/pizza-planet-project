package com.example.project.config;

import com.example.project.interceptors.AdminInterceptor;
import com.example.project.interceptors.AuthInterceptor;
import com.example.project.interceptors.DeliveryPartnerInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class SecurityConfig implements WebMvcConfigurer {

    @Autowired
    AuthInterceptor authInterceptor;
    @Autowired
    AdminInterceptor adminInterceptor;

    @Autowired
    DeliveryPartnerInterceptor deliveryPartnerInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry interceptorRegistry){
        interceptorRegistry.addInterceptor(authInterceptor).addPathPatterns("/**").excludePathPatterns("/landing/**");
        interceptorRegistry.addInterceptor(adminInterceptor).addPathPatterns("/admin/**");
        interceptorRegistry.addInterceptor(deliveryPartnerInterceptor).addPathPatterns("/partner/**");
    }

}
