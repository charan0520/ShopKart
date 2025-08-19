package com.islandercart.products;
import java.util.List;
import java.util.Map;

public interface ProductService {
    ProductDTO createProduct(ProductDTO productDTO);
    List<ProductDTO> getAllProducts();
    ProductDTO getProductById(String id);
    void deleteProduct(String id);
    List<ProductDTO> getProductsByCategory(String category);
    public List<String> getDistinctCategories();
	ProductDTO updateProduct(String id, ProductDTO productDTO);
    Map<String, List<String>> getCategoryToProductIdsMap();
}