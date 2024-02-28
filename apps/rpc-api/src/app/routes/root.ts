import { FastifyInstance } from 'fastify';
import { v4 } from 'uuid';

const token = process.env.ACCESS_TOKEN;

export default async function (fastify: FastifyInstance) {
  const apiUrl = process.env.API_URL;
  const fakeSessionId = v4();

  fastify.get('/get-profile', function () {
    return fetch(`${apiUrl}/get-profile`, {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  });

  fastify.delete<{
    Body: {
      fileId: string;
      revn: number;
      pageId: string;
      objectId: string;
    };
  }>('/delete-object', function (request, reply) {
    const payload = {
      '~:id': `~u${request.body.fileId}`,
      '~:revn': request.body.revn,
      '~:session-id': `~u${fakeSessionId}`,
      '~:changes': [
        {
          '~:type': '~:del-obj',
          '~:page-id': `~u${request.body.pageId}`,
          '~:ignore-touched': false,
          '~:id': `~u${request.body.objectId}`,
        },
      ],
      '~:features': {
        '~#set': [
          'layout/grid',
          'styles/v2',
          'fdata/pointer-map',
          'fdata/objects-map',
          'fdata/shape-data-type',
        ],
      },
    };

    console.log('Payload:', payload);

    return fetch(
      `http://localhost:3449/api/rpc/command/update-file?id=${request.body.fileId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/transit+json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        reply.send(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
}
