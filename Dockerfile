FROM node:20-slim AS production
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built app
COPY dist ./dist

# Environment setup
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health/live', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run
CMD ["node", "--enable-source-maps", "dist/index.js"]
