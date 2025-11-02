package com.example.demo.modules.usuarios;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;





public interface UserRepository extends MongoRepository<User, String>{
    boolean existsByEmail(String email);
     User findByEmail(String email);
     User findByNome(String nome);
    List<User> findByCidade(String cidade);
    List<User> findByGenero(String genero);
    List<User> findByGostos(String gosto);
    List<User> findByOcupacao(String ocupacao);
}