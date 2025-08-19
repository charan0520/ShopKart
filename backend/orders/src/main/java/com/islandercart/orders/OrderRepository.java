package com.islandercart.orders;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    // Find all orders placed by a specific user
    List<Order> findByUserId(String userId);

    // Find all orders with a specific status (optional)
    List<Order> findByStatus(String status);

    // Find orders that contain a specific productId inside orderItems list (nested query)
    List<Order> findByOrderItemsProductId(String productId);
}
