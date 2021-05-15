# JSON SERVER PROJECT

The Ultimate Framework

* [Instalação](#instalação)
* [Importando Pacote](#importando-pacote)
* [Declaração Básica](#declaração-básica)
* [Entidades](#entidades)
* [Autenticação](#autenticação)
* [Especial Actions](#especial-actions)
* [Módulos](#módulos)
    * [Blog](#blog)
    * [Chat](#chat)
    * [CronJob](#cronjob)
    * E-Commerce ```(ONGOING DEVELOPMENT)```
    * Auto-ERP ```(ONGOING DEVELOPMENT)```
    * Auto-APP ```(ONGOING DEVELOPMENT)```
* [Exemplo Completo](#exemplo-completo)

## Instalação

```bash
npm install --save @octaldev/json-server
```

## Importando Pacote

Existem dois jeitos de se utilizar essa lib: como classe, ou função. Confira os exemplos a seguir:

* Exemplo como classe

```js
import JSONServer from "@octaldev/json-server";

// retorna uma instancia do JSONServer para manipular os servidores
const jsonServer = new JSONServer.startServers({ /* seu json aqui */ });

// lista um dict com todos os servidores levantados
console.log(jsonServer.servers);

setTimeout(() => {
    // mata todos os processos dos servidores criados
    console.log( jsonServer.stopServers() );
}, 5000);
```

* Exemplo como função

```js
import JSONServer from "@octaldev/json-server";

// retorna um dict com todos os servidores (separados por tipo)
const servers = JSONServer.startServers({ /* seu json aqui */ });

setTimeout(() => {
    // mata todos os processos dos servidores retornados pela função "startServers"
    console.log( JSONServer.stopServers(servers) );
}, 5000);
```

## Declaração Básica

```js
import JSONServer from "@octaldev/json-server";

JSONServer.startServers({
    project: "Example Project",
    servers: {
        rest: [ 4500, 4501 ],
        socket: 5000,
        file: 4750,
    },
    database: {
        uri: "mongodb+srv://<user>:<password>@cluster0-dr81f.gcp.mongodb.net/<db>?retryWrites=true&w=majority",
        name: "example"
    }
});
```

* ```project```: nome do projeto
* ```servers```: um dict contendo as portas dos servidores. Podem ser inteiros com a porta do servidor, ou um array com os números:
    * ```file```: **obrigatório**
    * ```socket```: opcional
    * ```rest```: opcional
* ```database```: configurações para conectar ao MongoDB:
    * ```uri```: url com as infos de conexão
    * ```name```: nome do banco a ser conectado

## Entidades

Entidades são as estruturas que criam as requests básicas de um CRUD na API. Imagine um exemplo de um usuário a ser gerenciado (o exemplo vai ignorar a declaração básica como o exemplo acima):

```js
import JSONServer from "@octaldev/json-server";

JSONServer.startServers({
    // ...,
    entities: [{
        name: "user",
        alias: "db_entity_user", // optional
        fields: [{
            name: "name",
            type: "string",
        }, {
            name: "email",
            type: "string"
        }, {
            name: "password",
            type: "string"
        }, {
            name: "picture",
            type: "image",
        }]
    }
});
```

Entidades sempre são declaradas como um array de objetos, com os seguintes parâmetros:

* ```name```: nome da entidade
* ```alias```: nome da collection para essa entidade no banco
* ```fields```: array com os campos dessa entidade
    * ```name```: nome do campo
    * ```type```: tipo do campo, utilizado para verificação dos dados antes da manipulação. Pode ser dos seguintes tipos:
        * ```string```
        * ```number```
        * ```object```
        * ```boolean```
        * ```date```
        * ```file```
        * ```image```

## Autenticação

O framework também permite ```auth``` out-of-the-box, seguindo a seguinte estrutura:

```js
import JSONServer from "@octaldev/json-server";

JSONServer.startServers({
    // ...,
    auth: {
        entity: "user",
        fields: ["email", "password"],
        blockFields: ["password"],
        routes: {
            private: "*",
            whitelist: ["addUsers"],
        },
        mirror: {
            whitelist: ["listReserves"]
        },
    },
});
```

* ```entity```: entidade a ser utilizada na autenticação
* ```fields```: array com os campos a serem validados no banco
* ```blockFields```: array com os campos que devem ser removidos da resposta do login
* ```routes```: dict com a configuração de proteção das rotas:
    * ```private```: lista de rotas a serem protegidas pela autenticação. Caso todas as rotas sejam protegidas, é só informar um ```"*"``` no lugar do dict.
    * ```whitelist```: lista de todas as rotas a serem ignoradas pela lista de proteção acima. dafault: ```null```.
* ```mirror```: dict com a configuração de espelhamento das requests feitas por um mesmo usuário com conexões diferentes. Por default, todas são espelhadas, e é possível combinar as duas configurações:
    * ```whitelist```: lista de rotas a serem espelhadas
    * ```blacklist```: lista de rotas que não podem ser espelhadas


## Módulos

* [Blog](#blog)
* [Chat](#chat)
* [CronJob](#cronjob)
* E-Commerce ```(ONGOING DEVELOPMENT)```
* Auto-ERP ```(ONGOING DEVELOPMENT)```
* Auto-APP ```(ONGOING DEVELOPMENT)```

### Blog

A utilização desse módulo é bastante simples, ela é composta pelas seguintes configurações:

* Versão completa
    * ```comments:``` booleano para criar actions de comentários
    * ```prefix:``` prefixo de todas as collections para requests. default: ```null```

```js
{
    blog: {
        comments: true,
        prefix: "blog"
    }
    /*
    ** define as actions com o prefixo blog,
    ** permitindo comentários
    ** ex: ["listBlogPosts", "listBlogComments"]
    */
}
```
* Versão simplificada

```js
{
    blog: true
    /*
    ** define as actions de forma padrão
    ** ex: ["listPosts", "listCategory"]
    */
}
```

### Chat

A utilização desse módulo é bastante simples, ela é composta pelas seguintes configurações:

* Versão completa
    * ```channel:``` ID do canal de comunicação que está sendo criado.
    * ```entities:``` array com o nome das entidades que podem utilizar esse chat.

```js
{
    chat: {
        channel: "support",
        entities: ["user", "admin"]
    }
    /*
    ** define um canal que pode ser utilizado entre os
    ** usuários e administradores
    */
}
```
* É possível criar mais do que um tipo de chat:

```js
{
    chat: [{
        channel: "support",
        entities: ["user", "admin"]
    }, {
        channel: "main-chat",
        entities: ["user"]
    }]
    /*
    ** define o mesmo do exemplo acima, mas criando um canal separado
    ** para os users utilizarem entre si
    **
    ** (o channel support já permite usuários entre si,
    ** mas criar um canal separado permite fazer o tracking
    ** das mensagens e salas)
    */
}
```

### CronJob

Cronjobs são suportados nativamente no framework. Sua sintaxe é assim:

* ```key:``` identificador do seu cronjob
* ```scripts:``` arquivos a serem executados pelo cronjob. Pode ser uma URL para o arquivo, ou um array de URLs.
* ```params:``` configuração de execução do cronjob.
    * cada posição no array, é uma configuração diferente:<br/>
    ```[sec, min, hour, day-of-month, month, day-of-week]```
    * cada valor pode variar dentro do seu range:<br/>
    ```[0-59, 0-59, 0-23, 1-31, 1-12, 0-7]```
    * é possível utilizar mais de uma configuração por campo:<br/>
    ```[0, 0, 1, "1,15,30", *, *]``` _(executa 1h da manhã, nos dias 1, 15 e 30 todos os meses)_
    * é possível utilizar steps, para avançar conforme um padrão:<br/>
    ```[0, 30, 1, */2, *, *]``` _(executa 1h30 da manhã, a cada 2 dias)_

```js
{
    cronjobs: [{
        key: "my-cron-test",
        params: ["*", "*", "*", "*", "*"],
        scripts: ["cron1.js", "./cron2.js"],
    }]
    /*
    ** define um cron job chamado "my-cron-test"
    ** a ser executado a cada minuto, utilizando
    ** os scripts "cron1.js" e "cron2.js"
    */
}
```

## Especial Actions

Ainda é possível escrever suas próprias actions diretamente pelo JSON, como o exemplo abaixo que retorna um count de users no banco:

```js
import JSONServer from "@octaldev/json-server";

JSONServer.startServers({
    // ...,
    actions: [{
        name: "totalUsers",
        arguments: "req, res, DAO, importLib",
        body: `
            const userDAO = new DAO("user");
            const sha512 = importLib("sha512");

            const count = userDAO.count().then(count => {
                return res.sendJSON({
                    count,
                    countHash: sha512(count + ""),
                });
            }).catch(err => {
                return res.onError({ err })
            });
        `
    }],
});
```

Exemplo de request:

```json
{
    "action": "totalUsers"
}
```

Exemplo de resposta:
```json
{
    "status": true,
    "code": 200,
    "action": "totalUsers",
    "count": 4,
    "countHash": "a321d8b405e3ef2604959847b36d171eebebc4a8941dc70a4784935a4fca5d5813de84dfa049f06549aa61b20848c1633ce81b675286ea8fb53db240d831c568"
}
```

* ```name```: nome da action a ser criada. Deep search não funciona nesse caso, é preciso enviar uma action exatamente igual (ignorando case) para funcionar
* ```arguments```: parâmetros que você pode vir a utilizar na sua função:
    * ```req```: dados da request, onde é possível acessar infos como ```action```, etc
    * ```res```: dados da resposta, onde é possível utilizar a função de retorno ```res.sendJSON```, etc.
    * ```DAO```: classe para acessar o banco e suas funções de gerenciamento. Recebe como parâmetro no constructor o nome da collection a ser manipulada.
    * ```imports```: uma função que permite importar todas as libs disponiveis no node, para manipular dentro do JSON:
        * [```js-sha512```](https://www.npmjs.com/package/js-sha512)
        * [```assert```](https://www.w3schools.com/nodejs/ref_assert.asp)
        * [```buffer```](https://www.w3schools.com/nodejs/ref_buffer.asp)
        * [```child_process```](https://nodejs.org/api/child_process.html)
        * [```cluster```](https://www.w3schools.com/nodejs/ref_cluster.asp)
        * [```cripto```](https://www.w3schools.com/nodejs/ref_crypto.asp)
        * [```dgram```](https://www.w3schools.com/nodejs/ref_dgram.asp)
        * [```dns```](https://www.w3schools.com/nodejs/ref_dns.asp)
        * [```events```](https://www.w3schools.com/nodejs/ref_events.asp)
        * [```fs```](https://www.w3schools.com/nodejs/ref_fs.asp)
        * [```http```](https://www.w3schools.com/nodejs/ref_http.asp)
        * [```https```](https://www.w3schools.com/nodejs/ref_https.asp)
        * [```net```](https://www.w3schools.com/nodejs/ref_net.asp)
        * [```os```](https://www.w3schools.com/nodejs/ref_os.asp)
        * [```path```](https://www.w3schools.com/nodejs/ref_path.asp)
        * [```querystring```](https://www.w3schools.com/nodejs/ref_querystring.asp)
        * [```readline```](https://www.w3schools.com/nodejs/ref_readline.asp)
        * [```stream```](https://www.w3schools.com/nodejs/ref_stream.asp)
        * [```string_decoder```](https://www.w3schools.com/nodejs/ref_string_decoder.asp)
        * [```timers```](https://www.w3schools.com/nodejs/ref_timers.asp)
        * [```tls```](https://www.w3schools.com/nodejs/ref_tls.asp)
        * [```tty```](https://nodejs.org/api/tty.html)
        * [```url```](https://www.w3schools.com/nodejs/ref_url.asp)
        * [```util```](https://www.w3schools.com/nodejs/ref_util.asp)
        * [```v8```](https://nodejs.org/api/v8.html)
        * [```vm```](https://www.w3schools.com/nodejs/ref_vm.asp)
        * [```zlib```](https://www.w3schools.com/nodejs/ref_zlib.asp)

## Exemplo Completo

```js
import JSONServer from "@octaldev/json-server";

JSONServer.startServers({
    project: "Teste",
    servers: {
        rest: [ 4500, 4501 ],
        socket: 5000,
        file: 4750,
    },
    database: {
        uri: "mongodb://192.168.15.253:27017?retryWrites=true&w=majority",
        name: "db_teste",
    },
    auth: {
        entity: "user",
        fields: ["email", "password"],
        blockFields: ["password"],
        routes: {
            private: ["addUsers"],
        },
        mirror: {
            whitelist: ["listReserves"]
        },
    },
    blog: true,
    chat: {
        channel: "main",
        entities: ["user"]
    },
    entities: [{
        name: "user",
        fields: [{
            name: "name",
            type: "string",
        }, {
            name: "email",
            type: "string"
        }, {
            name: "password",
            type: "string"
        }, {
            name: "cpf",
            type: "string"
        }, {
            name: "active",
            type: "boolean"
        }, {
            name: "picture",
            type: "image",
        }]
    }],
    actions: [{
        name: "totalUsers",
        arguments: "req, res, DAO, importLib",
        body: `
            const userDAO = new DAO("user");
            const sha512 = importLib("js-sha512");

            const count = userDAO.count().then(count => {
                return res.sendJSON({
                    count,
                    countHash: sha512(count + ""),
                });
            }).catch(err => {
                return res.onError({ err })
            });
        `
    }]
});
```
