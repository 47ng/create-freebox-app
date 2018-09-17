FROM mhart/alpine-node:10 AS builder

WORKDIR /src/app

# Build for production by default, but allow overrides to install dev deps.
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Generate dependencies
COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile

# Final Image ------------------------------------------------------------------
FROM mhart/alpine-node:base-10

ARG BUILD_ID=local

ENV                                                 \
  PATH=./node_modules/.bin:${PATH}                  \
  NODE_ENV=production

WORKDIR /src/app

# Install dependencies
COPY --from=builder /src/app/node_modules ./node_modules

# Install business code
COPY ./package.json ./*.js ./

# Launch !
CMD ["babel-node", "./create-freebox-app.js"]
