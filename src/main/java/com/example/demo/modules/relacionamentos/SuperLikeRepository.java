package com.example.demo.modules.relacionamentos;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
public interface SuperLikeRepository extends MongoRepository<SuperLike, String> {
   SuperLike findByQuemCurteId(String quemCurteId);
   boolean existsByCurtidoIdAndQuemCurteId(String curtidoId, String quemCurteId);
   int countByCurtidoId(String curtidoId);
   List<SuperLike> findByCurtidoId(String curtidoId);
}
