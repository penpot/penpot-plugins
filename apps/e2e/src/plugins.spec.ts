import testingPlugin from './plugins/create-frame-text-rect';
import { Agent } from './utils/agent';

describe('Plugins', () => {
  it('create frame - text - rectable', async () => {
    const agent = await Agent();
    const result = await agent.runCode(testingPlugin.toString());

    expect(result).toMatchSnapshot();
  });
});
