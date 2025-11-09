package com.example.demo.modules.payment;

import lombok.Data;

@Data
public class PaymentRequest {
    
    protected String token;    
    protected Integer amount;    
    protected String currency;   
    protected String description; 
    
}
