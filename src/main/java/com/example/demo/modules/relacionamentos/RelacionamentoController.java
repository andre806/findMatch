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
@RestController
@RequestMapping("/Relacionamento")
public class RelacionamentoController {
    private final CurtidaRepository curtidaRepo;
    private final UserRepository userRepo;
    private final AWS aws;
    private final Jwt jwt;
    private final Cryp cryp;


    public RelacionamentoController(CurtidaRepository curtidaRepo, MatchRepository matchRepo, UserRepository userRepo, AWS aws, Jwt jwt, Cryp cryp) {
        this.curtidaRepo = curtidaRepo;
        this.userRepo = userRepo;
        this.aws = aws;
        this.jwt = jwt;
        this.cryp = cryp;
    }

    @PostMapping("/curtir")
    public ResponseEntity<?> curtir(HttpServletRequest request, @RequestParam String perfilId) {
        try {
            String email = jwt.getEmail(request);
           Curtida entity = new Curtida(email, perfilId);
        boolean jaCurtiu = curtidaRepo.existsByCurtidoIdAndQuemCurteId(email, perfilId);
        boolean reciproco = curtidaRepo.existsByCurtidoIdAndQuemCurteId(perfilId, email);
        if (jaCurtiu && reciproco) {
            
            return ResponseEntity.ok().body("match");
        }
        curtidaRepo.save(entity);
        return ResponseEntity.ok().body("curtida registrada");
        } catch (Exception e) {
            return ResponseEntity.ok().body("erro no try"+ e.getMessage());
        }
    }
    @GetMapping("/Fy")
    public ResponseEntity<?> Fy(HttpServletRequest request) {
        try {
            // Extrai o token JWT dos cookies
            String token = null;
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if ("token".equals(cookie.getName())) {
                        token = cookie.getValue();
                        break;
                    }
                }
            }
            if (token == null) {
                return ResponseEntity.status(401).body("Token não encontrado nos cookies");
            }
            String email = jwt.getEmailFromToken(token);
            var user = userRepo.findByEmail(email);
            var cidades = user.getCidadesExibicao();
            var genero = user.getToProcurando();

            List<User> usersCidade;
            if (cidades.contains("todas")) {
                usersCidade = userRepo.findAll();
            } else {
                usersCidade = cidades.stream()
                        .flatMap(p -> userRepo.findByCidade(p).stream())
                        .collect(Collectors.toList());
            }

            // Normaliza o gênero
            if (genero.equals("mulher")) {
                genero = "feminino";
            }
            if (genero.equals("homem")) {
                genero = "masculino";
            }

            List<User> usersCidadeGenero;
            if (genero.equals("qualquer um") || genero.equals("outro")) {
                usersCidadeGenero = usersCidade; // Não filtra por gênero
            } else {
                final String generoFinal = genero;
                usersCidadeGenero = usersCidade.stream()
                    .filter(p -> p.getGenero() != null && p.getGenero().equalsIgnoreCase(generoFinal))
                    .collect(Collectors.toList());
            }

            // Obtenha os ids visualizados pelo usuário logado (ids reais)
            Set<String> perfisVisualizados = user.getPerfisVisualizados();
            
            // Retorna apenas os ids criptografados que NÃO estão na lista de visualizados
            List<String> idsNaoVisualizados = usersCidadeGenero.stream()
                .filter(u -> !perfisVisualizados.contains(u.getId()))
                .map(u -> cryp.Cryptografar(u.getId()))
                .collect(Collectors.toList());

            return ResponseEntity.ok().body(idsNaoVisualizados);
        } catch (Exception e) {
            return ResponseEntity.ok().body("erro no try"+ e.getMessage());
        }
    }

    
}
