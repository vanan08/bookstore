package com.cmc.osd.tutorial;
 
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cmc.osd.dao.BookRepository;
import com.cmc.osd.dao.CategoryRepository;
import com.cmc.osd.model.Book;
import com.cmc.osd.model.Category;
 
/**
 * Handles requests for the application home page.
 */
@Controller
public class RestController {
 
  private static final Logger logger = LoggerFactory.getLogger(RestController.class);
  public static final String APPLICATION_JSON = "application/json";
  public static final String APPLICATION_XML = "application/xml";
  public static final String APPLICATION_HTML = "text/html";
 
  @Autowired 
  private BookRepository bookRepository; 

  @Autowired
  private CategoryRepository categoryRepository;

  /**
   * Simply selects the home view to render by returning its name.
 
   */
  @RequestMapping(value = "/", method = RequestMethod.GET, produces=APPLICATION_HTML)
  public @ResponseBody String status() {
    return "Default Status Message";
  }

  @RequestMapping(value="/books", method=RequestMethod.GET)
  public @ResponseBody List<Book> getAllBooks() {
    logger.info("Inside getAllBooks() method...");
 
    List<Book> allBooks = bookRepository.getAllBooks();
  
    return allBooks;
  }

  @RequestMapping(value="/categories")
  public @ResponseBody List<Category> getAllCategories() {
    logger.info("Inside getAllCategories() method...");
 
    List<Category> allCategories = categoryRepository.getAllCategories();
  
    return allCategories;
  } 
  
  @RequestMapping(value="/getbookbyisbn", method=RequestMethod.GET, produces={APPLICATION_JSON, APPLICATION_XML})
  public @ResponseBody Book getBookByIsbn13(@RequestParam("isbn13") String isbn13) {
	  Book myBook = bookRepository.getBookByIsbn13(isbn13);
  
    if (myBook != null) {
      logger.info("Inside getBookByIsbn13, returned: " + myBook.toString());
    } else {
      logger.info("Inside getBookByIsbn13, isbn13: " + isbn13 + ", NOT FOUND!");
    }
  
    return myBook;
  }
 
  @RequestMapping(value="/findbytitle", method=RequestMethod.GET)
  public @ResponseBody List<Book> getBookByTitle(@RequestParam("title")String title) {
	  List<Book> books = bookRepository.getBookByTitle(title);
  
    if (books == null) {
      logger.info("Inside getBookByTitle, title: " + title + ", NOT FOUND!");
    }
  
    return books;
  }
  
  @RequestMapping(value="/findbycategory", method=RequestMethod.GET)
  public @ResponseBody List<Book> getBookByCategory(@RequestParam("category") String category,
		  @RequestParam(value="title", required=false) String title) {
	  
	  List<Book> books = null;
	  
	  if (category != null && title == null) {
		  books = bookRepository.getBookByCategory(category);
	  } else {
		  books = bookRepository.getBookByCategoryAndTitle(category, title);
	  }
  
    if (books == null) {
      logger.info("Inside getBookByCategory, category: " + category + ", NOT FOUND!");
    }
  
    return books;
  }
  

  @RequestMapping(value="/book/delete", method=RequestMethod.DELETE, 
		  			produces={APPLICATION_JSON, APPLICATION_XML})
  public @ResponseBody RestResponse deleteBookByIsbn13(@RequestParam("isbn13") String isbn13) {
    RestResponse response;
 
    Book myBook = bookRepository.deleteBook(isbn13);
 
    if (myBook != null) {
      logger.info("Inside deleteBookByIsbn13, deleted: " + myBook.toString());
      response = new RestResponse(true, "Successfully deleted Book: " + myBook.toString());
    } else {
      logger.info("Inside deleteBookByIsbn13, isbn13: " + isbn13 + ", NOT FOUND!");
      response = new RestResponse(false, "Failed to delete isbn13: " + isbn13);
    }
 
    return response;
  }
 
  @RequestMapping(value="/book/update", method=RequestMethod.PUT, 
		  	consumes={APPLICATION_JSON, APPLICATION_XML}, produces={APPLICATION_JSON, APPLICATION_XML})
  public @ResponseBody RestResponse updateBookByIsbn13(@RequestParam("isbn13") String isbn13, 
		  												@RequestBody Book book) {
	RestResponse response;
 
	Book myBook = bookRepository.updateBook(isbn13, book);
 
    if (myBook != null) {
      logger.info("Inside updateBookByIsbn13, updated: " + myBook.toString());
      response = new RestResponse(true, "Successfully updated isbn13: " + myBook.toString());
    } else {
      logger.info("Inside updateBookByIsbn13, isbn13: " + isbn13 + ", NOT FOUND!");
      response = new RestResponse(false, "Failed to update isbn13: " + isbn13);
    }
 
    return response; 
  }
 
  @RequestMapping(value="/book/add", method=RequestMethod.POST, 
		  consumes={APPLICATION_JSON, APPLICATION_XML}, produces={APPLICATION_JSON, APPLICATION_XML})
  
  public @ResponseBody RestResponse addBook(@RequestParam("isbn13") String isbn13, @RequestBody Book book) {
	  RestResponse response;
 
	logger.info("Inside addBook, model attribute: " + book.toString());
	
	if (isbn13 == null) {
		response = new RestResponse(false, "ISBN13 may not be null.");
		return response;
	}
	
	if (isbn13 != null && isbn13.isEmpty()) {
		response = new RestResponse(false, "ISBN13 may not be empty.");
		return response;
	} 

	Book myBook = getBookByIsbn13(isbn13);
	if (myBook != null) {
		if (myBook.getIsbn13() != null && myBook.getIsbn13().equalsIgnoreCase(isbn13)) {
			response = new RestResponse(false, "ISBN13 already exists in the system.");
			return response;
		}
	}
	
	if (book.getIsbn13() != null && book.getIsbn13().length() > 0) {
      logger.info("Inside addBook, adding: " + book.toString());
      bookRepository.addBook(book);
      response = new RestResponse(true, "Successfully added Book: " + book.getIsbn13());
    } else {
      logger.info("Failed to insert...");
      response = new RestResponse(false, "Failed to insert...");
    }
 
    return response;
  }
}