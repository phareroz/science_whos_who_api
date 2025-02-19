
async function routes (fastify, options)
{
  fastify.get('/favico.ico',
    async (request, reply) =>
    {
      fs.readFile('../favico.ico', (err, fileBuffer) =>
      {
        reply.header('Content-Type', 'image/x-icon')
        reply.send(err || fileBuffer);
      });
    }
  );
}

module.exports = routes;
