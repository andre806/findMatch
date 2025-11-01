package com.example.demo.modules.relacionamentos;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document("match")
public class Match {
    private String user1;
    private String user2;
    public Match(String user1, String user2){
        this.user1 =user1;
        this.user2 = user2;
    }
  
}
