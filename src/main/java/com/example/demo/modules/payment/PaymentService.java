package com.example.demo.modules.payment;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.modules.usuarios.UserRepository;
@Service
public class PaymentService {
    @Autowired
    UserRepository userRepo;
    
    @Scheduled(cron = "0 0 0 * * ?") // Executa diariamente às 00:00
    @Transactional
    public void checkExpiredPlans() {
        LocalDateTime now = LocalDateTime.now();
        userRepo.findAll().forEach(user -> {
            if (user.getPlanoStatus() != null && user.getTimePlano() != null) {
                LocalDateTime planDate = LocalDateTime.ofInstant(
                    Instant.ofEpochSecond(user.getTimePlano()), // Usar ofEpochSecond para Integer
                    ZoneId.systemDefault()
                );
                LocalDateTime planExpiry = planDate.plusMonths(1);
                if (now.isAfter(planExpiry)) {
                    user.setPlanoStatus(null);
                    user.setTimePlano(null);
                    userRepo.save(user);
                }
            }
        });
    }

    public void Timer(){
        
    }

}
