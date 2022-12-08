
const express = require("express");
const { v4: uuidv4 } = require("uuid")


const app = express()

const customers = [];

app.use(express.json());

// Middleware 
// next ele que define se vai continuar ou vai parar 
function verifyIfExistsAccountCPF(request, response, next) {
 const { cpf } = request.headers;
 // procurar dentro do array find e retornar a informação completa não só um true ou false 
 const customer = customers.find( customer => customer.cpf === cpf);
 // se nao tiver um customer
 if(!customer) {
  return response.status(400).json({error: "Customer not found!"})
 }
 // daqui por diante todos as rotas que usarem este middleware vai ter acesso este valor customer 
 request.customer = customer;
 return next();
}

// body = string
// v4 = gera um numero totalmente aleatorio 
app.post("/account", (request, response) => {
 const { cpf, name } = request.body;
 
 // some busca dentro do array e se a codição e dependendo da resposta ele retorna verdadeiro ou falso 
 // neste caso ele verifica se tem algum cpf igual a este cpf nos dados
 const customersAlreadyExists = customers.some(
  (customer) => customer.cpf === cpf
  );
 if(customersAlreadyExists) {
  // 400 bad request e a mensagem de erro
  return response.status(400).json({error: "Customer Already Exists!"});
 }

 // adciona um novo {} no arrray customers
 customers.push({
  cpf,
  name,
  id: uuidv4(),
  statement: [],
 })

 return response.status(201).send();
})

// aqui estamos passando o cpf pelo headers
// este segundo parametro recebe os middleware
app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
 //chamando o customer do middleware verifiyIfExistsAccountCPF
const { customer } = request;

return response.json(customer.statement)
})

app.post("/deposit",verifyIfExistsAccountCPF, (request, response) => {
 const { description, amount } = request.body;

 const { customer } = request;

 const statementOperation = {
  description,
  amount, 
  created_at: new Date(),
  type:"credit"
 }

 customer.statement.push(statementOperation)

 return response.status(201).send();
})

app.listen(3333);