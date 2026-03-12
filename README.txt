Login no servidor:

curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"email":"giliarde2@email.com","senha":"123456"}'

token:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywibm9tZSI6IkdpbGlhcmRlIiwiaWF0IjoxNzczMzI0MzExLCJleHAiOjE3NzMzMjc5MTF9.amA-PgCzRoI-fhukPIfymEnFS-r9oTO-KBfQw2s1iqI

Criar categoria receita:

curl -X POST http://localhost:3000/categorias -H "Content-Type: application/json" -H "Authorization: Bearer SEU_TOKEN" -d '{"nome":"Salário","tipo":"receita"}'

Criar categoria despesa:

curl -X POST http://localhost:3000/categorias -H "Content-Type: application/json" -H "Authorization: Bearer SEU_TOKEN" -d '{"nome":"Alimentação","tipo":"despesa"}'

Listar categorias:

curl http://localhost:3000/categorias -H "Authorization: Bearer SEU_TOKEN"