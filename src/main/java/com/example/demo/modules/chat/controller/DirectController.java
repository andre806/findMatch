package com.example.demo.modules.chat.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.modules.chat.Repository.ChatRepository;
import com.example.demo.modules.chat.Repository.MensagemRepository;
import com.example.demo.modules.chat.models.Chat;
import com.example.demo.modules.usuarios.UserRepository;
import com.example.demo.services.AWS;
import com.example.demo.services.Cryp;
import com.example.demo.services.Jwt;

import jakarta.servlet.http.HttpServletRequest;



@RestController
@RequestMapping("/direct")
public class DirectController{
    private final ChatRepository chatRepo;
    private final Jwt jwt;
    private final UserRepository userRepo;
    private final Cryp cryp;
    private final AWS aws;
    @Autowired
    private MensagemRepository msgRepo;
    public DirectController(ChatRepository chatRepo, Jwt jwt, UserRepository userRepo, Cryp cryp,  AWS aws){
        this.chatRepo = chatRepo;
        this.jwt = jwt;
        this.userRepo = userRepo;
        this.cryp = cryp;
        this.aws = aws;
    }
    @GetMapping("/getDirectsByUser")
    public ResponseEntity<?> getDirectsByUser(HttpServletRequest request) {
        try {
            var email =  jwt.getEmail(request);
        var userId = cryp.Cryptografar(userRepo.findByEmail(email).getId());
        List<Chat> chats  = chatRepo.findByPessoa1IdOrPessoa2Id(userId, userId);
        return ResponseEntity.ok().body(chats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("erro no try"+ e.getMessage());
        }  
    }
    @GetMapping("/getNomeandFoto")
    public ResponseEntity<?> getNomeandFoto(@RequestParam String userId1, @RequestParam String userId2 , HttpServletRequest request) {
        try {
            var email = jwt.getEmail(request);
            var currentId = cryp.Cryptografar(userRepo.findByEmail(email).getId());
            if(currentId.equals(userId1)){
                var idDescrip = cryp.descriptografar(userId2);
                var user = userRepo.findById(idDescrip);
                HashMap<String, String> map = new HashMap<>();
                map.put("nome", user.get().getNome());
                var foto = user.get().getUrlFotos().get(0);
                var url = aws.generatPressignedUrl(foto);
                map.put("foto", url );
                return ResponseEntity.ok().body(map);
            }else{
                var idDescrip = cryp.descriptografar(userId1);
                var user = userRepo.findById(idDescrip);
                HashMap<String, String> map = new HashMap<>();
                map.put("nome", user.get().getNome());
                var foto = user.get().getUrlFotos().get(0);
                var url = aws.generatPressignedUrl(foto);
                map.put("foto", url );
                return ResponseEntity.ok().body(map);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("erro no try"+ e.getMessage());
        }
    }
    @GetMapping("/getHistorico")
    public ResponseEntity<?> getHistorico(@RequestParam String pessoa1Id,@RequestParam String pessoa2Id ){
        try{
            
            var chat = chatRepo.findByPessoa1IdAndPessoa2Id(pessoa1Id, pessoa2Id);
        if(chat == null){
            chat = chatRepo.findByPessoa1IdAndPessoa2Id(pessoa2Id, pessoa1Id);
        }
         if(chat == null){
            return ResponseEntity.badRequest().body("Nenhum chat encontrado entre essas pessoas.");
        }
        var msg = msgRepo.findByChatId(chat.getId());
        return ResponseEntity.ok().body(msg);
        }catch(Exception e ){
             return ResponseEntity.badRequest().body("erro no try"+ e.getMessage());
        }
    }
    @GetMapping("/getSide")
    public ResponseEntity<?> getSide(HttpServletRequest request, @RequestParam String user1Id){
       try {
         var email = jwt.getEmail(request);
         var user = userRepo.findByEmail(email);
         String userDescripted = cryp.descriptografar(user1Id);
         if(user.getId().equals(userDescripted)){
            return ResponseEntity.ok().body("esquerda");
         }else{
            return ResponseEntity.ok().body("direita");
         }
       } catch (Exception e) {
        return ResponseEntity.badRequest().body("erro no try"+ e.getMessage());
       }

    }
    
    
}
