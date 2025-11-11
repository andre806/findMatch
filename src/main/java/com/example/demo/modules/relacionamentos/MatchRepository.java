package com.example.demo.modules.relacionamentos;

import org.springframework.data.mongodb.repository.MongoRepository;
public interface MatchRepository extends MongoRepository<Match, String>{
    
    long countByUser1OrUser2(String userId);
}
