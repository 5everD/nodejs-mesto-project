const dotenvConfig = require('dotenv').config;

dotenvConfig({ path: '.env' });
dotenvConfig({ path: '.env.deploy' });

const {
  JWT_SECRET, DEPLOY_USER, DEPLOY_HOST, DEPLOY_REF, DEPLOY_PATH, DEPLOY_REPO,
} = process.env;

module.exports = {
  apps: [{
    name: 'mesto-api',
    script: 'npm run start',
    env_production: {
      NODE_ENV: 'production',
      JWT_SECRET,
    },
  }],
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      'pre-deploy-local': `scp ./.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`,
      'post-deploy': 'npm i && pm2 start ecosystem.config.js --env production && pm2 save',
    },
  },
};
