	package com.islandercart.orders;
	import lombok.RequiredArgsConstructor;
	import org.springframework.stereotype.Service;
	
	import java.util.List;
	import java.util.stream.Collectors;

	@Service
	@RequiredArgsConstructor
	public class OrderServiceImpl implements OrderService {

	    private final OrderRepository orderRepository;

	    @Override
	    public OrderDTO createOrder(OrderDTO orderDTO) {
	        Order order = dtoToEntity(orderDTO);
	        Order saved = orderRepository.save(order);
	        return entityToDTO(saved);
	    }

	    @Override
	    public OrderDTO getOrderById(String id) {
	        Order order = orderRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
	        return entityToDTO(order);
	    }

	    @Override
	    public List<OrderDTO> getAllOrders() {
	        return orderRepository.findAll()
	                .stream()
	                .map(this::entityToDTO)
	                .collect(Collectors.toList());
	    }

	    @Override
	    public void deleteOrder(String id) {
	        orderRepository.deleteById(id);
	    }

	    @Override
	    public List<OrderDTO> getOrdersByUserId(String userId) {
	        return orderRepository.findByUserId(userId)
	                .stream()
	                .map(this::entityToDTO)
	                .collect(Collectors.toList());
	    }
	    
	    @Override
	    public String updateOrderById(String id, OrderDTO updatedOrder) {
	        Order existingOrder = orderRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

	        // Update only the fields that are meant to be changed (e.g., status)
	        existingOrder.setStatus(updatedOrder.getStatus());

	        // Optionally update other fields like address, phone, etc. if allowed
	        // existingOrder.setAddress(updatedOrder.getAddress());
	        // existingOrder.setPhone(updatedOrder.getPhone());

	        Order savedOrder = orderRepository.save(existingOrder);
	        return "success"; // Assuming you use a mapper
	    }


	    // ========================
	    // Mapping Methods
	    // ========================

	    private OrderDTO entityToDTO(Order order) {
	        return OrderDTO.builder()
	                .id(order.getId())
	                .userId(order.getUserId())
	                .name(order.getName())
	                .address(order.getAddress())
	                .phone(order.getPhone())
	                .totalPrice(order.getTotalPrice())
	                .status(order.getStatus())
	                .orderDate(order.getOrderDate())
	                .orderItems(order.getOrderItems()
	                        .stream()
	                        .map(item -> OrderItemDTO.builder()
	                                .productId(item.getProductId())
	                                .quantity(item.getQuantity())
	                                .price(item.getPrice())
	                                .build())
	                        .collect(Collectors.toList()))
	                .build();
	    }

	    private Order dtoToEntity(OrderDTO dto) {
	        return Order.builder()
	                .id(dto.getId())
	                .userId(dto.getUserId())
	                .name(dto.getName())
	                .address(dto.getAddress())
	                .phone(dto.getPhone())
	                .totalPrice(dto.getTotalPrice())
	                .status(dto.getStatus())
	                .orderDate(dto.getOrderDate())
	                .orderItems(dto.getOrderItems()
	                        .stream()
	                        .map(item -> OrderItem.builder()
	                                .productId(item.getProductId())
	                                .quantity(item.getQuantity())
	                                .price(item.getPrice())
	                                .build())
	                        .collect(Collectors.toList()))
	                .build();
	    }
	}
