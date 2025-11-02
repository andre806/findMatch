package com.example.demo.modules.feed;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.modules.usuarios.User;
import com.example.demo.modules.usuarios.UserRepository;
import com.example.demo.services.Cryp;
import com.example.demo.services.Jwt;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/feed")
public class FeedController {
    private final Jwt jwt;
    private final UserRepository userRepo;
    private final Cryp cryp;

    public FeedController(Jwt jwt,UserRepository userRepo,Cryp cryp){
        this.jwt = jwt;
        this.userRepo = userRepo;
        this.cryp = cryp;


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
            int limite = Math.min(10, idsNaoVisualizados.size());
            List<String> IdsEnviar = new ArrayList<>();
            for (int i = 0; i < limite; i++) {
                IdsEnviar.add(idsNaoVisualizados.get(i));
            }

            return ResponseEntity.ok().body(IdsEnviar);
        } catch (Exception e) {
            return ResponseEntity.ok().body("erro no try"+ e.getMessage());
        }
    }

}
