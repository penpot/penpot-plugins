import { CreateNodes } from '@nx/devkit';
import { dirname } from 'path';

export const createNodes: CreateNodes = [
  '**/tsconfig.plugin.json',
  async (configFilePath) => {
    const projectRoot = dirname(configFilePath);
    const projectName = projectRoot.split('/').pop();

    if (!projectName) {
      throw new Error('Could not determine project name');
    }

    return {
      projects: {
        [projectRoot]: {
          root: projectRoot,
          targets: {
            init: {
              executor: 'nx:run-commands',
              options: {
                command: `nx run-many --parallel --targets=buildPlugin,serve --projects=${projectName} --watch`,
              },
            },
          },
        },
      },
    };
  },
];
