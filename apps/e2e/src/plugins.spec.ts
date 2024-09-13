import { Agent } from './utils/agent';
import testingPlugin from './plugins/create-frame-text-rect';
import flex from './plugins/create-flexlayout';
import grid from './plugins/create-gridlayout';
import group from './plugins/group';
import insertSvg from './plugins/insert-svg';
import pluginData from './plugins/plugin-data';
import componentLibrary from './plugins/component-library';
import createText from './plugins/create-text';

describe('Plugins', () => {
  it('create frame - text - rectable', async () => {
    const agent = await Agent();
    const result = await agent.runCode(testingPlugin.toString());
    expect(result).toMatchSnapshot();
  });

  it('create flex layout', async () => {
    const agent = await Agent();
    const result = await agent.runCode(flex.toString());
    expect(result).toMatchSnapshot();
  });

  it('create grid layout', async () => {
    const agent = await Agent();
    const result = await agent.runCode(grid.toString());
    expect(result).toMatchSnapshot();
  });

  it('group and ungroup', async () => {
    const agent = await Agent();
    const result = await agent.runCode(group.toString());
    expect(result).toMatchSnapshot();
  });

  it('insert svg', async () => {
    const agent = await Agent();
    const result = await agent.runCode(insertSvg.toString());
    expect(result).toMatchSnapshot();
  });

  it('plugin data', async () => {
    const agent = await Agent();
    const result = await agent.runCode(pluginData.toString());
    expect(result).toMatchSnapshot();
  });

  it('component library', async () => {
    const agent = await Agent();
    const result = await agent.runCode(componentLibrary.toString());
    expect(result).toMatchSnapshot();
  });

  it('text and textrange', async () => {
    const agent = await Agent();
    const result = await agent.runCode(createText.toString());
    expect(result).toMatchSnapshot();
  });
});
