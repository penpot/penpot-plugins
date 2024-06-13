const apiUrl = 'http://localhost:3449';

export async function PenpotApi() {
  const resultLoginRequest = await fetch(
    `${apiUrl}/api/rpc/command/login-with-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/transit+json',
      },
      body: JSON.stringify({
        '~:email': 'test@test.es',
        '~:password': '123123123',
      }),
    }
  );

  const loginData = await resultLoginRequest.json();
  const authToken = resultLoginRequest.headers
    .get('set-cookie')
    ?.split(';')
    .at(0);

  if (!authToken) {
    throw new Error('Login failed');
  }

  return {
    getAuth: () => authToken,
    createFile: async () => {
      const createFileRequest = await fetch(
        `${apiUrl}/api/rpc/command/create-file`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/transit+json',
            cookie: authToken,
            credentials: 'include',
          },
          body: JSON.stringify({
            '~:name': `test file ${new Date().toISOString()}`,
            '~:project-id': loginData['~:default-project-id'],
            '~:features': {
              '~#set': [
                'fdata/objects-map',
                'fdata/pointer-map',
                'fdata/shape-data-type',
                'components/v2',
                'styles/v2',
                'layout/grid',
                'plugins/runtime',
              ],
            },
          }),
        }
      );

      return await createFileRequest.json();
    },
  };
}
