import { FastifyInstance } from 'fastify';
import { v4 } from 'uuid';

const token = process.env.ACCESS_TOKEN;

export default async function (fastify: FastifyInstance) {
  const apiUrl = process.env.API_URL + '/api/rpc/command';
  const fakeSessionId = v4();

  // not working
  // function uploadMediaObject(fileId: string) {
  //   const filePath = '/home/juanfran/tmpImages/example-bg-2.jpg';
  //   const file = fs.readFileSync(filePath);
  //   const fileName = path.basename(filePath);

  //   const formData = new FormData();
  //   formData.append('content', new Blob([file]), fileName);
  //   formData.append('file-id', fileId);
  //   formData.append('name', fileName);
  //   formData.append('is-local', 'true');

  //   return fetch(`${apiUrl}/upload-file-media-object`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/transit+json',
  //       Authorization: `Token ${token}`,
  //     },
  //     body: formData,
  //   });
  // }

  function deleteObj(
    fileId: string,
    revn: number,
    pageId: string,
    objectId: string
  ) {
    const payload = {
      '~:id': `~u${fileId}`,
      '~:revn': revn,
      '~:session-id': `~u${fakeSessionId}`,
      '~:changes': [
        {
          '~:type': '~:del-obj',
          '~:page-id': `~u${pageId}`,
          '~:ignore-touched': false,
          '~:id': `~u${objectId}`,
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

    return fetch(`${apiUrl}/update-file?id=${fileId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/transit+json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    }).then((response) => response.json());
  }

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
    deleteObj(
      request.body.fileId,
      request.body.revn,
      request.body.pageId,
      request.body.objectId
    )
      .then((data) => {
        console.log('Success:', data);
        reply.send(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
}
