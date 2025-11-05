package com.example.demo.services;

import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class Cryp {
    public String data;
    private static final String ALGORITHM = "AES";

    @Value("${crypto.secret-key}")
    private String secretKey;

    public Cryp() {
        // construtor padrão para Spring
    }

    public Cryp(String data){
        this.data = data;
    }

    public String Cryptografar(String data){
        try {
            SecretKeySpec key = new SecretKeySpec(secretKey.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] encrypted = cipher.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao criptografar", e);
        }
    }

    public String descriptografar(String data){
        try {
            SecretKeySpec key = new SecretKeySpec(secretKey.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, key);
            byte[] decoded = Base64.getDecoder().decode(data);
            byte[] decrypted = cipher.doFinal(decoded);
            return new String(decrypted);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao descriptografar"+ e.getMessage());
        }
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public static void main(String args[]){
      var cryp = new Cryp("6904aebe3976ff4a84a6127a");
      cryp.setSecretKey("njbhvgcfxdzsdxfc"); // Defina a chave manualmente para testes locais
      System.out.println(cryp.Cryptografar("6904aebe3976ff4a84a6127a"));
      System.err.println(cryp.descriptografar("u8VBcQELNjG5y2e0Mj9jVsAoxp+1kn8Rm3MKGnbI160="));
    }

}