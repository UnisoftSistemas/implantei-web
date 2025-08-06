FROM node:24.5.0-slim

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json yarn.lock* ./

# Instalar dependências
RUN yarn install

# Copiar o resto dos arquivos
COPY . .

# Build da aplicação
RUN yarn build

ENV PORT=3000

EXPOSE ${PORT}

CMD ["yarn", "preview"]