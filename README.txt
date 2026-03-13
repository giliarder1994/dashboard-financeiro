Login no servidor:

curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"email":"giliarde2@email.com","senha":"123456"}'

token:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tZSI6IkdpbGlhcmRlIiwiaWF0IjoxNzczMzYxNzE4LCJleHAiOjE3NzMzNjUzMTh9.DNH1D9NzvNV21swPS9XrYe6SiKerQNUaYYVR5H3rKa8

Criar categoria receita:

curl -X POST http://localhost:3000/categorias -H "Content-Type: application/json" -H "Authorization: Bearer SEU_TOKEN" -d '{"nome":"Salário","tipo":"receita"}'

Criar categoria despesa:

curl -X POST http://localhost:3000/categorias -H "Content-Type: application/json" -H "Authorization: Bearer SEU_TOKEN" -d '{"nome":"Alimentação","tipo":"despesa"}'

Listar categorias:

curl http://localhost:3000/categorias -H "Authorization: Bearer SEU_TOKEN"