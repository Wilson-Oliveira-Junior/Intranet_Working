# Intranet Working

## Descrição
A Intranet Working é um sistema interno desenvolvido para facilitar a comunicação e a colaboração entre os funcionários de uma empresa. Ele oferece uma plataforma centralizada onde os usuários podem compartilhar informações, documentos e recursos de forma segura e eficiente.

## Funcionalidades
- **Comunicação Interna**: Envio de mensagens e participação em fóruns de discussão.
- **Compartilhamento de Documentos**: Upload e download de arquivos e documentos.
- **Calendário de Eventos**: Agendamento e visualização de eventos e reuniões.
- **Gestão de Projetos e Tarefas**: Criação, atribuição e acompanhamento de tarefas e projetos.
- **Diretório de Funcionários**: Lista de funcionários com informações de contato e perfil.
- **Relatórios Avançados**: Geração de relatórios detalhados para análise de dados.
- **Integração com Ferramentas Externas**: Conexão com serviços como Google Drive, Slack e outros.

## Instalação
Para instalar o projeto, siga os passos abaixo:

1. **Clone o repositório**:
   ```sh
   git clone https://github.com/seu-usuario/intranet-working.git
   ```

2. **Configurar estrutura de pastas**:
   Navegue até a pasta `config` e siga as instruções no arquivo `config.md` para ajustar as configurações necessárias.

3. **Configurar o ambiente**:
   Copie o arquivo `.env.example` para `.env` e ajuste as configurações de acordo com o seu ambiente.

4. **Instalar dependências**:
   No terminal, navegue até a pasta do projeto e execute:
   ```sh
   composer install
   npm install
   ```

5. **Gerar chave da aplicação**:
   ```sh
   php artisan key:generate
   ```

6. **Executar migrações e seeders**:
   ```sh
   php artisan migrate --seed
   ```

7. **Executar com Docker (opcional)**:
   Caso prefira usar Docker, execute os comandos abaixo:
   ```sh
   docker-compose up -d
   ```
   Isso configurará o ambiente completo com containers para o servidor web, banco de dados e outros serviços necessários.

8. **Iniciar o servidor (sem Docker)**:
   No terminal, execute:
   ```sh
   php artisan serve
   ```
   Em outro terminal, execute:
   ```sh
   npm run dev
   ```

## Planos Futuros
- **Melhorias na Interface do Usuário**: Tornar a interface mais intuitiva e responsiva.
- **Automatização de Processos**: Adicionar automações para tarefas repetitivas.
- **Suporte Multilíngue**: Permitir que o sistema seja usado em diferentes idiomas.

## Contribuição
Se você deseja contribuir com o projeto, por favor, siga os passos abaixo:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature:
   ```sh
   git checkout -b feature/nova-feature
   ```
3. Commit suas mudanças:
   ```sh
   git commit -am 'Adiciona nova feature'
   ```
4. Faça um push para a branch:
   ```sh
   git push origin feature/nova-feature
   ```
5. Crie um novo Pull Request.

## Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
