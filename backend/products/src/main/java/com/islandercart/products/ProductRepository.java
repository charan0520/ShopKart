package com.islandercart.products;
import java.util.List;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
	List<Product> findByCategory(String category);
	@Aggregation("{'$group': {'_id': '$category'}}")
    List<String> findDistinctCategories();
}
