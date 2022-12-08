
const express = require("express");
const { v4: uuidv4 } = require("uuid")


const app = express()
const customers = [];

app.use(express.json());

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

app.listen(3333);