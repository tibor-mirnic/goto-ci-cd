FROM nginx:alpine

# Install nodejs and npm
RUN apk add --update nodejs
RUN apk add --update npm

# Copy apply environment script (adjust the source path to your needs)
COPY apply-environment /opt/scripts/apply-environment
WORKDIR /opt/scripts/apply-environment
# Clean install
RUN npm ci
# Compile typescript
RUN npm run build

# Switch to root
WORKDIR /

# Copy docker entrypoint script (adjust the source path to your needs)
# Scripts execute in order, hence 40
COPY apply-environment.sh /docker-entrypoint.d/40-apply-environment.sh
RUN chmod +x /docker-entrypoint.d/40-apply-environment.sh

## NGINX
# Override the default config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy the build into nginx (adjust the working directory to your needs)
COPY /working-directory /usr/share/nginx/html