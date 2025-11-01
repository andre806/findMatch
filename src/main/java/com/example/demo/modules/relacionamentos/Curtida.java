package com.example.demo.modules.relacionamentos;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document("curtidas")
public class Curtida {
    private String quemCurteId;
    private String curtidoId;
    public Curtida(String quemCurteId,String curtidoId ){
        this.quemCurteId = quemCurteId;
        this.curtidoId = curtidoId;
    }
}
