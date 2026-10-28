/* Servidor Node (BACKEND) - Leandro Luis Pauro
Explicando o que cada rota faz: 
1. GET / -> entrega o arquivo index.html (o frontend) ao navegador;
2. GET /api/alunos  -> consulta o banco e devolve os registros em formato JSON.
Quem transforma os dados em tabela é o navegador (nosso exemplo é a página index.html).

Para diferenciar: 
GET é usado para buscar dados (não altera nada no sistema);
POST é usado para enviar dados (altera o sistema, insere, atualiza ou deleta algo). 
*/

//Importação dos módulos
const http = require('http');
const url = require('url');
const fs = require('fs');     // Módulo para ler arquivos do disco (usado para enviar o index.html)
const path = require('path'); // Ajuda a montar o caminho do arquivo de forma segura
const pool = require('./db'); // Procure o arquivo db.js que contém a configuração do banco de dados

//definição da porta do servidor
const PORT = 3000;

// Em relação aula passada, a função montarPaginaAlunos() FOI REMOVIDA daqui, quem 
// montar o HTML é o frontend (index.html).

const server = http.createServer(async (req, res) => {

  /* Esta linha extrai apenas o caminho da URL (pathname) da requisição (req.url), 
   A função do Node.js (url.parse) apenas separa a URL em pedaços padronizados 
   seguindo a estrutura padrão da internet (como protocolo, domínio, caminho, parâmetros, etc.).
   Quando se pede o pathname, está dizendo explicitamente para ela: "Me dê apenas a parte que 
   corresponde ao caminho da rota".
  Veja como o url.parse divide uma URL como http://localhost:3000/produtos?id=5&status=ativo:
    protocol: http:
    host: localhost:3000
    pathname: /produtos (o caminho que você pediu)
    search: ?id=5&status=ativo
  */
  const {pathname } = url.parse(req.url, true);

  // ROTA 1: Entrega a página index.html (frontend)
  if (req.method === 'GET' && pathname === '/') {
  /*
  Explicação:
  1-) req.method === 'GET': A requisição feita pelo cliente é do tipo GET 
  (ou seja, está apenas pedindo/buscando uma página ou dado, como ao abrir um site no navegador 
  em nosso caso index.html ).
  
  2-) pathname === '/': O caminho acessado é exatamente a raiz do site (a página inicial, 
  sem sub-rotas como /sobre ou /contato).
  */

    /*    
    __dirname Variável global do Node.js que guarda o caminho absoluto da pasta onde o 
    arquivo JavaScript atual está rodando.
    O código abaixo faz o seguinte:

    1. fs.readFile(...): Procura e lê o arquivo index.html dentro da pasta public 
    (usando __dirname para garantir o caminho correto).
    
    2. Se der erro (err): Retorna o código de status 500 (erro interno do servidor) 
    com uma mensagem explicando o problema.
    
    3. Se der certo: Retorna o código de status 200 (sucesso) informando que o 
    conteúdo é HTML e envia (res.end) o arquivo para quem fez a requisição.

    Lembrando que:
    res (Resposta):uma convenção, é padrão do desenvolvimento web para servidores 
    (existe no Node, em PHP, Python, Java, etc.). 
    No contexto específico do nosso código, vem do módulo nativo http do Node.js.

    err (Erro): Não é exclusivo do Node. É apenas um nome de variável padrão usado em linguagens 
    de programação (como JavaScript, Python, etc.) para capturar exceções ou falhas em operações.

    */

    fs.readFile(path.join(__dirname, 'public/index.html'), (err, conteudo) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Erro ao carregar index.html: ' + err.message);
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(conteudo);
    });

  // ROTA 2: API que devolve os dados (antes era /alunos e devolvia HTML)
  } else if (req.method === 'GET' && pathname === '/api/alunos') {

    //bloco de tratamento de possíveis erros.
    try {
      //await espera a conclusão da consulta ao banco de dados.
      const [rows] = await pool.query(`
        SELECT 
          aluno.matricula AS matricula,
          aluno.nome AS Nome_Aluno,
          curso.nome_curso AS Curso,
          disciplina.nome AS Disciplina,
          turma.codigo_turma AS Turma,
          professor.nome AS Professor,
          sala.numero_sala AS Sala,
          aluno_turma.media_final AS Media,
          aluno_turma.situacao AS Situacao
        FROM aluno_turma
        JOIN aluno ON aluno_turma.id_aluno = aluno.id_aluno
        JOIN curso ON aluno.id_curso = curso.id_curso
        JOIN turma ON aluno_turma.id_turma = turma.id_turma
        JOIN disciplina ON turma.id_disciplina = disciplina.id_disciplina
        JOIN professor ON turma.id_professor = professor.id_professor
        JOIN sala ON turma.id_sala = sala.id_sala;
      `);

      // MUDANÇA: o Content-Type agora é application/json (antes era text/html)

    /* 
    res.writeHead(200, { 'Content-Type': 'application/json' }): 
    Prepara o "cabeçalho" da resposta dizendo ao navegador: 
    "Deu tudo certo (código 200) estou te enviando é um arquivo no formato JSON".
    
    res.end(JSON.stringify(rows)): 
    Converte os dados do banco de dados (que estão em formato de objeto/array do JavaScript) 
    para texto puro em formato JSON (JSON.stringify) 
    e envia essa resposta de vez para o client, encerrando a requisição.

    */
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      // MUDANÇA: JSON.stringify converte o array de objetos em texto JSON (antes: montarPaginaAlunos(rows))
      res.end(JSON.stringify(rows));
    } catch (err) {
      console.error(err); //Mostra o erro no console/terminal do Node.js.
      // MUDANÇA: o erro também é enviado como JSON, para o frontend conseguir tratá-lo
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ erro: 'Erro ao buscar alunos: ' + err.message }));
    }

  } else { //Qualquer outra rota: status 404 (não encontrado)
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Página não encontrada. Tente /');
  }
});

//O servidor começa a escutar requisições na porta 3000.
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
