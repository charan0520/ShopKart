package com.islandercart.orders;
import lombok.*;

import java.sql.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private String id;
    private String userId;
    private String name;
    private String address;
    private String phone;
    private List<OrderItemDTO> orderItems;
    private Double totalPrice;
    private String status;
    private String orderDate;
}


