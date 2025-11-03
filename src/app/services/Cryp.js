// Serviço de criptografia AES para uso no Next.js (Node.js)
import crypto from "crypto";

const ALGORITHM = "aes-128-ecb";

function getSecretKey() {
    const key = process.env.SECRET_KEY;
    if (!key) throw new Error("SECRET_KEY não definida no .env");
    // Garante 16 bytes
    return Buffer.from(key.slice(0, 16), "utf8");
}

export class Cryp {
    constructor(data) {
        this.data = data;
    }

    cryptografar(data) {
        try {
            const cipher = crypto.createCipheriv(ALGORITHM, getSecretKey(), null);
            let encrypted = cipher.update(data, "utf8", "base64");
            encrypted += cipher.final("base64");
            return encrypted;
        } catch (e) {
            throw new Error("Erro ao criptografar: " + e.message);
        }
    }

    descriptografar(data) {
        try {
            const decipher = crypto.createDecipheriv(ALGORITHM, getSecretKey(), null);
            let decrypted = decipher.update(data, "base64", "utf8");
            decrypted += decipher.final("utf8");
            return decrypted;
        } catch (e) {
            throw new Error("Erro ao descriptografar: " + e.message);
        }
    }
}
