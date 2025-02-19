const schema_ping =
{
  summary: 'ping the api to check if alive',
  description: 'takes no parameters and returns a status 200 with no payload if the api is alive',
  response:
  {
    200:
    {
      description: 'Success, api responds to ping',
      type: 'null'
    }
  }
};

async function routes (fastify, options)
{
  fastify.get('/ping',
    {
      schema: schema_ping
    },
    async (request, reply) =>
    {
      return;
    }
  );
}

module.exports = routes;
