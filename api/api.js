"use strict";

function getfastifyoptions()
{
  const pino = require('pino');
  const fastifyoptions = {};
  fastifyoptions.logger =
  {
    level: 'warn',
    formatters: { level: (label) => { return { level: label }; } },
    timestamp: pino.stdTimeFunctions.isoTime
  };
  return fastifyoptions;
}

function registerfastifyroutes(fastify)
{
  fastify.register(require('../routes/ping'));
  fastify.register(require('../routes/health'));
  fastify.register(require('../routes/users'));
}

async function start(fastify)
{
  await fastify.register(require('@fastify/swagger'),
  {
    openapi:
    {
      openapi: '3.0.0',
      info:
      {
        title: 'science whos who api swagger',
        description: 'retrieve directory information about the greatest scientists',
        version: '1.0.0'
      },
      servers:
      [
        {
          url: 'https://geturlinyourbrowser.com'
        }
      ]
    }
  });
  const css = '.topbar { display: none!important; }';
  await fastify.register(require('@fastify/swagger-ui'),
  {
    routePrefix: '/',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true,
    theme: {
      title: 'science whos who api swagger',
      css: [
        { filename: 'theme.css', content: css }
      ],
    }
  });
  registerfastifyroutes(fastify);
}

const fastify = require('fastify')(getfastifyoptions());
start(fastify);

export default async (req, res) =>
{
  await fastify.ready();
  fastify.server.emit('request', req, res);
}

