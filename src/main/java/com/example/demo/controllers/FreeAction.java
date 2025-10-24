package com.example.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.User;
import com.example.demo.repository.UserRepository;


@RestController
@RequestMapping("/FreeActions")
public class FreeAction {
    private final UserRepository userRepo;
    public FreeAction(UserRepository userRepo){
        this.userRepo = userRepo;
    }
    @PostMapping("/createUser")
    public ResponseEntity<?> createUser(@RequestBody User user) {
     try {
            userRepo.save(user);
            return ResponseEntity.ok().body("user salvo");
        } catch (Exception e) {
           return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
        }
    }
    
}
