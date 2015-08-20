package com.cmc.osd.dao;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.cmc.osd.model.Book;
 
@Repository
public class BookRepository {
  private static final Logger logger = LoggerFactory.getLogger(BookRepository.class);
  public static final String COLLECTION_NAME = "book";
 
  @Autowired
  private MongoTemplate mongoTemplate;
 
  public void addBook(Book book) {
    if (!mongoTemplate.collectionExists(Book.class)) {
      mongoTemplate.createCollection(Book.class);
    }
    
   	logger.info("Inside addBook()...");
   	mongoTemplate.insert(book, COLLECTION_NAME);
  }
 
  public Book getBookByIsbn13(String isbn13) {
    return mongoTemplate.findOne(
      Query.query(Criteria.where("isbn13").is(isbn13)), Book.class, COLLECTION_NAME);
  }
 
  public List<Book> getBookByTitle(String title) {
	return mongoTemplate.find(
	  Query.query(Criteria.where("title").regex(title, "i")), Book.class, COLLECTION_NAME);
  }
  
  public List<Book> getBookByCategory(String category) {
	    return mongoTemplate.find(
	      Query.query(Criteria.where("category").is(category)), Book.class, COLLECTION_NAME);
  }
  
  public List<Book> getBookByCategoryAndTitle(String category, String title) {
	    return mongoTemplate.find(
	      Query.query(Criteria.where("category").is(category).and("title").regex(title, "i")), Book.class, COLLECTION_NAME);
  }
  
  public List<Book> getAllBooks() {
    return mongoTemplate.findAll(Book.class, COLLECTION_NAME);
  }
 
  public Book deleteBook(String isbn13) {
    Book Book = mongoTemplate.findOne(
      Query.query(Criteria.where("isbn13").is(isbn13)), Book.class, COLLECTION_NAME);
    mongoTemplate.remove(Book, COLLECTION_NAME);
 
    return Book;
  }
 
  public Book updateBook(String isbn13, Book book) {
	Book myBook = mongoTemplate.findOne(
	  Query.query(Criteria.where("isbn13").is(isbn13)), Book.class, COLLECTION_NAME);
    
    if (myBook != null) {
    	logger.info("Inside updateBook(), updating record...");
    	myBook.setIsbn13(book.getIsbn13());
        myBook.setTitle(book.getTitle());
        myBook.setAuthor(book.getAuthor());
        myBook.setPublisher(book.getPublisher());
        myBook.setLanguage(book.getLanguage());
        myBook.setIsbn10(book.getIsbn10());
        myBook.setDimensions(book.getDimensions());
        myBook.setShippingWeight(book.getShippingWeight());
        myBook.setDescription(book.getDescription());
        myBook.setPrice(book.getPrice());
        myBook.setCategory(book.getCategory());
        myBook.setQuantity(book.getQuantity());
        myBook.setActive(book.getActive());

        mongoTemplate.save(myBook, COLLECTION_NAME);    
        return myBook;
        
    } else {
    	logger.info("Inside updateBook(), unable to update record...");
        return null;
    } 
  }
}