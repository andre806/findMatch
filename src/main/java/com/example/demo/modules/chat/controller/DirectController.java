package com.example.demo.modules.chat.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.modules.chat.Repository.ChatRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;

import com.example.demo.modules.chat.models.Chat;
import com.example.demo.modules.usuarios.UserRepository;
import com.example.demo.services.Jwt;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;


@RestController
@RequestMapping("/direct")
public class DirectController{
    private final ChatRepository chatRepo;
    private final Jwt jwt;
    private final UserRepository userRepo;
    public DirectController(ChatRepository chatRepo, Jwt jwt, UserRepository userRepo){
        this.chatRepo = chatRepo;
        this.jwt = jwt;
        this.userRepo = userRepo;
    }
    @GetMapping("/getDirectsByUser")
    public ResponseEntity<?> getDirectsByUser(HttpServletRequest request) {
        try {
            var email =  jwt.getEmail(request);
        var userId = userRepo.findByEmail(email).getId();
        List<Chat> chats  = chatRepo.findByPessoa1IdOrPessoa2Id(userId, userId);
        return ResponseEntity.ok().body(chats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("erro no try");
        }  
    }
    
    
}
