package com.example.demo.modules.relacionamentos;

import org.springframework.data.mongodb.repository.MongoRepository;


public interface CurtidaRepository extends MongoRepository<Curtida, String> {
   Curtida findByQuemCurteId(String quemCurteId);
   boolean existsByCurtidoIdAndQuemCurteId(String curtidoId, String quemCurteId);
}
