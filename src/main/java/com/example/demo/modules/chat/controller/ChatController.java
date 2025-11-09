package com.example.demo.modules.chat.controller;

import java.time.Instant;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.demo.modules.chat.Repository.ChatRepository;
import com.example.demo.modules.chat.models.Chat;
import com.example.demo.modules.chat.models.Mensagem;



import com.example.demo.modules.chat.Repository.MensagemRepository;
import com.example.demo.modules.chat.models.Msg;
@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private  ChatRepository chatRepo;
    @Autowired
    private MensagemRepository msgRepo;
    @MessageMapping("/Chat.send/{pessoa1Id}/{pessoa2Id}")
    public void enviarMsg(
        @DestinationVariable String pessoa1Id,
        @DestinationVariable String pessoa2Id,
        @Payload Msg msg
        
    ){
        String destino =  "/chat/"+pessoa1Id+"/"+pessoa2Id;
  
            messagingTemplate.convertAndSend(destino, msg);
       
        Chat chat = chatRepo.findByPessoa1IdAndPessoa2Id(pessoa1Id, pessoa2Id);
        if (chat == null) {
            System.out.println("Erro: chat não encontrado entre as pessoas informadas.");
            return;
        }
        var newMessage = new Mensagem(chat.getId(), msg.getSenderId(), msg.getContent(), Instant.now());
        msgRepo.save(newMessage);
     
       
    }
}
