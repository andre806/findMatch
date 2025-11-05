package com.example.demo.modules.chat.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.modules.chat.models.Mensagem;
import java.util.List;

public interface MensagemRepository extends MongoRepository<Mensagem, String> {
    List<Mensagem> findByChatId(String chatId);
}
