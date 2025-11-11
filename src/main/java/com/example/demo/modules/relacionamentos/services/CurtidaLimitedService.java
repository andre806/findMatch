package com.example.demo.modules.relacionamentos.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.modules.usuarios.User;
import com.example.demo.modules.usuarios.UserRepository;
import com.example.demo.services.Jwt;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class CurtidaLimitedService {
    @Autowired
    UserRepository userRepo;
    @Autowired
    Jwt jwt;

    
    Integer LIMITE = 15;
    public boolean podeCurtir(String userId,HttpServletRequest request) {
        var user = userRepo.findByEmail(jwt.getEmail(request));
        if (user.getPlanoStatus() != null) {
            // Ajuste conforme o tipo do plano, ex: user.getPlanoStatus().isPremium()
            return true; // Tem plano, curtidas infinitas
        }
        Integer quantidadeCurtidas = user.getQuantidadeCurtidasDiaria();
        if (quantidadeCurtidas == null) {
            quantidadeCurtidas = 0;
        }
        return quantidadeCurtidas < LIMITE;
    }

     public void registrarCurtida(User user) {
            int atual = user.getQuantidadeCurtidasDiaria() == null ? 0 : user.getQuantidadeCurtidasDiaria();
            user.setQuantidadeCurtidasDiaria(atual + 1);
            userRepo.save(user);
        // Se tem plano, não precisa registrar
    }

    @Scheduled(cron = "0 0 0 * * *") // todo dia à meia-noite
    public void resetarCurtidas() {
        List<User> users = userRepo.findAll();
        for(User i : users){
           
                 i.setQuantidadeCurtidasDiaria(0);
                 userRepo.save(i);
            
        }
    }
}
