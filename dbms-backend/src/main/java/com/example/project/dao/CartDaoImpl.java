package com.example.project.dao;

import com.example.project.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class CartDaoImpl implements CartDao {

    @Autowired
    JdbcTemplate jdbcTemplate;


    @Override
    public Integer insertToppings(Cart cart, Integer topping) {
        String query = "insert into cart_item_toppings (cart_id,topping_id) values (?,?)";
        System.out.println("inserting topping" + cart.getCart_id() + " " + topping);
        return jdbcTemplate.update(query, cart.getCart_id(), topping);
    }


    @Override
    public Integer insertPizza(Cart cart) {
        String query = "insert into cart (user_id,pizza_id,quantity,crust_id,size_id,identifier) values (?,?,?,?,?,?)";
        System.out.println("identifier " + cart.getIdentifier());
        jdbcTemplate.update(query, cart.getUser_id(), cart.getPizza().getPizza_id(), cart.getQuantity(), cart.getPizzaCrust().getCrust_id(), cart.getPizzaSize().getSize_id(), cart.getIdentifier());
        return jdbcTemplate.queryForObject("select LAST_INSERT_ID()", Integer.class);
    }

    @Override
    public Optional<List<Cart>> getAllItemsInCart(int id) {
        String sql1 = "SELECT cart.cart_id,user_id,pizza.pizza_id,\n" +
                "cart.crust_id,cart.size_id,quantity,pizza_name,description,cart.identifier,\n" +
                "pizza.price as pizza_price,pizza_image_url,crust_name,\n" +
                "pizza_crust.price as crust_price,size_name,cost_multiplier FROM cart\n" +
                "INNER JOIN pizza\n" +
                "on cart.pizza_id=pizza.pizza_id\n" +
                "INNER JOIN pizza_crust\n" +
                "on cart.crust_id=pizza_crust.crust_id\n" +
                "INNER JOIN pizza_size\n" +
                "on cart.size_id=pizza_size.size_id\n" +
                "WHERE cart.user_id=?";
        String sql2 = "SELECT cart_item_toppings.topping_id,cart.cart_id,toppings.price,toppings.topping_name from cart\n" +
                "INNER JOIN cart_item_toppings\n" +
                "ON cart_item_toppings.cart_id=cart.cart_id\n" +
                "INNER JOIN toppings\n" +
                "ON cart_item_toppings.topping_id=toppings.topping_id\n" +
                "WHERE cart.user_id=?";
        List<ToppingsCartDbResp> respt;
        try {
            respt = jdbcTemplate.query(sql2, new BeanPropertyRowMapper<ToppingsCartDbResp>(ToppingsCartDbResp.class), id);
        } catch (Exception e) {
            throw e;
        }
        System.out.println(respt);
        try {
            var resp = jdbcTemplate.query(sql1, new BeanPropertyRowMapper<CartItemDbResp>(CartItemDbResp.class), id);
            System.out.println(resp);
            List<Cart> items = new ArrayList<>();
            System.out.println(resp.size());
            for (int i=0;i<resp.size();i++) {
                System.out.println("aaaaa22");
                var item = new Cart(resp.get(i));
                System.out.println("This is item"+item);
                System.out.println("aaaa5");
                List<Toppings> ts = new ArrayList<>();
                item.setToppings(ts);
                for (var r : respt) {
                        System.out.printf("Toppings cart id: %d, Car cart_id: %d",r.getCart_id(),item.getCart_id());
                    if (Objects.equals(r.getCart_id(), item.getCart_id())) {
                        System.out.println(r);
                        Toppings t = new Toppings();
                        t.setTopping_id(r.getTopping_id());
                        t.setPrice(r.getPrice());
                        t.setTopping_name(r.getTopping_name());
                        item.toppings.add(t);
                    }
                }
                item.calculatePrice();
                items.add(item);
            }
            System.out.println("aa2");
            return Optional.of(items);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Cart> getCartId(String identifier) {
        String query = "select * from cart where identifier = ?";
        System.out.println("i=" + identifier);
        return jdbcTemplate.query(query, new BeanPropertyRowMapper<>(Cart.class), new Object[]{identifier});
    }

    @Override
    public int updateQuantity(Cart cart) {
        String sql = "update cart set quantity=? where cart_id=?";
        System.out.println("quant"+cart.getQuantity());
        return jdbcTemplate.update(sql, new Object[]{cart.getQuantity(), cart.getCart_id()});
    }

    @Override
    public int removeItemFromCart(Cart cart) {
        String sql = "delete from cart where cart_id=?";
        return jdbcTemplate.update(sql, new Object[]{cart.getCart_id()});
    }

    public static void main(String[] args) {
        var cartDao=new CartDaoImpl();
        System.out.println(cartDao.getAllItemsInCart(7));
    }
}
