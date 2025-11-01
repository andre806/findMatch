package com.example.demo.modules.usuarios;
//  Cadastro e autenticação
// Edição de perfil básico
// Miniatura do usuário (exibição na “fy”)
// Gostos/interesses do usuário   

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

import com.example.demo.modules.usuarios.User;
import com.example.demo.modules.usuarios.UserRepository;

import com.example.demo.services.Jwt;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.HashMap;

import org.springframework.web.multipart.MultipartFile;

import com.example.demo.services.AWS;

import java.io.IOException;

import jakarta.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import com.example.demo.services.Cryp;
@RestController
@RequestMapping("/User")
public class UserController {
    private final UserRepository userRepo;
    private final Jwt jwt;
    private final AWS aws;
    private final Cryp cryp;
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
    public ResponseEntity<?> VerificaLogado(@RequestParam String email){
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
         var userIdCryp = cryp.descriptografar(userId);
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
         var foto = aws.uploadFoto(file);
         var urls = user.getUrlFotos();
         if(urls == null){
            urls = new ArrayList<>();
            user.setUrlFotos(urls);
         }
         urls.add(foto);
         user.setUrlFotos(urls); // garantir atualização
         userRepo.save(user);
         return ResponseEntity.ok().body("foto salva");
      } catch (Exception e) {
         return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
      }
   }

 // ...existing code...
@PostMapping("/excluirFoto")
public ResponseEntity<?> excluirFoto(HttpServletRequest request, @RequestParam String fotoUrl) {
   try {
      String email = jwt.getEmail(request);
      var user = userRepo.findByEmail(email);

      // Extrai apenas o path do arquivo da URL
      try{
         aws.excluirFoto(fotoUrl);
      }catch (Exception e) {
      return ResponseEntity.badRequest().body("não excluiu no aws" + e.getMessage());
   }
   try{
     var fotos = user.getUrlFotos();
String fotoKey = fotoUrl.split("\\?")[0]; // pega só a parte antes do '?'
int idx = -1;
for (int i = 0; i < fotos.size(); i++) {
    String salva = fotos.get(i).split("\\?")[0];
    if (salva.equals(fotoKey)) {
        idx = i;
        break;
    }
}
if (idx != -1) {
    fotos.remove(idx);
    user.setUrlFotos(fotos);
    userRepo.save(user);
}
   }catch (Exception e) {
      return ResponseEntity.badRequest().body("não apagou no db" + e.getMessage());
   }
      
      return ResponseEntity.ok().body("foto excluída");
   } catch (Exception e) {
      return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
   }
}
// ...existing code...


   @PostMapping("/trocarFoto")
   public ResponseEntity<?> trocarFoto(HttpServletRequest request, @RequestParam String antigaUrl, @RequestBody MultipartFile novaFoto) {
      try {
         String email = jwt.getEmail(request);
         var user = userRepo.findByEmail(email);
         var novaUrl = aws.trocarFotos(antigaUrl, novaFoto); // usa método do serviço
         var urls = user.getUrlFotos();
         int idx = urls.indexOf(antigaUrl);
         if (idx != -1) {
            urls.set(idx, novaUrl);
         } else {
            urls.add(novaUrl);
         }
         user.setUrlFotos(urls);
         userRepo.save(user);
         return ResponseEntity.ok().body("foto trocada");
      } catch (Exception e) {
         return ResponseEntity.badRequest().body("erro no try" + e.getMessage());
      }
   }

   @GetMapping("/listarFotosByUser")
   public ResponseEntity<?> listarFotosByUser(@RequestParam String userId) {
      try {
         var userIdDescrypt = cryp.descriptografar(userId);
         var userOpt = userRepo.findById(userIdDescrypt);
         var user = userOpt.orElse(null);
         if (user == null) {
            return ResponseEntity.badRequest().body("usuario não encontrado");
         }
         var urls = user.getUrlFotos();
         if (urls == null) {
            urls = new ArrayList<>();
         }
         // Gera presigned URLs para cada foto
         ArrayList<String> presignedUrls = new ArrayList<>();
         for (String url : urls) {
            presignedUrls.add(aws.generatPressignedUrl(url));
         }
         return ResponseEntity.ok().body(presignedUrls);
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

         // Adiciona o perfil visualizado se ainda não estiver na lista
         Set<String> arr = userLogado.getPerfisVisualizados();
         if (arr == null) {
            arr = new HashSet<>();
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
}


