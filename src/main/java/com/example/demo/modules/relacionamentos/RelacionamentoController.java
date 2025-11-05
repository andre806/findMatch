package com.example.demo.modules.relacionamentos;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import  org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.modules.usuarios.User;
import com.example.demo.modules.relacionamentos.Curtida;
import com.example.demo.modules.relacionamentos.CurtidaRepository;
import com.example.demo.modules.relacionamentos.MatchRepository;
import com.example.demo.modules.usuarios.UserRepository;
import com.example.demo.services.AWS;
import com.example.demo.services.Cryp;
import com.example.demo.services.Jwt;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.modules.chat.Repository.ChatRepository;
import com.example.demo.modules.chat.models.Chat;
import com.example.demo.modules.relacionamentos.Match;
@RestController
@RequestMapping("/Relacionamento")
public class RelacionamentoController {
    private final CurtidaRepository curtidaRepo;
    private final UserRepository userRepo;
    private final AWS aws;
    private final Jwt jwt;
    private final Cryp cryp;
    private final ChatRepository chatRepo;
    private final MatchRepository matchRepo;


    public RelacionamentoController(CurtidaRepository curtidaRepo, MatchRepository matchRepo, UserRepository userRepo, AWS aws, Jwt jwt, Cryp cryp, ChatRepository chatRepo) {
        this.curtidaRepo = curtidaRepo;
        this.userRepo = userRepo;
        this.aws = aws;
        this.jwt = jwt;
        this.cryp = cryp;
        this.chatRepo = chatRepo;
        this.matchRepo = matchRepo;
    }
    public String iniciarChat(String pessoaCurtiu, String pessoaCurtida){
        try{
        var chat = new Chat(pessoaCurtiu, pessoaCurtida);
        chatRepo.save(chat);
        return "chat criado com sucesso";
        }catch(Exception e){
            return "erro";
        }
    }

    @PostMapping("/curtir")
    public ResponseEntity<?> curtir(HttpServletRequest request, @RequestParam String perfilId) {
        try {
            // Substitui espaços por '+' para tratar possíveis problemas de codificação Base64
            perfilId = perfilId.replace(' ', '+');
            String email = jwt.getEmail(request);
            String quemCurteId = userRepo.findByEmail(email).getId();

            // Descriptografa os IDs antes de usar
            String decryptedPerfilId = cryp.descriptografar(perfilId);
            Curtida entity = new Curtida(quemCurteId, decryptedPerfilId);

            // Salva a curtida antes de verificar
            curtidaRepo.save(entity);

            // Agora verifica se há reciprocidade e se já curtiu (após salvar)
            boolean jaCurtiu = curtidaRepo.existsByCurtidoIdAndQuemCurteId(quemCurteId, decryptedPerfilId);
            boolean reciproco = curtidaRepo.existsByCurtidoIdAndQuemCurteId(decryptedPerfilId, quemCurteId);

            var quemCurteIdCrypt = cryp.Cryptografar(quemCurteId);
            var curtidoIdCrypt = cryp.Cryptografar(decryptedPerfilId);

            if (reciproco && jaCurtiu) {
                var newChat = iniciarChat(quemCurteIdCrypt, curtidoIdCrypt);
                var newMatch = new Match(quemCurteIdCrypt, curtidoIdCrypt);
                matchRepo.save(newMatch);
                if(newChat.equals("chat criado com sucesso")){
                    return ResponseEntity.ok().body("chat Criado");
                }else{
                    return ResponseEntity.ok().body("erro ao criar o chat");
                }
            }
            return ResponseEntity.ok().body("curtida registrada");
        } catch (Exception e) {
            return ResponseEntity.ok().body("erro no try"+ e.getMessage());
        }
    }
    //endpoint superLike
    //endpoint para iniciar chat 
    //
   
    
   
    
}
