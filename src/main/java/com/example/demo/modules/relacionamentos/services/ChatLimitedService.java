package com.example.demo.modules.relacionamentos.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.modules.usuarios.Plano;
import com.example.demo.modules.usuarios.User;
import com.example.demo.modules.usuarios.UserRepository;
@Service
public class ChatLimitedService {
    @Autowired
    public UserRepository userRepo;
    protected Integer LimitePremium = 1;
    protected Integer LimiteGold = 3; 

    public boolean podeChat(User user){
        Integer atual = user.getQuantidadeChats() == null ? 0 : user.getQuantidadeChats();
        if(user.getPlanoStatus() == Plano.premium){
            return atual < LimitePremium;
        }
        if(user.getPlanoStatus() == Plano.gold){
            return atual < LimiteGold;
        }
        if(user.getPlanoStatus() == Plano.gigachad){
            return true;
        }else{
            return false;
        }
    }
    public void registrarChat(User user) {
    Integer atual = user.getQuantidadeChats() == null ? 0 : user.getQuantidadeChats();
    if (user.getPlanoStatus() == Plano.premium || user.getPlanoStatus() == Plano.gold || user.getPlanoStatus() == Plano.gigachad) {
        user.setQuantidadeChats(atual + 1);
        userRepo.save(user);
    }
}
    @Scheduled(cron = "0 0 0 * * *")
    public void resetarSuperLikes() {
        List<User> users = userRepo.findAll();
        for (User user : users) {
            if (user.getPlanoStatus() != Plano.gigachad) {
                user.setQuantidadeChats(0);
                userRepo.save(user);
            }
            
        }
    }
}
