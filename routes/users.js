const schema_user =
{
  type: 'object',
  properties:
  {
    id: { type: 'string' },
    mail: { type: 'string' },
    surname: { type: 'string' },
    forename: { type: 'string' }
  },
  examples:
  [
    {
      id: 'abc1234',
      mail: 'yann.helleboid@orange.com',
      surname: 'Helleboid',
      forename: 'Yann'
    }
  ]
};

const schema_400 =
{
  type: 'object',
  properties:
  {
    statusCode: { type: 'integer' },
    error: { type: 'string' },
    message: { type: 'string' }
  },
  examples:
  [
    {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Bad user id format'
    },
    {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Bad user mail format'
    },
    {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Bad user surname format'
    },
    {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Bad user forename format'
    }
  ]
};

const schema_404 =
{
  type: 'object',
  properties:
  {
    statusCode: { type: 'integer' },
    error: { type: 'string' },
    message: { type: 'string' }
  },
  examples:
  [
    {
      statusCode: 404,
      error: 'Not found',
      message: 'User not found'
    }
  ]
};

const schema_id =
{
  type: 'string',
  examples: ['abcd1234']
};

const schema_mail =
{
  type: 'string',
  examples: ['yann.helleboid@orange.com']
};

const schema_surname =
{
  type: 'string',
  examples: ['Helleboid']
};

const schema_forename =
{
  type: 'string',
  examples: ['Yann']
};
const schema_userid =
{
  summary: 'search a user with a specific id',
  description: 'takes a user id (4 letters 4 digits) as an input and returns the user info if found, an error otherwise',
  params:
  {
    type: 'object',
    required: ['id'],
    properties:
    {
      id: schema_id
    }
  },
  response:
  {
    200: schema_user,
    400: schema_400,
    404: schema_404
  }
};

const schema_users =
{
  summary: 'search a user with a specific id, mail, surname of forename',
  description: 'takes a parameter (if several parameters are provided, the priority is id, mail, surname and then forename) as an input and returns the user info if found, an error otherwise',
  querystring:
  {
    type: 'object',
    properties:
    {
      id: schema_id,
      mail: schema_mail,
      surname: schema_surname,
      forename: schema_forename
    }
  },
  response:
  {
    200: schema_user,
    400: schema_400,
    404: schema_404
  },
};

async function routes (fastify, options)
{
  const data = require('../data/data.json');
  const schemaid = /^[a-z]{4}[0-9]{4}$/;
  const schemamail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
  const schemaname = /^[a-z ]+$/;

  fastify.get('/users/:id',
    {
      schema: schema_userid
    },
    async (request, reply) =>
    {
      const { id } = request.params;
      const res = getuserby(data, 'id', schemaid, id);
      replyfrom(reply, 'id', res);
    }
  );
  
  fastify.get('/users',
    {
      schema: schema_users
    },
    async (request, reply) =>
    {
      if (request.query.id)
      {
        const res = getuserby(data, 'id', schemaid, request.query.id);
        replyfrom(reply, 'id', res);
      }
      else if (request.query.mail)
      {
        const res = getuserby(data, 'mail', schemamail, request.query.mail);
        replyfrom(reply, 'mail', res);
      }
      else if (request.query.surname)
      {
        let res;
        res = getuserby(data, 'surname', schemaname, request.query.surname);
        replyfrom(reply, 'surname', res);
      }
      else if (request.query.forename)
      {
        let res;
        res = getuserby(data, 'forename', schemaname, request.query.forename);
        replyfrom(reply, 'forename', res);
      }
      else
        replyfrom(reply, 'search parameter', -1);
    }
  );
}

function getuserby(data, type, regexp, element)
{
  element = element.toLowerCase();
  if (!element.match(regexp))
    return -1;
  const user = data.filter((d) => d[type].toLowerCase() == element);
  if (user.length == 0)
    return 0;
  else
    return user[0];
}

function replyfrom(reply, type, res)
{
  if (res == -1)
  {
    const error = new Error('Bad user ' + type + ' format');
    reply.code(400).send(error);
  }
  else if (res == 0)
  {
    const error = new Error('User not found');
    reply.code(404).send(error);
  }
  else
    reply.send(res);
}

module.exports = routes;
