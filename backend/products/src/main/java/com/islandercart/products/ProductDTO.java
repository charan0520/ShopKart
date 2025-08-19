package com.islandercart.products;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private String id;
    private String title;
    private Double price;
    private String description;
    private String category;
    private String image;

    private RatingDTO rating;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RatingDTO {
        private Double rate;
        private Integer count;
    }
}
