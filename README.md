# DrivenPass

Um gerenciador de senhas simples implementado com TypeScript, Prisma e Express. Permite que o usuário crie uma conta e realize log-in (utilizando um token JWT) para depois armazenar suas credenciais, listá-las ou deletá-las.

## Deploy

https://drivenpass-fzxs.onrender.com

## Como rodar o projeto

### Para desenvolvimento

1. Clonar o repositório.
2. Instalar as dependências: `npm i`
3. Criar um banco de dados PostgreSQL local.
4. Configurar no `.env.development` e `.env.test` de acordo com os exemplos fornecidos.
5. Executar o script: `ENV:migration:run`
    1. ex.: `npm run dev:migration:run`
    2. ex.: `npm run test:migration:run`
6. Executar o script: `ENV:migration:generate`
    1. ex.: `npm run dev:migration:generate`
    2. ex.: `npm run test:migration:generate`
7. Para rodar o projeto em desenvolvimento: `npm run dev`

### Para testes

1. Realizar as configurações anteriores
2. Executar `npm run test` para realizar os testes
3. Para gerar o relatório de cobertura, executar `npm run test:coverage`

### Para build

1. Realizar as confirações anteriores
2. Executar `npm run build`
3. Para rodar o projeto: `npm start`