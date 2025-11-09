package com.example.demo.modules.relacionamentos.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;

import com.example.demo.modules.usuarios.UserRepository;
import com.example.demo.modules.usuarios.User;
import com.example.demo.modules.usuarios.Plano;
public class SuperLikeLimitedService {
   @Autowired
    UserRepository userRepo;
    protected Integer LimitePremium = 3;
    protected Integer LimiteGold = 6;

    

    public boolean podeSuperLike(User user) {
            Integer atual = user.getQuantidadeSuperLikesDiario() == null ? 0 : user.getQuantidadeSuperLikesDiario();
            if(user.getPlanoStatus() == Plano.premium){
                return atual < LimitePremium;
            }
             if(user.getPlanoStatus() == Plano.gold){
                return atual  < LimiteGold;
            }
             if(user.getPlanoStatus() == Plano.gigachad){
                return true;
            }
            return false;
            
           
        
    }

    public void registrarSuperLike(User user) {
        if (user.getPlanoStatus() != Plano.gigachad) {
            int atual = user.getQuantidadeSuperLikesDiario() == null ? 0 : user.getQuantidadeSuperLikesDiario();
            user.setQuantidadeSuperLikesDiario(atual + 1);
            userRepo.save(user);
        }
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void resetarSuperLikes() {
        List<User> users = userRepo.findAll();
        for (User user : users) {
            if (user.getPlanoStatus() != Plano.gigachad) {
                user.setQuantidadeSuperLikesDiario(0);
                userRepo.save(user);
            }
            
        }
    }
}
