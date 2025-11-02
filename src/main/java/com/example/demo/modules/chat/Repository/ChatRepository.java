package com.example.demo.modules.chat.Repository;
import java.util.List;


import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.demo.modules.chat.models.Chat;
public interface ChatRepository extends MongoRepository<Chat, String>{
    Chat findByPessoa1IdAndPessoa2Id(String pessoa1Id, String pessoa2Id);
    List<Chat> findByPessoa1IdOrPessoa2Id(String pessoa1Id, String pessoa2Id);
}
