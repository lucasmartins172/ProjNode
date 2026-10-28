Aula 05 - Projeto Laboratório Node

1-) Criação do Banco de Dados Mysql
    
    Banco Mysql local via cmd: C:\Program Files\MySQL\MySQL Server 8.0\bin>mysql -u root -p
    
    Utilização do Gerenciador MySQL Workbench podendo usar XAMPP

    ScriptsMysql\sql-tab-aluno-mysql.sql com 
        DDL (Data Definition Language) (estrutura) 
        DML (Data Manipulation Language) (dados)


2-) Criação do ambiente desenvolvimento
    Estrutura de pastas e arquivos
    db.js -> Conexão com banco de dados Mysql
    server_junto.js -> Servidor Node e funcionalidades explicadas nestes mesmo arquivo.


3-) Execução dos comandos via prompt de comandos (cmd): 
    npm init -y
    Cria os arquivos:
    
        package.json: Criação de arquivos, criam a "identidade" do projeto Node, descreve o projeto como nome e versão do projeto, descrição, autor e licença..etc, arquivos gerados:
     
        package-lock.json: Trava as versões exatas instaladas, garantindo instalações idênticas em qualquer máquina.

    npm install mysql2
    Baixa e instala o driver mysql2 (e suas dependências), permitindo o Node se conectar ao MySQL.
        cria a pasta: node_modules
 
 4-) Executar o servidor node em segundo plano -> node server_Junto.js
