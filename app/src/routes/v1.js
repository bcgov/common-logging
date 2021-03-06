const config = require('config');
const router = require('express').Router();
const path = require('path');
const YAML = require('yamljs');

const keycloak = require('../components/keycloak');

const healthRouter = require('./v1/health');
const loggingRouter = require('./v1/logging');

const clientId = config.get('keycloak.clientId');

/** Base v1 Responder */
router.get('/', (_req, res) => {
  res.status(200).json({
    endpoints: [
      '/health',
      '/log'
    ]
  });
});

/** OpenAPI Docs */
router.get('/docs', (_req, res) => {
  const docs = require('../docs/docs');
  res.send(docs.getDocHTML('Common Logging Service API', 'v1'));
});

/** OpenAPI YAML Spec */
router.get('/api-spec.yaml', (_req, res) => {
  res.sendFile(path.join(__dirname, '../docs/v1.api-spec.yaml'));
});

/** OpenAPI JSON Spec */
router.get('/api-spec.json', (_req, res) => {
  res.status(200).json(YAML.load(path.join(__dirname, '../docs/v1.api-spec.yaml')));
});

/** Doc Gen Router */
router.use('/log', keycloak.protect(`${clientId}:LOGGER`), loggingRouter);

/** Health Router */
router.use('/health', keycloak.protect(), healthRouter);

module.exports = router;
