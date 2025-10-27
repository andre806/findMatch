package com.example.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.services.Jwt;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;


@RestController
@RequestMapping("/User")
public class UserController {
    private final UserRepository userRepo;
    private final Jwt jwt;
    public UserController(UserRepository userRepo, Jwt jwt){
        this.userRepo = userRepo;
        this.jwt = jwt;

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
    @GetMapping("/VerificaLogado")
    public ResponseEntity<?> VerificaLogado(@RequestParam String email){
       try{
        boolean res = userRepo.existsByEmail(email);
        return ResponseEntity.ok().body(res);
       }catch (Exception e) {
           return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email,HttpServletResponse response) {
        try{
            var user = userRepo.findByEmail(email);
            if(user != null){
                String token = jwt.generateToken(user.getEmail(), user.getId());
                Cookie cookie = new Cookie("token", token);
                    cookie.setHttpOnly(true); // Mais seguro
                    cookie.setPath("/");
                    cookie.setMaxAge(86400); // 1 dia em segundos
                    response.addCookie(cookie);
                return ResponseEntity.ok().body("login realizado");
            }else{
                return ResponseEntity.badRequest().body("usuario não encontrado");
            }
        }
        catch (Exception e) {
           return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
        }
    }

   @PostMapping("/Passo1")
   public ResponseEntity<?> Passo1(@RequestParam String email, @RequestBody User data) {
      try{
         var user = userRepo.findByEmail(email);
         if (user != null) {
            user.setCidade(data.getCidade());
            user.setGenero(data.getGenero());
            user.setSexualidade(data.getSexualidade());
            user.setInteresse(data.getInteresse());
            user.setToProcurando(data.getToProcurando());
            user.setOcupacao(data.getOcupacao());
            userRepo.save(user);
            return ResponseEntity.ok().body("Passo 1 atualizado");
         } else {
            return ResponseEntity.badRequest().body("usuario não encontrado");
         }
      }catch (Exception e) {
           return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
        }
   }
   @PostMapping("/Passo2")
   public ResponseEntity<?> Passo2(@RequestParam String email, @RequestBody User data) {
       try{
           var user = userRepo.findByEmail(email);
           if (user != null) {
               user.setGostoMusical(data.getGostoMusical());
               user.setGostos(data.getGostos());
               user.setUrlFotos(data.getUrlFotos());
               user.setBio(data.getBio());
               user.setCidadesExibicao(data.getCidadesExibicao());
               user.setNumeroTelefone(data.getNumeroTelefone());
               user.setEducacao(data.getEducacao());
               user.setUrlFotoPerfil(data.getUrlFotoPerfil());
               userRepo.save(user);
               return ResponseEntity.ok().body("Passo 2 atualizado");
           } else {
               return ResponseEntity.badRequest().body("usuario não encontrado");
           }
       }catch (Exception e) {
           return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
       }
   }  
   @GetMapping("/Perfil")
   public ResponseEntity<?> Perfil(@RequestParam String email) {
      try {
         var user = userRepo.findByEmail(email);
         if (user == null) {
            return ResponseEntity.badRequest().body("usuario não encontrado");
         }
         // Retornar como JSON com campos nomeados
         var perfil = new HashMap<String, Object>();
         perfil.put("nome", user.getNome());
         perfil.put("gostos", user.getGostos());
         perfil.put("cidade", user.getCidade());
         perfil.put("genero", user.getGenero());
         perfil.put("sexualidade", user.getSexualidade());
         perfil.put("toProcurando", user.getToProcurando());
         perfil.put("cidadesExibicao", user.getCidadesExibicao());
         perfil.put("ocupacao", user.getOcupacao());
         perfil.put("educacao", user.getEducacao());
         perfil.put("bio", user.getBio());
         perfil.put("gostoMusical", user.getGostoMusical());
         perfil.put("urlFotos", user.getUrlFotos());
         perfil.put("urlFotoPerfil", user.getUrlFotoPerfil());
         perfil.put("numeroTelefone", user.getNumeroTelefone());
         return ResponseEntity.ok().body(perfil);
      } catch (Exception e) {
         return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
      }
   }
   @GetMapping("/verificaPasso1")
   public ResponseEntity<?> verificaPasso1(@RequestParam String email){
    try {
        var user = userRepo.findByEmail( email);
        if(user.getIdade() != null){
            return ResponseEntity.ok().body(true);
        }else{
            return ResponseEntity.ok().body(false);
        }
        

    } catch (Exception e) {
        return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
    }
   }
    
}
