package com.islandercart.analytics;

import lombok.RequiredArgsConstructor;
import smile.data.DataFrame;
import smile.data.formula.Formula;
import smile.data.vector.DoubleVector;
import smile.data.vector.IntVector;
import smile.regression.LinearModel;
import smile.regression.OLS;
import smile.regression.Regression;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private static final DateTimeFormatter ISO_DATE = DateTimeFormatter.ISO_DATE;
    private static final Random RANDOM = new Random();
    private final RestTemplate restTemplate;
    private final OrderRepository orderRepository;

    public double getTotalSalesTillDate() {
        return orderRepository.findAll().stream()
                .mapToDouble(Order::getTotalPrice)
                .sum();
    }
    
    
    public long getTotalOrdersCount() {
        return orderRepository.count();  // This directly gives the count of all orders
    }
    
    public long getOrdersCountThisYear() {
        LocalDate startOfYear = LocalDate.of(Year.now().getValue(), 1, 1);
        return orderRepository.findAll().stream()
                .map(Order::getOrderDate)
                .map(this::parseOrderDateOrRandom)
                .filter(date -> !date.isBefore(startOfYear))
                .count();
    }

    public long getOrdersCountThisMonth() {
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        return orderRepository.findAll().stream()
                .map(Order::getOrderDate)
                .map(this::parseOrderDateOrRandom)
                .filter(date -> !date.isBefore(startOfMonth))
                .count();
    }
    
    public double getAverageOrderValue() {
        return orderRepository.findAll().stream()
                .mapToDouble(Order::getTotalPrice) // Get the total price of each order
                .average() // Calculate the average
                .orElse(0.0);  // Return 0.0 if there are no orders
    }

    public Map<String, Integer> getTop3MostSoldProducts() {
        List<Order> orders = orderRepository.findAll();

        Map<String, Integer> productSalesCount = new HashMap<>();

        for (Order order : orders) {
            if (order.getOrderItems() == null) continue;

            for (OrderItem item : order.getOrderItems()) {
                productSalesCount.merge(item.getProductId(), item.getQuantity(), Integer::sum);
            }
        }

        return productSalesCount.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue(Comparator.reverseOrder()))
                .limit(3)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }

    public Map<String, Long> getOrdersCountByStatus() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));
    }

    public Map<Integer, Double> getTotalSalesByYear() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .collect(Collectors.groupingBy(
                        order -> parseOrderDateOrRandom(order.getOrderDate()).getYear(),
                        Collectors.summingDouble(Order::getTotalPrice)
                ));
    }

    public Map<String, Double> getMonthlySalesLast12Months() {
        List<Order> orders = orderRepository.findAll();
        LocalDate twelveMonthsAgo = LocalDate.now().minusMonths(12);

        Map<String, Double> unsortedMap = orders.stream()
                .map(order -> new AbstractMap.SimpleEntry<>(parseOrderDateOrRandom(order.getOrderDate()), order))
                .filter(entry -> entry.getKey().isAfter(twelveMonthsAgo))
                .collect(Collectors.groupingBy(
                        entry -> entry.getKey().format(DateTimeFormatter.ofPattern("yyyy-MM")),
                        Collectors.summingDouble(entry -> entry.getValue().getTotalPrice())
                ));

        // Sort by key (yyyy-MM format naturally sorts chronologically)
        return new TreeMap<>(unsortedMap);
    }
    
    public List<SaleRecord> getMonthlySalesAllTime() {
        List<Order> orders = orderRepository.findAll();
        Map<YearMonth, Double> monthlySales = orders.stream()
            .map(order -> new AbstractMap.SimpleEntry<>(
                YearMonth.from(parseOrderDateOrRandom(order.getOrderDate())),
                order
            ))
            .collect(Collectors.groupingBy(
                Map.Entry::getKey,
                TreeMap::new,
                Collectors.summingDouble(entry -> entry.getValue().getTotalPrice())
            ));
        List<SaleRecord> records = new ArrayList<>();
        for (Map.Entry<YearMonth, Double> entry : monthlySales.entrySet()) {
            YearMonth ym = entry.getKey();
            double sales = entry.getValue();
            records.add(new SaleRecord(ym.getYear(), ym.getMonthValue(), sales));
        }
        return records;
    }
    
    public double predictNextMonthSales() {
        List<SaleRecord> history = getMonthlySalesAllTime();
        int n = history.size();

        // Create arrays for timeIndex and sales
        int[] timeIndex = new int[n];
        double[] sales = new double[n];

        for (int i = 0; i < n; i++) {
            timeIndex[i] = i + 1;
            sales[i] = history.get(i).sales;
        }

        // Build DataFrame with columns "time" and "sales"
        DataFrame df = DataFrame.of(
            IntVector.of("time", timeIndex),
            DoubleVector.of("sales", sales)
        );

        // Define formula explicitly with lhs and rhs
        Formula formula = Formula.of("sales", "time");

        // Fit the model
        LinearModel ols = OLS.fit(formula, df);

        // Predict for next month (time = n+1)
        double predictedSales = ols.predict(new double[] { n + 1 });

        return predictedSales;
    }


    
    private LocalDate parseOrderDateOrRandom(String orderDate) {
        try {
            if (orderDate == null || orderDate.isBlank()) {
                throw new IllegalArgumentException("Order date is null or blank");
            }
            // Try parsing with LocalDateTime (for timestamps like 2024-12-16T22:50:50.395371)
            return LocalDateTime.parse(orderDate).toLocalDate();
        } catch (Exception e1) {
            try {
                // Try parsing with OffsetDateTime (handles timezones like 2024-12-16T22:50:50.395371+00:00)
                return java.time.OffsetDateTime.parse(orderDate).toLocalDate();
            } catch (Exception e2) {
                // Fallback to constant date
                LocalDate fallbackDate = LocalDate.of(2025, 1, 1);
                System.out.println("Invalid or null date '" + orderDate + "'. Using fallback: " + fallbackDate);
                return fallbackDate;
            }
        }
    }
    
    public Map<String, Double> getSalesByCategory() {
        // Call the product microservice via Eureka
        String productServiceUrl = "http://products/api/products/category-to-ids";

        // Map<category, List<productId>>
        Map<String, List<String>> categoryMap = restTemplate.getForObject(productServiceUrl, Map.class);

        if (categoryMap == null) {
            throw new IllegalStateException("Failed to fetch category mapping from product service");
        }

        List<Order> orders = orderRepository.findAll();

        // Flatten all orderItems with category association
        Map<String, Double> salesByCategory = new HashMap<>();

        for (Map.Entry<String, List<String>> entry : categoryMap.entrySet()) {
            String category = entry.getKey();
            List<String> productIds = entry.getValue();

            double total = orders.stream()
                    .flatMap(order -> order.getOrderItems().stream())
                    .filter(item -> productIds.contains(item.getProductId()))
                    .mapToDouble(item -> item.getPrice() * item.getQuantity())
                    .sum();

            salesByCategory.put(category, total);
        }

        return salesByCategory;
    }
    
}
