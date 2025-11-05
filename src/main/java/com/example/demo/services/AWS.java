package com.example.demo.services;

import java.io.IOException;
import java.net.URL;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.HttpMethod;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;

@Service
public class AWS {
    //metodo para enviar foto
    //metodo para excluir foto
    private final AmazonS3 s3Client;
    private final String bucketName;

    public AWS(
        @Value("${cloud.aws.credentials.access-key}") String accessKey,
        @Value("${cloud.aws.credentials.secret-key}") String secretKey,
        @Value("${cloud.aws.region.static}") String region,
        @Value("${cloud.aws.s3.bucket}") String bucketName
    ) {
        this.bucketName = bucketName;
        BasicAWSCredentials awsCreds = new BasicAWSCredentials(accessKey, secretKey);
        this.s3Client = AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                .build();
    }
    
    private URL generatePresignedUrl(String fileKey) {
        // Define validade do link (exemplo: 1 hora)
        Date expiration = new Date(System.currentTimeMillis() + 3600 * 1000);
        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucketName, fileKey)
                        .withMethod(HttpMethod.GET)
                        .withExpiration(expiration);
        return s3Client.generatePresignedUrl(generatePresignedUrlRequest);
    }

    public String uploadFoto(MultipartFile file) throws IOException{
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");
        s3Client.putObject(bucketName, fileName, file.getInputStream(), null);
        // Retorna presigned URL
        return fileName;
    }
    public String excluirFoto(String urlFoto){
        try {
            // Extrai o fileKey pegando tudo após o último "/"
            String fileKey = urlFoto.substring(urlFoto.lastIndexOf("/") + 1);
            int queryIndex = fileKey.indexOf("?");
            if (queryIndex != -1) {
                fileKey = fileKey.substring(0, queryIndex);
            }
            System.out.println("Deletando fileKey: " + fileKey); // log para depuração
            s3Client.deleteObject(bucketName, fileKey); 
            return "foto deletada";
        } catch (Exception e) {
            System.err.println("Erro ao deletar foto: " + e.getMessage());
            return "erro ao deletar foto: " + e.getMessage();
        }
    }
    public String trocarFotos(String urlAntiga, MultipartFile atual) throws IOException{
        excluirFoto(urlAntiga);
        String fileName = atual.getOriginalFilename();
        s3Client.putObject(bucketName, fileName, atual.getInputStream(), null);
        // Retorna presigned URL
        return generatePresignedUrl(fileName).toString();
    }
    public String generatPressignedUrl(String fileKey) {
    if (fileKey == null || fileKey.isEmpty()) return null;
    return generatePresignedUrl(fileKey).toString();
}
    public String getOriginalS3Url(String url) {
    if (url == null || url.isEmpty()) return null;
    // Extrai o fileKey do final da URL (após o último '/'), removendo parâmetros
    String fileKey = url.substring(url.lastIndexOf("/") + 1);
    int queryIndex = fileKey.indexOf("?");
    if (queryIndex != -1) {
        fileKey = fileKey.substring(0, queryIndex);
    }
    // Monta a URL padrão do S3
    return "https://" + bucketName + ".s3.amazonaws.com/" + fileKey;
}
public String extractFileKey(String url) {
    // Extrai apenas o nome do arquivo da URL
    int start = url.lastIndexOf("/") + 1;
    int end = url.indexOf("?", start);
    if (end == -1) end = url.length();
    return url.substring(start, end);
}
}
