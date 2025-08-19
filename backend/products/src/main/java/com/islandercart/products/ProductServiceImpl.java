package com.islandercart.products;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = dtoToEntity(productDTO);
        Product saved = productRepository.save(product);
        return entityToDTO(saved);
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::entityToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO getProductById(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return entityToDTO(product);
    }

    @Override
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
    
    @Override
    public List<ProductDTO> getProductsByCategory(String category) {
        return productRepository.findByCategory(category)
                .stream()
                .map(this::entityToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public ProductDTO updateProduct(String id, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Update product fields
        existingProduct.setTitle(productDTO.getTitle());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setCategory(productDTO.getCategory());
        existingProduct.setImage(productDTO.getImage());

        Product updated = productRepository.save(existingProduct);
        return entityToDTO(updated);
    }
    
    public List<String> getDistinctCategories() {
        return productRepository.findDistinctCategories();
    }

    @Override
    public Map<String, List<String>> getCategoryToProductIdsMap() {
        List<Product> products = productRepository.findAll();

        return products.stream()
                .filter(product -> product.getCategory() != null)
                .collect(Collectors.groupingBy(
                        Product::getCategory,
                        Collectors.mapping(Product::getId, Collectors.toList())
                ));
    }

    private Product dtoToEntity(ProductDTO dto) {
        return Product.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .price(dto.getPrice())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .image(dto.getImage())
                .rating(Product.Rating.builder()
                        .rate(dto.getRating().getRate())
                        .count(dto.getRating().getCount())
                        .build())
                .build();
    }

    private ProductDTO entityToDTO(Product entity) {
        return ProductDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .price(entity.getPrice())
                .description(entity.getDescription())
                .category(entity.getCategory())
                .image(entity.getImage())
                .rating(ProductDTO.RatingDTO.builder()
                        .rate(entity.getRating().getRate())
                        .count(entity.getRating().getCount())
                        .build())
                .build();
    }
}
