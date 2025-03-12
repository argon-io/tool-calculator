import type { Event, Response } from 'scaleway-functions';
import { payload, result } from './types';
import { evaluate } from 'mathjs';
import { createDocument } from 'zod-openapi';

function get(): Response {
  return {
    statusCode: 200,
    body: createDocument({
      openapi: '3.1.0',
      info: {
        title: 'Argon Calculator',
        version: '1.0.0',
      },
      paths: {
        '/': {
          post: {
            summary: 'Evaluate a math expression',
            requestBody: {
              content: {
                'application/json': { schema: payload },
              },
            },
            responses: {
              '200': {
                description: '200 OK',
                content: {
                  'application/json': { schema: result },
                },
              },
            },
          },
        }
      },
    }),
  };
}

function post(event: Event): Response {
  try {
    const data = payload.parse(JSON.parse(event.body));

    return {
      headers: {
        'content-type': 'application/json',
      },
      body: result.parse({
        result: evaluate(data.expr).toString() as string,
      }),
      statusCode: 200,
    };
  } catch (e) {
    return {
      body: "",
      statusCode: 400,
    }
  }
}

function notFound(): Response {
  return {
    body: "",
    statusCode: 404,
  }
}

export function handler(event: Event): Response {
  if (event.path !== '/') {
    return notFound();
  }

  if (event.requestContext.httpMethod === 'POST') {
    return post(event);
  }
  if (event.requestContext.httpMethod === 'GET') {
    return get();
  }

  return notFound();
};