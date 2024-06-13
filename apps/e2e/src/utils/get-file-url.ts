import { cleanId } from './clean-id';

export function getFileUrl(file: {
  '~:name': string;
  '~:id': string;
  '~:project-id': string;
  '~:data': {
    '~:pages': string[];
  };
}) {
  const projectId = cleanId(file['~:project-id']);
  const fileId = cleanId(file['~:id']);
  const pageId = cleanId(file['~:data']['~:pages'][0]);

  return `http://localhost:3449/#/workspace/${projectId}/${fileId}?page-id=${pageId}`;
}
