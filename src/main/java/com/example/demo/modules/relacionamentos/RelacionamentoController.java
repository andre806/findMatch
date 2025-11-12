package com.example.demo.modules.relacionamentos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import  org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.modules.chat.Repository.ChatRepository;
import com.example.demo.modules.chat.models.Chat;
import com.example.demo.modules.relacionamentos.services.ChatLimitedService;
import com.example.demo.modules.relacionamentos.services.CurtidaLimitedService;
import com.example.demo.modules.relacionamentos.services.RewindService;
import com.example.demo.modules.relacionamentos.services.SuperLikeLimitedService;
import com.example.demo.modules.usuarios.UserRepository;
import com.example.demo.services.Cryp;
import com.example.demo.services.Jwt;

import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/Relacionamento")
public class RelacionamentoController {
    private final CurtidaRepository curtidaRepo;
    private final UserRepository userRepo;
 
    private final Jwt jwt;
    private final Cryp cryp;
    private final ChatRepository chatRepo;
    private final MatchRepository matchRepo;
    @Autowired
    private  SuperLikeRepository superRepo;
    @Autowired
    private CurtidaLimitedService curtidaLimited;
    @Autowired
    private SuperLikeLimitedService superLikeService;
    @Autowired
    private ChatLimitedService chatLimited;
    @Autowired
    RewindService rewindService;



    public RelacionamentoController(CurtidaRepository curtidaRepo, MatchRepository matchRepo, UserRepository userRepo, Jwt jwt, Cryp cryp, ChatRepository chatRepo) {
        this.curtidaRepo = curtidaRepo;
        this.userRepo = userRepo;
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
            var user = userRepo.findByEmail(email);
            String quemCurteId = user.getId();
            // Descriptografa os IDs antes de usar
            String decryptedPerfilId = cryp.descriptografar(perfilId);
            Curtida entity = new Curtida(quemCurteId, decryptedPerfilId);
            if(curtidaLimited.podeCurtir(quemCurteId, request) == false){
                return ResponseEntity.ok().body("limite de curtidas excedido");
           }
          

            // Salva a curtida antes de verificar
            curtidaRepo.save(entity);
            
            // Registra a curtida para contagem (sempre que não tem plano)
            try {
                curtidaLimited.registrarCurtida(user);
            } catch (Exception e) {
                 return ResponseEntity.ok().body("erro no try"+ e.getMessage());
            }
            
            
            // Agora verifica se há reciprocidade e se já curtiu (após salvar)
            boolean jaCurtiu = curtidaRepo.existsByCurtidoIdAndQuemCurteId(quemCurteId, decryptedPerfilId);
            boolean reciproco = curtidaRepo.existsByCurtidoIdAndQuemCurteId(decryptedPerfilId, quemCurteId);
            boolean jaCurtiuSuperLike = superRepo.existsByCurtidoIdAndQuemCurteId(quemCurteId, decryptedPerfilId);
            boolean reciprocoSuperLike = superRepo.existsByCurtidoIdAndQuemCurteId(decryptedPerfilId, quemCurteId);
            var quemCurteIdCrypt = cryp.Cryptografar(quemCurteId);
            var curtidoIdCrypt = cryp.Cryptografar(decryptedPerfilId);
            

            if (reciproco && (jaCurtiu || jaCurtiuSuperLike || reciprocoSuperLike) ) {
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
   @GetMapping("/Superlike")
public ResponseEntity<?> SuperLike(@RequestParam String perfilId, HttpServletRequest request) {
    try {
        perfilId = perfilId.replace(' ', '+');
        var email = jwt.getEmail(request);
        var user = userRepo.findByEmail(email);
        String quemCurteId = user.getId();
        String decryptedPerfilId = cryp.descriptografar(perfilId);

        if (superLikeService.podeSuperLike(user)) {
            SuperLike superlike = new SuperLike(quemCurteId, decryptedPerfilId);
            superLikeService.registrarSuperLike(user);
            superRepo.save(superlike);

            boolean jaCurtiu = curtidaRepo.existsByCurtidoIdAndQuemCurteId(quemCurteId, decryptedPerfilId);
            boolean reciproco = curtidaRepo.existsByCurtidoIdAndQuemCurteId(decryptedPerfilId, quemCurteId);
            boolean jaCurtiuSuperLike = superRepo.existsByCurtidoIdAndQuemCurteId(quemCurteId, decryptedPerfilId);
            boolean reciprocoSuperLike = superRepo.existsByCurtidoIdAndQuemCurteId(decryptedPerfilId, quemCurteId);

            var quemCurteIdCrypt = cryp.Cryptografar(quemCurteId);
            var curtidoIdCrypt = cryp.Cryptografar(decryptedPerfilId);

            if (reciproco && (jaCurtiu || jaCurtiuSuperLike || reciprocoSuperLike)) {
                var newChat = iniciarChat(quemCurteIdCrypt, curtidoIdCrypt);
                var newMatch = new Match(quemCurteIdCrypt, curtidoIdCrypt);
                matchRepo.save(newMatch);
                if (newChat.equals("chat criado com sucesso")) {
                    return ResponseEntity.ok().body("chat Criado");
                } else {
                    return ResponseEntity.ok().body("erro ao criar o chat");
                }
            }
            return ResponseEntity.ok().body("SuperLike efetuado com sucesso");
        } else {
            return ResponseEntity.ok().body("você não possui mais SuperLikes, altere seu plano");
        }
    } catch (Exception e) {
        return ResponseEntity.ok().body("erro no try" + e.getMessage());
    }
}
    @PostMapping("/iniciarChat")
    public ResponseEntity<?> iniciarChat(HttpServletRequest request, String pessoa2) {
       try{
        var user = userRepo.findByEmail(jwt.getEmail(request));
        if(chatLimited.podeChat(user)){
            Chat chat = new Chat(cryp.Cryptografar(user.getId()), pessoa2);
            chatRepo.save(chat);
            chatLimited.registrarChat(user);
            return ResponseEntity.ok().body("chat iniciado");
        }else{
            return ResponseEntity.ok().body("adiquira um dos nossos planos para poder inciar um chat sem match");
        }
       }catch(Exception e){
         return ResponseEntity.ok().body("erro no try"+ e.getMessage());
       }
    }
    @PostMapping("/rewind")
    public ResponseEntity<?> rewind(HttpServletRequest request) {
        try{
            boolean pode = rewindService.podeRewind(request);
            if(pode){
                rewindService.RegistrarRewind(request);
                return ResponseEntity.ok().body("");
            }else{
                return ResponseEntity.ok().body("atualiza seu plano para poder executar rewinds");
            }
        }catch(Exception e){
             return ResponseEntity.ok().body("erro no try"+ e.getMessage()); 
        }
    }
    
}
