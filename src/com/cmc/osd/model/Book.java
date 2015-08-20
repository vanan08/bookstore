package com.cmc.osd.model;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@XmlRootElement(name = "book")
public class Book  implements Serializable {
	private static final long serialVersionUID = -2387238728379L;
	
	@Id private String id;
	private String title;
	private String author;
	private String publisher;
	private String language;
	private String category;
	private String isbn10;
	private String isbn13;
	private String dimensions;
	private String shippingWeight;
	private String description;
	private float price;
	private int quantity;
	private boolean active;
	
	@XmlElement 
	@JsonProperty("id")
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	@XmlElement 
	@JsonProperty("title")
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	@XmlElement 
	@JsonProperty("author")
	public String getAuthor() {
		return author;
	}
	
	public void setAuthor(String author) {
		this.author = author;
	}
	
	@XmlElement 
	@JsonProperty("publisher")
	public String getPublisher() {
		return publisher;
	}
	
	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}
	
	@XmlElement 
	@JsonProperty("language")
	public String getLanguage() {
		return language;
	}
	
	public void setLanguage(String language) {
		this.language = language;
	}
	
	@XmlElement 
	@JsonProperty("category")
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@XmlElement 
	@JsonProperty("isbn10")
	public String getIsbn10() {
		return isbn10;
	}
	
	public void setIsbn10(String isbn10) {
		this.isbn10 = isbn10;
	}
	
	@XmlElement 
	@JsonProperty("isbn13")
	public String getIsbn13() {
		return isbn13;
	}
	
	public void setIsbn13(String isbn13) {
		this.isbn13 = isbn13;
	}
	
	@XmlElement 
	@JsonProperty("dimensions")
	public String getDimensions() {
		return dimensions;
	}
	
	public void setDimensions(String dimensions) {
		this.dimensions = dimensions;
	}
	
	@XmlElement 
	@JsonProperty("shippingWeight")
	public String getShippingWeight() {
		return shippingWeight;
	}
	
	public void setShippingWeight(String shippingWeight) {
		this.shippingWeight = shippingWeight;
	}
	
	@XmlElement 
	@JsonProperty("description")
	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}

	@XmlElement 
	@JsonProperty("quantity")
	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	@XmlElement 
	@JsonProperty("active")
	public boolean getActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	@XmlElement 
	@JsonProperty("price")
	public float getPrice() {
		return price;
	}

	public void setPrice(float price) {
		this.price = price;
	}

	@Override
	public String toString() {
		return "Book [id=" + id + ", title=" + title + ", author=" + author
				+ ", publisher=" + publisher + ", language=" + language
				+ ", category=" + category + ", isbn10=" + isbn10 + ", isbn13="
				+ isbn13 + ", dimensions=" + dimensions + ", shippingWeight="
				+ shippingWeight + ", description=" + description + ", price="
				+ price + ", quantity=" + quantity + ", active=" + active + "]";
	}

}
