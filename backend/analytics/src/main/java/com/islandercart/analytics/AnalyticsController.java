package com.islandercart.analytics;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/sales/total-by-year")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Map<Integer, Double> getTotalSalesByYear() {
        return analyticsService.getTotalSalesByYear();
    }

    @GetMapping("/sales/monthly-last-12-months")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Map<String, Double> getMonthlySalesLast12Months() {
        return analyticsService.getMonthlySalesLast12Months();
    }
    
    @GetMapping("/sales/monthlyAllTime")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<SaleRecord> getMonthlySalesAllTime() {
        return analyticsService.getMonthlySalesAllTime();
    }
    
    @GetMapping("/sales/predict-next-month-sales")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public double predictNextMonthSales() {
        return analyticsService.predictNextMonthSales();
    }

    @GetMapping("/sales/kpi-metrics")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Map<String, Object> getAnalytics() {
        Map<String, Object> response = new HashMap<>();
        response.put("totalSales", analyticsService.getTotalSalesTillDate());
        response.put("totalOrders", analyticsService.getTotalOrdersCount());
        response.put("ordersThisYear", analyticsService.getOrdersCountThisYear());
        response.put("ordersThisMonth", analyticsService.getOrdersCountThisMonth());
        response.put("averageOrderValue", analyticsService.getAverageOrderValue());
        return response;
    }

    // New endpoint for top 3 most sold products
    @GetMapping("/products/top-3-most-sold")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Map<String, Integer> getTop3MostSoldProducts() {
        return analyticsService.getTop3MostSoldProducts();
    }

    // New endpoint for orders count grouped by status
    @GetMapping("/orders/count-by-status")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Map<String, Long> getOrdersCountByStatus() {
        return analyticsService.getOrdersCountByStatus();
    }
    
    @GetMapping("/sales/by-category")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Map<String, Double>> getSalesByCategory() {
        Map<String, Double> result = analyticsService.getSalesByCategory();
        return ResponseEntity.ok(result);
    }
}
