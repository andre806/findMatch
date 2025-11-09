package com.example.demo.modules.explorar;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;

import org.springframework.http.ResponseEntity;

import com.example.demo.modules.usuarios.UserRepository;
import com.example.demo.services.Jwt;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import com.example.demo.modules.usuarios.User;
import java.util.Set;
import java.util.HashSet;
import com.example.demo.services.Cryp;
@RestController
@RequestMapping("/explorar")
public class ExplorarController {
    private final UserRepository userRepo;
    private final Jwt jwt;
    private final Cryp cryp;
    public ExplorarController(UserRepository userRepo, Jwt jwt, Cryp cryp){
        this.jwt = jwt;
        this.userRepo = userRepo;
        this.cryp = cryp;
    }
    @GetMapping("/explorarcidades")
    public ResponseEntity<?> ExplorarCidades(@RequestParam String cidade, HttpServletRequest request) {
        try {
            var email = jwt.getEmail(request);
            var user = userRepo.findByEmail(email);
            List<User> usersByCidade = userRepo.findByCidade(cidade);
            List<String> listaDeIds = new ArrayList<>();
            Set<String> IdsVisualizados = user.getPerfisVisualizados();
            if (IdsVisualizados == null) {
                IdsVisualizados = new HashSet<>();
            }

            int limit = Math.min(10, usersByCidade.size());
            for(int i = 0; i< limit; i++){
                if(IdsVisualizados.contains(usersByCidade.get(i).getId())){
                  
                }else{
                    listaDeIds.add(cryp.Cryptografar(usersByCidade.get(i).getId()));
                }
            }
            if(listaDeIds.isEmpty()){
                return ResponseEntity.ok().body("vc já visualizou todos os perfis dessa cidade");
            }else{
                return ResponseEntity.ok().body(listaDeIds);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("erro no try"+ e.getMessage());
        }
    }
    @GetMapping("/explorargostos")
    public ResponseEntity<?> explorargostos(@RequestParam String gosto, HttpServletRequest request) {
        try {
            var email = jwt.getEmail(request);
            var user = userRepo.findByEmail(email);
            Set<String> idsVisualizados = user.getPerfisVisualizados();
             if (idsVisualizados == null) {
                idsVisualizados = new HashSet<>();
            }

            List<User> userGosto = userRepo.findByGostos(gosto);
            List<String> listaIds = new ArrayList<>();
            int limit  = Math.min(10, userGosto.size());
            for(int i = 0; i< limit; i++){
                if(idsVisualizados.contains(userGosto.get(i).getId())){
                    
                }else{
                    listaIds.add(cryp.Cryptografar(userGosto.get(i).getId()));
                }
            }
            if(listaIds.isEmpty()){
                return ResponseEntity.ok().body("vc já visualizou todos os perfis com esse gosto");
            }else{
                return ResponseEntity.ok().body(listaIds);
            }
           

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("erro no try"+ e.getMessage());
        }
    }
    @GetMapping("/explorarProfissoes")
    public ResponseEntity<?> explorarprofissoes(@RequestParam String profissao, HttpServletRequest request) {
        try{
            var email = jwt.getEmail(request);
            var user = userRepo.findByEmail(email);
            List<User> usersByProfissão = userRepo.findByOcupacao(profissao);
            Set<String> IdsVisualizados = user.getPerfisVisualizados();
             if (IdsVisualizados == null) {
                IdsVisualizados = new HashSet<>();
            }

            List<String> listaIds = new ArrayList<>();
            int limit = Math.min(10, usersByProfissão.size());
            for(int i = 0; i < limit; i++){
                if(IdsVisualizados.contains(usersByProfissão.get(i).getId())){
                    
                }else{
                    listaIds.add(cryp.Cryptografar(usersByProfissão.get(i).getId()));
                }
            }
            if(listaIds.isEmpty()){
                return ResponseEntity.ok().body("vc já visualizou todos os perfis com essa profissao");
            }else{
                return ResponseEntity.ok().body(listaIds);
            }
        }catch (Exception e) {
            return ResponseEntity.badRequest().body("erro no try"+ e.getMessage());
        }
    }
    
    

}
