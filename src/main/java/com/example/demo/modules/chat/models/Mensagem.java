package com.example.demo.modules.chat.models;

import lombok.Data;

import java.time.Instant;

import org.springframework.data.mongodb.core.mapping.Document;
@Data
@Document(collection = "mensagens")
public class Mensagem {
    protected String chatId;
    protected String userId;
    protected String content;
    protected Instant timeStamp;
    public Mensagem(String chatId,String userId,String content,Instant timeStamp){
        this.chatId = chatId;
        this.userId = userId;
        this.content = content;
        this.timeStamp = timeStamp;
    }
}
