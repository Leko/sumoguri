import { cmd } from './options'

describe('CLI options', () => {
  beforeEach(() => {
    console.error = jest.fn().mockImplementation()
  })
  afterEach(() => {
    ;(console.error as jest.Mock).mockRestore()
  })

  it('help snapshots', () => {
    cmd.showHelp()
    expect((console.error as jest.Mock).mock.calls[0][0]).toMatchSnapshot()
  })
})
