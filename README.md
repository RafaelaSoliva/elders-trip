# 🚗 Elders Trip:
Facilitando mobilidade para idosos!


## 📱 Sobre o projeto:

O **Elders Trip** busca tornar a solicitação de transporte particular mais simples e acessível para pessoas idosas. Na tela inicial, o usuário encontra atalhos configuráveis em formato de cards com **foto e nome**, permitindo, por exemplo, tocar na foto de um filho para solicitar um carro que o leve do local atual até o endereço dele, sem navegar por menus complexos.

O aplicativo também conta com avisos contextuais de clima (como lembretes para levar guarda-chuva ou aplicar filtro solar).

## ✨ Funcionalidades:

- **Tela inicial com cards configuráveis:** Atalhos visuais com foto e nome para destinos pré-configurados;
- **Lembretes inteligentes de clima:** Sugestões práticas (como guarda-chuva ou protetor solar) baseadas na previsão do tempo local;

## 🌦️ Arquitetura e fluxo de dados para a função de clima:

1. O aplicativo mobile solicita os dados climáticos atualizados para a localização atual.
2. Uma **Azure Function** recebe a requisição e consulta a API pública da **Open-Meteo**.
3. A função obtém os dados relevantes e retorna para o aplicativo processar e exibir avisos de acordo com o clima.

## ⚙️ Estrutura do projeto (Monorepo):

- `mobile/` — Aplicativo em React Native com Expo.
- `backend/` — Azure Functions responsáveis por integrar com APIs externas e retornar os dados para o app.

## 🛠️ Tecnologias utilizadas:

- **Mobile:** `Expo` `React Native` `TypeScript` `JavaScript`
- **Cloud / Serverless:** `Azure Functions` `.NET` `C#`
- **API para o Clima:** [Open-Meteo](https://open-meteo.com/)
