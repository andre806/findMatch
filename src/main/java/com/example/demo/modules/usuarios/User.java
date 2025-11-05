package com.example.demo.modules.usuarios;

import java.util.List;
import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String id;
    private String nome;
    private Integer idade;
    private String senha;
    private String email;
    private String spotifyId; 
    private String gostoMusical;
    private List<String> gostos;
    private List<String> urlFotos;
    private String cidade;
    private String genero;
    private String sexualidade;
    private String interesse;
    private String toProcurando;
    private String bio;
    private List<String> cidadesExibicao; 
    private String numeroTelefone; 
    private String ocupacao;
    private String educacao;
    private String urlFotoPerfil; 
    private boolean premium;
    private Set<String> perfisVisualizados;
}
