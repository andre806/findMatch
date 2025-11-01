package com.example.demo.services;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
@Component
public class Jwt {
    @Value("${jwt.secret}")
    private String secretKey;

    public String generateToken(String email, String id){
        Key key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS256.getJcaName());
        return Jwts.builder()
            .setSubject(email)
            .claim("id", id)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 864000000)) 
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }
     
    public String getEmailFromToken(String token) {
        Key key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS256.getJcaName());
        Claims claims = Jwts.parser()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
        return claims.getSubject();
    }
    public String getEmail(HttpServletRequest request){
        String token = null;
        for(Cookie cookie : request.getCookies()){
            if("token".equals(cookie.getName())){
                token = cookie.getValue();
                break;
            }
        }
        return getEmailFromToken(token);
    }
}
