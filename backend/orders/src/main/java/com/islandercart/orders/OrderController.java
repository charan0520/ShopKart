package com.islandercart.orders;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Create a new order
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public OrderDTO createOrder(@RequestBody OrderDTO orderDTO) {
        return orderService.createOrder(orderDTO);
    }

    // Get an order by its ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public OrderDTO getOrderById(@PathVariable("id") String id) {
        return orderService.getOrderById(id);
    }
    
    // Update an order by its ID
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public String updateOrderById(@PathVariable("id") String id, @RequestBody OrderDTO orderDTO) {
        return orderService.updateOrderById(id,orderDTO);
    }

    // Get all orders
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    // Delete an order by ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public void deleteOrder(@PathVariable("id") String id) {
        orderService.deleteOrder(id);
    }

    // Get orders by user ID
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    @GetMapping("/user/{userId}")
    public List<OrderDTO> getOrdersByUserId(@PathVariable("userId") String userId) {
        return orderService.getOrdersByUserId(userId);
    }
}
