package com.example.demo.modules.chat.models;
import java.util.List;

import lombok.Data;
@Data
public class Chat {
    private String id;
    protected String pessoa1Id;
    protected String pessoa2Id;
   

    public Chat(String pessoa1Id, String pessoa2Id){
        this.pessoa1Id =pessoa1Id;
        this.pessoa2Id =pessoa2Id;
    }
}
