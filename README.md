# Como rodar o projeto (Frontend)

Siga os passos abaixo para configurar e executar o projeto localmente:

## 1. Clone o repositório

```bash
git clone https://github.com/capacitamais/frontend.git
cd frontend
```

## 2. Crie o arquivo `.env`

Na raiz do projeto, crie um arquivo chamado `.env` e adicione a seguinte variável:

```env
VITE_BACKEND_API='https://capacitamais.onrender.com'
```

## 3. Instale as dependências

Execute o seguinte comando para instalar as bibliotecas necessárias:

```bash
npm install
```

## 4. Execute o projeto

Rode o projeto em modo de desenvolvimento com:

```bash
npm run dev
```

A aplicação será aberta automaticamente no navegador, geralmente em:

```
http://localhost:5173
```

---

> 💡 Certifique-se de que o backend esteja funcionando corretamente e acessível pela URL configurada no `.env`.
