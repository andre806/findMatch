package com.example.demo.modules.usuarios;
//  Cadastro e autenticação
// Edição de perfil básico
// Miniatura do usuário (exibição na “fy”)
// Gostos/interesses do usuário   

  import org.springframework.beans.factory.annotation.Autowired;

//endpoint login

  //end point para editar perfil

  // endpoint para pegar miniatura pelo Id

  //


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.modules.relacionamentos.Curtida;


import com.example.demo.services.Jwt;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.HashMap;

import org.springframework.web.multipart.MultipartFile;

import com.example.demo.services.AWS;

import java.io.IOException;

import jakarta.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

import com.example.demo.services.Cryp;
import com.example.demo.modules.relacionamentos.CurtidaRepository;
import com.example.demo.modules.relacionamentos.SuperLike;
import com.example.demo.modules.relacionamentos.SuperLikeRepository;
import com.example.demo.modules.relacionamentos.MatchRepository;
@RestController
@RequestMapping("/User")
public class UserController {
    private final UserRepository userRepo;
    private final Jwt jwt;
    private final AWS aws;
    private final Cryp cryp;
    @Autowired
    CurtidaRepository curtidaRepo;
    @Autowired
    SuperLikeRepository superRepo;
    @Autowired
    MatchRepository matchRepo;
    public UserController(UserRepository userRepo, Jwt jwt,AWS aws, Cryp cryp){
        this.userRepo = userRepo;
        this.jwt = jwt;
        this.aws = aws;
        this.cryp = cryp;
    }
    @PostMapping("/createUser")
    public ResponseEntity<?> createUser(@RequestBody User user) {
     try {
            userRepo.save(user);
            return ResponseEntity.ok().body("user salvo");
        } catch (Exception e) {
           return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
        }
    }
    @GetMapping("/VerificaLogado")
    public ResponseEntity<?> VerificaLogado(HttpServletRequest request){
       try{
        var email = jwt.getEmail(request);
        boolean res = userRepo.existsByEmail(email);
        return ResponseEntity.ok().body(res);
       }catch (Exception e) {
           return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
        }
    }
    @GetMapping("/VerificaLogadoEmail")
    public ResponseEntity<?> VerificaLogadoEmail(@RequestParam String email){
       try{
       
        boolean res = userRepo.existsByEmail(email);
        return ResponseEntity.ok().body(res);
       }catch (Exception e) {
           return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email,HttpServletResponse response) {
        try{
            var user = userRepo.findByEmail(email);
            if(user != null){
                String token = jwt.generateToken(user.getEmail(), user.getId());
                Cookie cookie = new Cookie("token", token);
                    cookie.setHttpOnly(true); // Mais seguro
                    cookie.setPath("/");
                    cookie.setMaxAge(86400); // 1 dia em segundos
                    response.addCookie(cookie);
                return ResponseEntity.ok().body("login realizado");
            }else{
                return ResponseEntity.badRequest().body("usuario não encontrado");
            }
        }
        catch (Exception e) {
           return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
        }
    }

   @PostMapping("/Passo1")
   public ResponseEntity<?> Passo1(@RequestParam String email, @RequestBody User data) {
      try{
         var user = userRepo.findByEmail(email);
         if (user != null) {
            user.setCidade(data.getCidade());
            user.setGenero(data.getGenero());
            user.setSexualidade(data.getSexualidade());
            user.setInteresse(data.getInteresse());
            user.setToProcurando(data.getToProcurando());
            user.setOcupacao(data.getOcupacao());
            userRepo.save(user);
            return ResponseEntity.ok().body("Passo 1 atualizado");
         } else {
            return ResponseEntity.badRequest().body("usuario não encontrado");
         }
      }catch (Exception e) {
           return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
        }
   }
   @PostMapping("/Passo2")
   public ResponseEntity<?> Passo2(@RequestParam String email, @RequestBody User data) {
       try{
           var user = userRepo.findByEmail(email);
           if (user != null) {
               user.setGostoMusical(data.getGostoMusical());
               user.setGostos(data.getGostos());
               user.setUrlFotos(data.getUrlFotos());
               user.setBio(data.getBio());
               user.setCidadesExibicao(data.getCidadesExibicao());
               user.setNumeroTelefone(data.getNumeroTelefone());
               user.setEducacao(data.getEducacao());
               user.setUrlFotoPerfil(data.getUrlFotoPerfil());
               userRepo.save(user);
               return ResponseEntity.ok().body("Passo 2 atualizado");
           } else {
               return ResponseEntity.badRequest().body("usuario não encontrado");
           }
       }catch (Exception e) {
           return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
       }
   }  
   @GetMapping("/Perfil")
   public ResponseEntity<?> Perfil(@RequestParam String email) {
      try {
         var user = userRepo.findByEmail(email);
         if (user == null) {
            return ResponseEntity.badRequest().body("usuario não encontrado");
         }
         // Retornar como JSON com campos nomeados
         var perfil = new HashMap<String, Object>();
         perfil.put("nome", user.getNome());
         perfil.put("gostos", user.getGostos());
         perfil.put("cidade", user.getCidade());
         perfil.put("genero", user.getGenero());
         perfil.put("sexualidade", user.getSexualidade());
         perfil.put("toProcurando", user.getToProcurando());
         perfil.put("cidadesExibicao", user.getCidadesExibicao());
         perfil.put("ocupacao", user.getOcupacao());
         perfil.put("educacao", user.getEducacao());
         perfil.put("bio", user.getBio());
         perfil.put("gostoMusical", user.getGostoMusical());
         perfil.put("urlFotos", user.getUrlFotos());
         perfil.put("urlFotoPerfil", user.getUrlFotoPerfil());
         perfil.put("numeroTelefone", user.getNumeroTelefone());
         perfil.put("perfilId", user.getId());
         return ResponseEntity.ok().body(perfil);
      } catch (Exception e) {
         return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
      }
   }
   @GetMapping("/verificaPasso1")
   public ResponseEntity<?> verificaPasso1(@RequestParam String email){
    try {
        var user = userRepo.findByEmail( email);
        if(user.getIdade() != null){
            return ResponseEntity.ok().body(true);
        }else{
            return ResponseEntity.ok().body(false);
        }
        

    } catch (Exception e) {
        return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
    }
   }
   @GetMapping("/Miniatura")
   public ResponseEntity<?> Miniatura(@RequestParam String userId) {
       try {
           // Remove todos os espaços do userId antes de descriptografar
           String userIdSanitized = userId.replaceAll("\\s+", "");
           var userIdCryp = cryp.descriptografar(userIdSanitized);
           var userOpt = userRepo.findById(userIdCryp);
           var user = userOpt.orElse(null);
           if (user == null) {
               return ResponseEntity.badRequest().body("usuario não encontrado");
           }
           
           HashMap<String, Object> map = new HashMap<>();
           map.put("urlFotoPerfil", user.getUrlFotoPerfil());
           map.put("nome", user.getNome());
           map.put("idade", user.getIdade());
           map.put("cidade", user.getCidade());
           map.put("gostoMusical", user.getGostoMusical());
           map.put("bio", user.getBio());
           map.put("ocupação", user.getOcupacao());
           map.put("sexualidade", user.getSexualidade());
           map.put("educacao", user.getEducacao());

           return ResponseEntity.ok().body(map);
       } catch (Exception e) {
           return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
       }
   }
   @PostMapping("/editarPerfil")
   public ResponseEntity<?> editarPerfil(@RequestParam String email, @RequestBody User user) {
       try{
        var userDb = userRepo.findByEmail(email);
           if (userDb == null) {
               return ResponseEntity.badRequest().body("usuario não encontrado");
           }
           userDb.setNome(user.getNome());
           userDb.setIdade(user.getIdade());
           userDb.setSpotifyId(user.getSpotifyId());
           userDb.setGostoMusical(user.getGostoMusical());
           userDb.setGostos(user.getGostos());
           userDb.setCidade(user.getCidade());
           userDb.setGenero(user.getGenero());
           userDb.setSexualidade(user.getSexualidade());
           userDb.setInteresse(user.getInteresse());
           userDb.setToProcurando(user.getToProcurando());
           userDb.setBio(user.getBio());
           userDb.setCidadesExibicao(user.getCidadesExibicao());
           userDb.setNumeroTelefone(user.getNumeroTelefone());
           userDb.setOcupacao(user.getOcupacao());
           userDb.setEducacao(user.getEducacao());
           userRepo.save(userDb);
           return ResponseEntity.ok().body("Perfil atualizado com sucesso");
       }catch (Exception e) {
           return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
       }
   }
   @PostMapping("/adiconarFoto")
   public ResponseEntity<?> adicionarFoto(@RequestParam("file") MultipartFile file, HttpServletRequest request) throws IOException {
      try {
        String email = jwt.getEmail(request);
         var user = userRepo.findByEmail(email);
         var urls = user.getUrlFotos();
         if(urls == null){
            urls = new ArrayList<>();
            user.setUrlFotos(urls);
         }
         if (urls.size() >= 4) {
            return ResponseEntity.badRequest().body("Limite máximo de 4 fotos atingido");
         }
         var fileKey = aws.uploadFoto(file);
         urls.add(fileKey);
         user.setUrlFotos(urls); // garantir atualização
         userRepo.save(user);
         return ResponseEntity.ok().body("foto salva");
      } catch (Exception e) {
         return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
      }
   }
   @GetMapping("/listarFotosByUser")
   public ResponseEntity<?> listarFotosByUser(@RequestParam String userId) {
      try {
         String userIdSanitized = cryp.descriptografar(userId);
         var userOpt = userRepo.findById(userIdSanitized);
         var user = userOpt.orElse(null);

         // Se não encontrar, tenta descriptografar e buscar de novo
         if (user == null) {
            try {
               String userIdDescrypt = cryp.descriptografar(userIdSanitized);
               userOpt = userRepo.findById(userIdDescrypt);
               user = userOpt.orElse(null);
            } catch (Exception e) {
               // ignora, vai retornar erro abaixo
            }
         }

         if (user == null) {
            return ResponseEntity.badRequest().body("usuario não encontrado");
         }
         var fileKeys = user.getUrlFotos();
         if (fileKeys == null) {
            fileKeys = new ArrayList<>();
         }
         // Gera presigned URLs para cada foto a partir do fileKey
         ArrayList<String> presignedUrls = new ArrayList<>();
         for (String fileKey : fileKeys) {
            presignedUrls.add(aws.generatPressignedUrl(fileKey));
         }
         return ResponseEntity.ok().body(presignedUrls);
      } catch (Exception e) {
         return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
      }
   }
@PostMapping("/excluirFoto")
public ResponseEntity<?> excluirFoto(HttpServletRequest request, @RequestParam String fileKey) {
   try {
      String email = jwt.getEmail(request);
      var user = userRepo.findByEmail(email);

      // Extrai o nome do arquivo se vier uma URL
      String sanitizedFileKey = aws.extractFileKey(fileKey.trim());
      ArrayList<String> fotos = user.getUrlFotos() == null ? new ArrayList<>() : new ArrayList<>(user.getUrlFotos());
      System.out.println("fileKey recebido: " + sanitizedFileKey);
      System.out.println("Lista de fotos do usuário: " + fotos);

      boolean removed = fotos.removeIf(fk -> fk.trim().equals(sanitizedFileKey));
      user.setUrlFotos(fotos); // Atualiza explicitamente
      userRepo.save(user);
      if (!removed) {
         return ResponseEntity.badRequest().body("fileKey não encontrado na lista do usuário");
      }
      // Exclui a foto do S3 usando o nome do arquivo
      try {
         aws.excluirFoto(sanitizedFileKey);
      } catch (Exception e) {
         return ResponseEntity.badRequest().body("não excluiu no aws" + e.getMessage());
      }
      return ResponseEntity.ok().body("foto excluída");
   } catch (Exception e) {
      return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
   }
}

   @PostMapping("/trocarFoto")
   public ResponseEntity<?> trocarFoto(HttpServletRequest request, @RequestParam String antigaFileKey, @RequestBody MultipartFile novaFoto) {
      try {
         String email = jwt.getEmail(request);
         var user = userRepo.findByEmail(email);
         // Troca a foto no S3 e retorna o novo fileKey
         var novoFileKey = aws.trocarFotos(antigaFileKey, novaFoto);
         var fileKeys = user.getUrlFotos();
         var key = aws.extractFileKey(antigaFileKey);
         int idx = fileKeys.indexOf(key.trim());
         var novaKey = aws.extractFileKey(novoFileKey);
         if (idx != -1) {
            fileKeys.set(idx, novaKey.trim());
         } else {
            fileKeys.add(novaKey.trim());
         }
         user.setUrlFotos(fileKeys);
         userRepo.save(user);
         return ResponseEntity.ok().body("foto trocada");
      } catch (Exception e) {
         return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
      }
   }

   @PostMapping("/visualizarPerfil")
   public ResponseEntity<?> visualizarPerfil(@RequestParam String perfilId, HttpServletRequest request) {
      String perfilIdDescrypt;
    
      try {
         // Descriptografa o perfilId recebido
         perfilIdDescrypt = cryp.descriptografar(perfilId);
          
         if (perfilIdDescrypt == null || perfilIdDescrypt.isEmpty()) {
            return ResponseEntity.badRequest().body("perfilId inválido ou não descriptografado");
         } 
         var user = userRepo.findById(perfilIdDescrypt).get();
         if(user.getPlanoStatus() == Plano.gigachad){
          return ResponseEntity.badRequest().body("");
      }
      } catch (Exception e) {
         return ResponseEntity.badRequest().body("erro ao descriptografar perfilId: " + e.getMessage());
      }
      try {
         // Busca o usuário logado pelo JWT
         String email = jwt.getEmail(request);
         var userLogado = userRepo.findByEmail(email);
         if (userLogado == null) {
            return ResponseEntity.badRequest().body("usuario logado não encontrado");
         }

         // Inicializa o conjunto se estiver null ou vazio
         Set<String> arr = userLogado.getPerfisVisualizados();
         if (arr == null || arr.isEmpty()) {
            arr = new HashSet<>();
            userLogado.setPerfisVisualizados(arr);
         }
         
         if (!arr.contains(perfilIdDescrypt)) {
            arr.add(perfilIdDescrypt);
            userLogado.setPerfisVisualizados(arr);
            userRepo.save(userLogado);
         }

         return ResponseEntity.ok().body("perfil visualizado registrado");
      } catch (Exception e) {
         return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
      }
   }
   @GetMapping("/getIdCodificado")
   public ResponseEntity<?> getIdCodificado(HttpServletRequest request) {
      try{
         var email = jwt.getEmail(request);
         var userId = userRepo.findByEmail(email).getId();
         var IdCriptografado = cryp.Cryptografar(userId);
         return ResponseEntity.ok().body(IdCriptografado);
      }catch(Exception e){
         return ResponseEntity.badRequest().body("erro no try" + e.getMessage()); 
      }
   }
   @GetMapping("/getStatusPagamento")
   public ResponseEntity<?> getStatusPagamento(HttpServletRequest request){
      try {
         var email = jwt.getEmail(request);
         var user = userRepo.findByEmail(email);
         var status = user.getPlanoStatus();
         return ResponseEntity.ok().body(status);
      } catch (Exception e) {
          return ResponseEntity.badRequest().body("erro no try" + e.getMessage()); 
      }
   }
   @GetMapping("/verCurtidas")
   public ResponseEntity<?> verCurtidas(HttpServletRequest request) {
       try{
         var user = userRepo.findByEmail(jwt.getEmail(request));
         var status = user.getPlanoStatus();
      
         if(status == null){
            return ResponseEntity.ok().body(false);
         }else{
            List<Curtida> curtidas = curtidaRepo.findByCurtidoId(user.getId());
            List<String> ids = new ArrayList<>();
            for(Curtida i : curtidas){
               ids.add(cryp.Cryptografar(i.getCurtidoId()));
            }
            return ResponseEntity.ok().body(ids);
         }
       }catch (Exception e) {
          return ResponseEntity.badRequest().body("erro no try" + e.getMessage()); 
      }
   }
   
   @GetMapping("/verSuperlikes")
   public ResponseEntity<?> verSuperlikes(HttpServletRequest request) {
       try {
         var user = userRepo.findByEmail(jwt.getEmail(request));
         var status = user.getPlanoStatus();
         
         if (status == null) {
            return ResponseEntity.ok().body(false);
         } else {
            List<SuperLike> superlikes = superRepo.findByCurtidoId(user.getId());
            List<String> ids = new ArrayList<>();
            for (Curtida i : superlikes) {
                ids.add(cryp.Cryptografar(i.getCurtidoId()));
            }
            return ResponseEntity.ok().body(ids);
         }
       } catch (Exception e) {
          return ResponseEntity.badRequest().body("erro no try" + e.getMessage()); 
      }
   }
   @GetMapping("/getQuantidadeCurtidas")
   public ResponseEntity<?> getQuantidadeCurtidas(HttpServletRequest request) {
       try{
         var user = userRepo.findByEmail(jwt.getEmail(request));
         var count = curtidaRepo.countByCurtidoId(user.getId());
         return ResponseEntity.ok().body(count);
       }catch(Exception e){
         return ResponseEntity.badRequest().body("erro no try" + e.getMessage()); 
       }
   }
   @GetMapping("/getQuantidadeSuperLike")
   public ResponseEntity<?> getQuantidadeSuperLike(HttpServletRequest request) {
       try{
         var user = userRepo.findByEmail(jwt.getEmail(request));
         var count = superRepo.countByCurtidoId(user.getId());
         return ResponseEntity.ok().body(count);
       }catch(Exception e){
         return ResponseEntity.badRequest().body("erro no try" + e.getMessage()); 
       }
   }
   @GetMapping("/getQuantidadeMatch")
   public ResponseEntity<?> getQuantidadeMatch(HttpServletRequest request) {
       try{
         var user = userRepo.findByEmail(jwt.getEmail(request));
         var count = matchRepo.countByUser1OrUser2(user.getId());
         return ResponseEntity.ok().body(count);
       }catch(Exception e){
         return ResponseEntity.badRequest().body("erro no try" + e.getMessage()); 
       }
   }
   
   
}


