package com.islandercart.orders;
import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderDTO orderDTO);
    OrderDTO getOrderById(String id);
    List<OrderDTO> getAllOrders();
    void deleteOrder(String id);
    List<OrderDTO> getOrdersByUserId(String userId);
	String updateOrderById(String id, OrderDTO updatedOrder);
}

