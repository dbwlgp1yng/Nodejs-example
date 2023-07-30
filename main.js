// 웹 서버 생성 코드
var http = require('http');
var fs = require('fs');
var url = require('url'); // 쿼리스트링을 추출하기 위한 url 모듈 추가

function templateHTML( title, list, body ) {
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${body}
    </body>
    </html>
  `;
} 

function templateList(filelist) {
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  
  if(pathname === '/'){
    if(queryData.id === undefined){
      fs.readdir('./data', function(error, filelist){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
        response.writeHead(200);
        response.end(template);
      })
    } else {
      fs.readdir('./data', function(error, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});

app.listen(3002); 


// http://localhost......HTML 을 입력하면 페이지에 HTML이 출력되고
// http://localhost......CSS를 입력하면 페이지에 CSS가 출력된다
// response.end라는 코드는 (queryData.id)의 값을 페이지에 출력하는 역할이다
// 따라서 이제 http://localhost......의 뒤에 오는 (queryData.id)값을 변경하면
// http://localhost......HTML
// http://localhost......CSS 등등의 여러가지 페이지를 만들어낼 수 있다

// __filename 은 현재 실행 중인 파일 경로
// __dirname 은 현재 실행 중인 폴더 경로
