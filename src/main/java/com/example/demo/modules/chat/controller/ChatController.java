package com.example.demo.modules.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.demo.modules.chat.Repository.ChatRepository;
import com.example.demo.modules.chat.models.Chat;
import com.example.demo.modules.chat.models.Mensagem;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private  ChatRepository chatRepo;
    @MessageMapping("/Chat.send/{pessoa1Id}/{pessoa2Id}")
    public void enviarMsg(
        @DestinationVariable String pessoa1Id,
        @DestinationVariable String pessoa2Id,
        @Payload Mensagem msg
    ){

        String destino =  "/chat/"+pessoa1Id+"/"+pessoa2Id;
        messagingTemplate.convertAndSend(destino, msg);
        Chat chat = chatRepo.findByPessoa1IdAndPessoa2Id(pessoa1Id, pessoa2Id);
        chat.getMessages().add(msg);
        chatRepo.save(chat);
    }
}
