import { CreateNodes, readJsonFile, logger } from '@nx/devkit';
import { dirname } from 'path';

export const createNodes: CreateNodes = [
  '**/project.json',
  async (configFilePath) => {
    const projectConfiguration = readJsonFile(configFilePath);

    if (
      !projectConfiguration.tags ||
      !projectConfiguration?.tags.includes('type:plugin') ||
      !projectConfiguration?.targets.build
    ) {
      return {};
    }

    const projectRoot = dirname(configFilePath);

    return {
      projects: {
        [projectRoot]: {
          root: projectRoot,
          targets: {
            init: {
              executor: 'nx:run-commands',
              options: {
                command: `nx run-many --parallel --targets=buildPlugin,serve --projects=${projectConfiguration.name} --watch`,
              },
            },
            buildPlugin: {
              executor: '@nx/esbuild:esbuild',
              outputs: ['{options.outputPath}'],
              options: {
                minify: true,
                outputPath: `${projectConfiguration.sourceRoot}/assets/`,
                main: `${projectConfiguration.sourceRoot}/plugin.ts`,
                tsConfig: `${projectRoot}/tsconfig.plugin.json`,
                generatePackageJson: false,
                format: ['esm'],
                deleteOutputPath: false,
              },
            },
          },
        },
      },
    };
  },
];
