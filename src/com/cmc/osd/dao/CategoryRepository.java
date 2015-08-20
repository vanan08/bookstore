package com.cmc.osd.dao;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.cmc.osd.model.Category;

@Repository
public class CategoryRepository {
	private static final Logger logger = LoggerFactory.getLogger(CategoryRepository.class);
	public static final String COLLECTION_NAME = "category";
	 
	@Autowired
	private MongoTemplate mongoTemplate;
	
	public Category getCategoryById(String id) {
		logger.info("Inside getCategoryById()...");
		return mongoTemplate.findOne(Query.query(Criteria.where("id").is(id)), Category.class, COLLECTION_NAME);
	}

	public Category getCategoryByText(String text) {
		logger.info("Inside getCategoryByText()...");
		return mongoTemplate.findOne(Query.query(Criteria.where("text").is(text)), Category.class, COLLECTION_NAME);
	}
	
	public List<Category> getAllCategories() {
		logger.info("Inside getAllCategories()...");
		return mongoTemplate.findAll(Category.class, COLLECTION_NAME);
	}
}
