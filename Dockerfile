FROM node:24.5.0-slim

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json yarn.lock* ./

# Instalar dependências
RUN yarn install

# Copiar o resto dos arquivos
COPY . .

# Definir variáveis de ambiente do Firebase para o build - necessário para substituição em tempo de build
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_API_BASE_URL

# Build da aplicação com as variáveis de ambiente
RUN yarn build

# A variável PORT é injetada pelo Railway
ENV NODE_ENV=production

# Expor a porta que o Railway vai usar
EXPOSE ${PORT}

# Usar a variável de ambiente PORT fornecida pelo Railway
CMD ["sh", "-c", "yarn preview --host 0.0.0.0 --port ${PORT:-3000} --no-open"]