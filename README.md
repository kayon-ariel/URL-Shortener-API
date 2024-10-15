# URL Shortener API

A **URL Shortener API** é uma aplicação desenvolvida com **NestJS** que permite encurtar URLs longas e redirecionar para elas usando códigos curtos. Esta API armazena as URLs em um banco de dados e também em memória para acesso rápido.

## Funcionalidades

- **Encurtar URLs**: Recebe uma URL longa e retorna um código curto.
- **Redirecionar para URLs longas**: A partir de um código curto, redireciona o usuário para a URL longa correspondente.
- **Armazenamento em Memória**: As URLs são armazenadas em um `Map` para acesso rápido.
- **Persistência em Banco de Dados**: As URLs são também armazenadas em um banco de dados usando **Prisma**.

## Uso de Memória

O serviço utiliza um `Map` para armazenar URLs em memória, permitindo acesso rápido e eficiente. O uso de memória depende do número de URLs encurtadas.

### Estimativa de Uso de Memória

Suponha que você tenha 1 milhão de URLs encurtadas:

- **Tamanho médio da URL longa**: 100 bytes
- **Tamanho do código curto**: 6 bytes
- **Overhead do objeto**: ~50 bytes

Assim, o uso de memória por entrada é aproximadamente:

```
100 + 6 + 50 = 156 bytes
```

Para 1 milhão de entradas, a estimativa total é:

```
156 bytes * 1.000.000 ≈ 156 MB
```

Portanto, armazenar 1 milhão de URLs encurtadas em memória consumiria cerca de **156 MB**. Em ambientes com recursos limitados, monitore o uso de memória.

## Quantidade de URLs Possíveis

O sistema permite encurtar um número praticamente ilimitado de URLs, desde que a memória do sistema e o banco de dados suportem. O código curto é gerado utilizando a função `uuidv4().slice(0, 6)`, o que possibilita a criação de aproximadamente 16 milhões de combinações diferentes de códigos curtos.

- **Aumento de Combinações**: Ao trocar para um código curto de 7 dígitos, o número de combinações possíveis aumenta significativamente, permitindo até 268 milhões de códigos únicos.

- **Limitações Práticas**: Na prática, a quantidade de URLs que podem ser armazenadas depende da capacidade de armazenamento do banco de dados e dos recursos do servidor. Se o número de URLs encurtadas for muito grande, pode ser interessante implementar técnicas de gerenciamento de memória, como expiração de URLs menos utilizadas.

## Tecnologias Utilizadas

- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [UUID](https://www.npmjs.com/package/uuid)
- [Express](https://expressjs.com/)

## Instalação

Para instalar e rodar a aplicação localmente, siga os passos abaixo:

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/URL-Shortener-API.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd URL-Shortener-API
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Configure o banco de dados no arquivo `.env` (adapte conforme necessário):

   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
   ```

5. Execute as migrações para configurar o banco de dados:

   ```bash
   npx prisma migrate dev
   ```

6. Inicie o servidor:

   ```bash
   npm run start:dev
   ```

A API estará disponível em `http://localhost:3000`.

## Endpoints

### Encurtar URL

- **URL**: `POST /url/shorten`
- **Body**: 
  ```json
  {
      "url": "http://example.com/some/long/url"
  }
  ```
- **Resposta**:
  ```json
  {
      "shortUrl": "http://localhost:3000/url/abc123"
  }
  ```

### Redirecionar URL

- **URL**: `GET /url/:code`
- **Parâmetro**: `code` - Código curto gerado.
- **Resposta**: Redireciona para a URL longa correspondente.

## Testes

Para executar os testes da aplicação, utilize o comando:

```bash
npm run test:all
```

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir um *pull request* ou *issue*.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).