package com.example.demo.modules.payment;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.modules.usuarios.Plano;
import com.example.demo.modules.usuarios.UserRepository;
import com.example.demo.services.Jwt;
import com.stripe.Stripe;
import com.stripe.model.Charge;

import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Value("${Stripe.apiKey}")
    private String apiKey;
    @Autowired
    private Jwt jwt;
    @Autowired
    private UserRepository userRepo;


    @PostMapping("/pagar")
public ResponseEntity<?> pagar(@RequestBody PaymentRequest req, HttpServletRequest request) {
    try {
        System.out.println("=== DEBUG INICIO ===");
        
        // Debug do request
        if (req == null) {
            System.out.println("PaymentRequest é nulo");
            return ResponseEntity.badRequest().body("PaymentRequest é nulo");
        }
        
        System.out.println("Amount: " + req.getAmount());
        System.out.println("Token: " + req.getToken());
        
        if (req.getToken() == null) {
            System.out.println("Token é nulo");
            return ResponseEntity.badRequest().body("Token é nulo");
        }
        
        // Debug do JWT
        String email = jwt.getEmail(request);
        System.out.println("Email extraído: " + email);
        
        if (email == null) {
            System.out.println("Email é nulo");
            return ResponseEntity.badRequest().body("Email é nulo");
        }
        
        // Debug do usuário
        var user = userRepo.findByEmail(email);
        System.out.println("Usuário encontrado: " + (user != null ? user.getId() : "null"));
        
        if (user == null) {
            System.out.println("Usuário não encontrado");
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        
        // Debug da API Key
        System.out.println("API Key existe: " + (apiKey != null && !apiKey.isEmpty()));
        
        if (apiKey == null || apiKey.isEmpty()) {
            return ResponseEntity.badRequest().body("API Key do Stripe não configurada");
        }
        
        // Inicializa a Stripe
        Stripe.apiKey = apiKey;
        System.out.println("Stripe inicializado");
        
        // Define o plano
        if (req.getAmount() == 1000) {
            user.setPlanoStatus(Plano.premium);
            user.setTimePlano((int) (System.currentTimeMillis() / 1000)); // Converte para Integer (segundos)
            System.out.println("Plano definido: premium");
        } else if (req.getAmount() == 4000) {
            user.setPlanoStatus(Plano.gold);
            user.setTimePlano((int) (System.currentTimeMillis() / 1000)); // Converte para Integer (segundos)
            System.out.println("Plano definido: gold");
        } else if (req.getAmount() == 5000) {
            user.setPlanoStatus(Plano.gigachad);
            user.setTimePlano((int) (System.currentTimeMillis() / 1000)); // Converte para Integer (segundos)
            System.out.println("Plano definido: gigachad");
        } else {
            System.out.println("Valor inválido: " + req.getAmount());
            return ResponseEntity.badRequest().body("Valor de pagamento inválido");
        }
        
        // Prepara dados para Stripe
        System.out.println("Preparando dados para Stripe...");
        HashMap<String, Object> map = new HashMap<>();
        map.put("amount", req.getAmount());
        map.put("currency", "brl");
        map.put("source", req.getToken());
        
        System.out.println("Criando charge...");
        Charge charge = Charge.create(map);
        System.out.println("Charge criado: " + charge.getId());
        
        System.out.println("Salvando usuário...");
        userRepo.save(user);
        System.out.println("Usuário salvo");
        
        System.out.println("=== DEBUG FIM ===");
        return ResponseEntity.ok(charge.getId());
        
    } catch (Exception e) {
        System.out.println("ERRO CAPTURADO: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.badRequest().body("erro no try: " + e.getMessage());
    }
}
    
}
