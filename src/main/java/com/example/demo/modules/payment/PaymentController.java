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
        try{
            var email = jwt.getEmail(request);
            var user = userRepo.findByEmail(email);
            // Inicializa a Stripe com a chave secreta
            Stripe.apiKey = apiKey;
            if(req.getAmount() == 10){
                user.setPlanoStatus(Plano.premium);
            }
            if(req.getAmount() == 40){
                user.setPlanoStatus(Plano.gold);
            }
             if(req.getAmount() == 50){
                user.setPlanoStatus(Plano.gigachad);
            }
            HashMap<String, Object> map = new HashMap<>();
            map.put("amount", req.getAmount());
            map.put("currency", "brl");
            map.put("source", req.getToken()); // Token gerado pelo front-end
            Charge charge = Charge.create(map);
            return ResponseEntity.ok(charge.getId());

        }catch(Exception e){
            return ResponseEntity.badRequest().body("erro no try"+ e.getMessage());
        }
       
    }
    
}
