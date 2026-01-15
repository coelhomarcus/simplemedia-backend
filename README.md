# LuneBox | Back-end

Backend de uma plataforma simples de vídeos.
A proposta inicial do projeto é **armazenar apenas referências (URLs)** de mídia no backend e distribuí-las de acordo com o conteúdo.

Este projeto foi criado principalmente como um **laboratório de estudo**, para explorar o uso do **Bun** como runtime e suas libs.

## Tecnologias 🧰

![Bun](https://img.shields.io/badge/Bun-000000?style=plastic&logo=bun&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-C5F74F?style=plastic&logo=drizzle&logoColor=black)
![Elysia](https://img.shields.io/badge/Elysia-8B5CF6?style=plastic&logo=elysia&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=plastic&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=plastic&logo=typescript&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=plastic&logo=zod&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better%20Auth-111827?style=plastic&logo=auth0&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=plastic&logo=docker&logoColor=white)

Com a evolução do projeto, este README será expandido com mais detalhes sobre arquitetura, rotas e decisões técnicas.

## Instalação ⚙️

### Instalar dependências
```bash
bun install
```

### Subir banco de dados de desenvolvimento
```bash
docker compose up -d
```

### Rodar migrations
```bash
bun drizzle-kit migrate
```

ou

### Push no DB
```bash
bun drizzle-kit push
```

### Iniciar o servidor
```bash
bun run start
```

### Ver/Testar API -> OpenAPI w/ Elysia
```bash
http://localhost:3000/openapi
```

### Ver/Testar DB
```bash
bun drizzle-kit studio
```

## Checklist ✅

### Users
- [X] `createUser` – criar um novo usuário
- [X] `getUserById` – obter usuário por ID - (Admin)
- [X] `getAllUsers` – listar todos os usuários - (Admin)
- [X] `/me` - obter usuário logado - (Better-Auth) - `/auth/account-info`
- [X] `updateUser` – atualizar dados do usuário - (Better-Auth)
- [X] `deleteUser` – remover usuário - (Better-Auth)

### Medias
- [X] `createMedia` – criar nova mídia
- [X] `getMedia` – obter mídia por ID - com episodios
- [X] `getAllMedias` – listar todas as mídias - com contagem de episodios
- [ ] `updateMedia` – atualizar mídia existente
- [X] `deleteMedia` – remover mídia

### Episodes
- [X] `createEpisode` – criar novo episódio
- [ ] `getEpisode` – obter episódio por ID
- [ ] `getAllEpisodes` – listar todos os episódios
- [ ] `updateEpisode` – atualizar episódio existente
- [ ] `deleteEpisode` – remover episódio

### Community (Posts)
- [X] `createPost` – criar novo post
- [X] `getPost` – obter post por ID do Post
- [X] `getUserPosts` – listar posts de um usuário pelo username
- [X] `getAllPosts` – listar todos os posts
- [X] `updatePost` – atualizar post existente
- [X] `deletePost` – remover post

### Progresso
- ...
