package com.example.demo.services;
import org.springframework.beans.factory.annotation.Value;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Jwts;
import java.util.Date;
import org.springframework.stereotype.Component;
@Component
public class Jwt {
    @Value("${jwt.secret}")
    private String secretKey;

    public String generateToken(String email, String id){
        return Jwts.builder()
        .setSubject(email)
        .claim("id", id)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 864000000)) 
        .signWith(SignatureAlgorithm.HS256, secretKey)
        .compact();
    }
}
