package com.islandercart.analytics;

public class SaleRecord {
    public int year;
    public int month;
    public double sales;

    public SaleRecord(int year, int month, double sales) {
        this.year = year;
        this.month = month;
        this.sales = sales;
    }

    @Override
    public String toString() {
        return String.format("SaleRecord{year=%d, month=%d, sales=%.2f}", year, month, sales);
    }
}
