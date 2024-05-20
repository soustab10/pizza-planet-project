package com.example.project.dao;

import com.example.project.models.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.beans.Statement;
import java.util.*;

@Repository
public class OrderDao {


    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    CustomerDao customerDao;
    @Autowired
    DataSource dataSource;
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }





    @Autowired
    public OrderDao() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/newdb");
        dataSource.setUsername("root");
        dataSource.setPassword("#Nilima29");
        jdbcTemplate = new JdbcTemplate(dataSource);

    }

    public Number insertOrderStub(Order order) {
        SimpleJdbcInsert insertIntoOrder;
        insertIntoOrder = new SimpleJdbcInsert(jdbcTemplate).withTableName("`Order`").usingGeneratedKeyColumns("order_id");
        final Map<String, Object> parameters = new HashMap<>();
        parameters.put("customer_id",order.getCustomer().getCid());
        parameters.put("kitchen_id",order.getKitchen().getKitchen_id());
        parameters.put("partner_id",order.getPartner().getPartner_id());
        parameters.put("transaction_id",order.getTransaction().getTransaction_id());
        var s=new String[]{"customer_id","kitchen_id","partner_id","transaction_id"};
        insertIntoOrder.usingColumns(s);
        Number j= insertIntoOrder.executeAndReturnKey(parameters);
        System.out.println(insertIntoOrder.getInsertString());
        return j;
    }
    public Number createOrderItems(OrderItem orderItem){
        var insertIntoOrderItem= new SimpleJdbcInsert(jdbcTemplate).withTableName("OrderItems").usingGeneratedKeyColumns("order_item_id");
        var insertIntoOrderItemToppings= new SimpleJdbcInsert(jdbcTemplate).withTableName("order_item_toppings");
        ObjectMapper objectMapper=new ObjectMapper();
        final Map<String, Object> parameters = objectMapper.convertValue(orderItem, new TypeReference<Map<String, Object>>() {});
        var toppings=orderItem.getToppings();
        parameters.remove("order_item_id");
        parameters.put("pizza_id",orderItem.getPizza().getPizza_id());
        parameters.put("size_id",orderItem.getSize().getSize_id());
        parameters.put("crust_id",orderItem.getCrust().getCrust_id());
        parameters.remove("pizza");
        parameters.remove("size");
        parameters.remove("crust");
        parameters.remove("toppings");
        List<String> fields = new ArrayList<String>(parameters.keySet());
        insertIntoOrderItem.usingColumns(fields.toArray(new String[0]));
        Number j;
        try {
            j = insertIntoOrderItem.executeAndReturnKey(parameters);
            insertIntoOrderItemToppings.usingColumns(new String[]{"order_item_id","topping_id"});
            for(var topping:toppings){
                final Map<String,Object>t=new HashMap<>();
                t.put("order_item_id",j);
                t.put("topping_id",topping.getTopping_id());
                insertIntoOrderItemToppings.execute(t);
            }
        } catch (Exception e){
            throw e;
        }
        System.out.println(insertIntoOrderItem.getInsertString());
        return j;
    }
    public int updateOrderItemQuantity(int id,int newQuantity){
        String sql="UPDATE OrderItems SET quantity=? WHERE order_item_id=?";
        int i=1;
        try {
            jdbcTemplate.update(sql,newQuantity,id);
        } catch (Exception e){
            i=-1;
            throw e;


        }
        return 1;
    }
    public int setOrderAmount(int id,float amt){
        int i=1;
        String sql= "UPDATE `Order` SET total_amount=? where order_id=?";
        try{
            jdbcTemplate.update(sql,amt,id);
        } catch (Exception e){
            i=-1;
            throw e;
        }
        return i;

    }
    // Add customer object in service
    public Optional<Order> getOrderById(int id){
        String sql="SELECT * FROM `Order` WHERE order_id=?";
        var resp=jdbcTemplate.query(sql,new BeanPropertyRowMapper<OrderDbResp>(OrderDbResp.class),id);
        OrderDbResp orderDbResp;
        if(resp.stream().findFirst().isEmpty()){
            return Optional.empty();
        } else{
            orderDbResp=resp.stream().findFirst().get();
            String sql1="SELECT * FROM Kitchen WHERE kitchen_id=?";
            String sql2="SELECT * FROM DeliveryPartners WHERE partner_id=?";
            String sql3="SELECT * FROM Transactions WHERE transaction_id=?";
            var resp1=jdbcTemplate.query(sql1,new BeanPropertyRowMapper<Kitchen>(Kitchen.class),orderDbResp.getKitchen_id());
            var resp2=jdbcTemplate.query(sql2,new BeanPropertyRowMapper<DeliveryPartner>(DeliveryPartner.class),orderDbResp.getPartner_id());
            var resp3=jdbcTemplate.query(sql3,new BeanPropertyRowMapper<Transaction>(Transaction.class),orderDbResp.getTransaction_id());
            var customer=new Customer();
            Order order=new Order(orderDbResp,customer,resp1.get(0),resp2.get(0),resp3.get(0));
            var ol=new ArrayList<Order>();
            ol.add(order);
            return ol.stream().findFirst();
        }
    }
    public Optional<List<Order>> getOrderByCustomerId(int customer_id){
        String sql="SELECT * FROM `Order` WHERE customer_id=?";
        var resp=jdbcTemplate.query(sql,new BeanPropertyRowMapper<OrderDbResp>(OrderDbResp.class),customer_id);
        List<OrderDbResp> orderDbResps;
        if(resp.stream().findFirst().isEmpty()){
            return Optional.empty();
        } else{
            orderDbResps=resp;
            String sql1="SELECT * FROM Kitchen WHERE kitchen_id=?";
            String sql2="SELECT * FROM DeliveryPartners WHERE partner_id=?";
            String sql3="SELECT * FROM Transactions WHERE transaction_id=?";
            List<Order> ol=new ArrayList<>();
            for(var orderDbResp:orderDbResps) {
                var resp1 = jdbcTemplate.query(sql1, new BeanPropertyRowMapper<Kitchen>(Kitchen.class), orderDbResp.getKitchen_id());
                var resp2 = jdbcTemplate.query(sql2, new BeanPropertyRowMapper<DeliveryPartner>(DeliveryPartner.class), orderDbResp.getPartner_id());
                var resp3=jdbcTemplate.query(sql3,new BeanPropertyRowMapper<Transaction>(Transaction.class),orderDbResp.getTransaction_id());
                var customer = new Customer();
                Order order = new Order(orderDbResp, customer, resp1.get(0), resp2.get(0),resp3.get(0));
                ol.add(order);
            }
            return Optional.of(ol);
        }
    }
    public Optional<List<Order>> getOrderByPartnerId(int partner_id){
        String sql="SELECT * FROM `Order` WHERE partner_id=?";
        var resp=jdbcTemplate.query(sql,new BeanPropertyRowMapper<OrderDbResp>(OrderDbResp.class),partner_id);
        List<OrderDbResp> orderDbResps;
        if(resp.stream().findFirst().isEmpty()){
            return Optional.empty();
        } else{
            orderDbResps=resp;
            String sql1="SELECT * FROM Kitchen WHERE kitchen_id=?";
            String sql2="SELECT * FROM DeliveryPartners WHERE partner_id=?";
            String sql3="SELECT * FROM Transactions WHERE transaction_id=?";
            String sql4="SELECT * FROM Customer WHERE cid=?";
            String sql5="SELECT * FROM Customer_Phone_no WHERE cid=?";
            List<Order> ol=new ArrayList<>();
            for(var orderDbResp:orderDbResps) {
                var resp1 = jdbcTemplate.query(sql1, new BeanPropertyRowMapper<Kitchen>(Kitchen.class), orderDbResp.getKitchen_id());
                var resp2 = jdbcTemplate.query(sql2, new BeanPropertyRowMapper<DeliveryPartner>(DeliveryPartner.class), orderDbResp.getPartner_id());
                var resp3=jdbcTemplate.query(sql3,new BeanPropertyRowMapper<Transaction>(Transaction.class),orderDbResp.getTransaction_id());
                var customer = jdbcTemplate.query(sql4,new BeanPropertyRowMapper<Customer>(Customer.class),orderDbResp.getCustomer_id());
                var phone=jdbcTemplate.query(sql5,new BeanPropertyRowMapper<CustomerPhoneNo>(CustomerPhoneNo.class),orderDbResp.getCustomer_id());
                Order order = new Order(orderDbResp, customer.get(0), resp1.get(0), resp2.get(0),resp3.get(0));
                order.getCustomer().setPhone_no(phone);
                ol.add(order);
            }
            return Optional.of(ol);
        }
    }
    public Optional<List<OrderItem>> getOrderItemsByOrderId(int id){
        String sql="SELECT OrderItems.order_item_id,order_id,OrderItems.pizza_id,\n" +
                "OrderItems.subtotal,OrderItems.crust_id,OrderItems.size_id,quantity,pizza_name,description,\n" +
                "pizza.price as pizza_price,pizza_image_url,crust_name,\n" +
                "pizza_crust.price as crust_price,size_name,cost_multiplier FROM OrderItems\n" +
                "INNER JOIN pizza\n" +
                "on OrderItems.pizza_id=pizza.pizza_id\n" +
                "INNER JOIN pizza_crust\n" +
                "on OrderItems.crust_id=pizza_crust.crust_id\n" +
                "INNER JOIN pizza_size\n" +
                "on OrderItems.size_id=pizza_size.size_id\n" +
                "WHERE OrderItems.order_id=?";
        String sql2="SELECT order_item_toppings.topping_id,OrderItems.order_item_id,toppings.price,toppings.topping_name from OrderItems\n" +
                "INNER JOIN order_item_toppings\n" +
                "ON order_item_toppings.order_item_id=OrderItems.order_item_id\n" +
                "INNER JOIN toppings\n" +
                "ON order_item_toppings.topping_id=toppings.topping_id\n" +
                "WHERE OrderItems.order_id=?";
        List<ToppingsDbResp>respt;
        try {
            respt=jdbcTemplate.query(sql2,new BeanPropertyRowMapper<ToppingsDbResp>(ToppingsDbResp.class),id);
        } catch (Exception e){
            throw e;
        }
        try {
           var resp= jdbcTemplate.query(sql,new BeanPropertyRowMapper<OrderItemDbResp>(OrderItemDbResp.class),id);
            List<OrderItem> items=new ArrayList<>();
            for(var res:resp){
                var item=new OrderItem(res);
                List<Toppings>ts=new ArrayList<>();
                item.setToppings(ts);
                for (var r:respt){
                    if(r.getOrder_item_id()==item.getOrder_item_id()){
                        Toppings t=new Toppings();
                        t.setTopping_id(r.getTopping_id());
                        t.setPrice(r.getPrice());
                        t.setTopping_name(r.getTopping_name());
                        item.toppings.add(t);
                    }
                }
                items.add(item);
            }
            return Optional.of(items);
        } catch (Exception e){
            return Optional.empty();

        }

    }

public Number updateOrderStatus(int id,String status,int partner_id){
        String sql="UPDATE `Order` SET delivery_status=? WHERE order_id=? and partner_id=?";
        Number j=-1;
        try {
            int val=jdbcTemplate.update(sql,status,id,partner_id);
            if(val==0){
                j=0;
            }else {
                j = 1;
            }
        } catch (Exception e){
            System.out.println(e);
            return j;
        }
return j;
}

    // Cursed testing code don't touch
    public static void main(String[] args) {
//        Order order=new Order();
//        order.setCustomer(new Customer());
//        order.getCustomer().setCid(9);
//        order.setKitchen(new Kitchen());
//        order.getKitchen().setKitchen_id(2);
//        order.setPartner(new DeliveryPartner());
//        order.getPartner().setPartner_id(5);
//        var orderDao=new OrderDao();
//        Number i= orderDao.insertOrderStub(order);
//        System.out.println(i);
//        OrderItem orderItem=new OrderItem();
//        orderItem.setOrder_id(1);
//        orderItem.setCrust(new PizzaCrust());
//        orderItem.getCrust().setCrust_id(1);
//        orderItem.setPizza(new Pizza());
//        orderItem.getPizza().setPizza_id(4);
//        orderItem.setQuantity(1);
//        orderItem.setSubtotal(150);
//        orderItem.setSize(new PizzaSize());
//        orderItem.getSize().setSize_id(2);
//        var topping=new Toppings();
//        topping.setTopping_id(3);
//        List<Toppings>t=new ArrayList<Toppings>();
//        t.add(topping);
//        orderItem.setToppings(t);
//        var orderDao=new OrderDao();
//        Number i= orderDao.createOrderItems(orderItem);
//        System.out.println(i);
//        var orderDao=new OrderDao();
//        System.out.println(orderDao.updateOrderItemQuantity(1,2));
//        var orderDao=new OrderDao();
//        System.out.println( orderDao.getOrderById(1).get());
//        var orderDao=new OrderDao();
//        System.out.println(orderDao.getOrderItemsByOrderId(1).get());
        var orderDao=new OrderDao();
        System.out.println(orderDao.getOrderByPartnerId(1).get());

    }
}
