package com.example.demo.modules.relacionamentos.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.modules.usuarios.Plano;
import com.example.demo.modules.usuarios.User;
import com.example.demo.modules.usuarios.UserRepository;
import com.example.demo.services.Jwt;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class RewindService {
    @Autowired
    UserRepository userRepo;
    @Autowired
    Jwt jwt;

    protected Integer limitePremium = 3;
    protected Integer limiteGold = 5;
    public boolean podeRewind(HttpServletRequest request){
        User user = userRepo.findByEmail(jwt.getEmail(request));
        Integer quantidadeRewind = user.getQuantidadeRewind();
        if (quantidadeRewind == null) {
            quantidadeRewind = 0;
        }
        
        if(user.getPlanoStatus() == Plano.premium){
            return quantidadeRewind < limitePremium;
        }
         if(user.getPlanoStatus() == Plano.gold){
            return quantidadeRewind < limiteGold;
        }
        if(user.getPlanoStatus() == Plano.gigachad){
            return true;
        }else{
            return false;
        }
    }
    public void RegistrarRewind(HttpServletRequest request){
        User user = userRepo.findByEmail(jwt.getEmail(request));
        Integer atual = user.getQuantidadeRewind();
        if (atual == null) {
            atual = 0;
        }
        user.setQuantidadeRewind(atual + 1);
        userRepo.save(user);
    }
    @Scheduled(cron = "0 0 0 * * *") // todo dia à meia-noite
    public void resetarCurtidas() {
        List<User> users = userRepo.findAll();
        for(User i : users){
            if(i.getPlanoStatus() == null){
                 i.setQuantidadeCurtidasDiaria(0);
                 userRepo.save(i);
            }
        }
    }
    
}
