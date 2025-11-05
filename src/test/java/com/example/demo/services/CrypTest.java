package com.example.demo.services;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.test.util.ReflectionTestUtils;

import com.example.demo.services.Cryp;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
public class CrypTest {
    private Cryp cryp;

    @BeforeEach
    public void setUp(){
        cryp = new Cryp();
        ReflectionTestUtils.setField(cryp, "secretKey", "njbhvgcfxdzsdxfc");
    }
  @Test
    public void testEncryptAndDecrypt() {
        String original = "u8VBcQELNjG5y2e0Mj9jVsAoxp+1kn8Rm3MKGnbI160=";
        String encrypted = cryp.Cryptografar(original);
        String decrypted = cryp.descriptografar(encrypted);
        assertEquals(original, decrypted);
    }

    @Test
    public void testDecryptInvalidData() {
        assertThrows(RuntimeException.class, () -> {
            cryp.descriptografar("invalid_base64");
        });
    }
}