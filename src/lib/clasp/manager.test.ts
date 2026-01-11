import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ClaspManager } from './manager'
import { GASClient } from './api'
import type { GASFile } from './types'

vi.mock('./api')

describe('ClaspManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loadProject', () => {
    it('should return code and name from first SERVER_JS file', async () => {
      const mockFiles: GASFile[] = [
        { name: 'Code', type: 'SERVER_JS', source: 'function test() {}' },
        { name: 'Index', type: 'HTML', source: '<html></html>' },
      ]
      vi.mocked(GASClient.getContent).mockResolvedValue(mockFiles)

      const result = await ClaspManager.loadProject('test-script-id')

      expect(result).toEqual({
        code: 'function test() {}',
        name: 'Code',
      })
      expect(GASClient.getContent).toHaveBeenCalledWith('test-script-id')
    })

    it('should return first file if no SERVER_JS exists', async () => {
      const mockFiles: GASFile[] = [
        { name: 'Index', type: 'HTML', source: '<html></html>' },
      ]
      vi.mocked(GASClient.getContent).mockResolvedValue(mockFiles)

      const result = await ClaspManager.loadProject('test-script-id')

      expect(result).toEqual({
        code: '<html></html>',
        name: 'Index',
      })
    })

    it('should throw error when no files found', async () => {
      vi.mocked(GASClient.getContent).mockResolvedValue([])

      await expect(ClaspManager.loadProject('test-script-id')).rejects.toThrow(
        'No files found in project',
      )
    })

    it('should throw error when API call fails', async () => {
      vi.mocked(GASClient.getContent).mockRejectedValue(new Error('API error'))

      await expect(ClaspManager.loadProject('test-script-id')).rejects.toThrow(
        'API error',
      )
    })
  })

  describe('saveProject', () => {
    it('should update existing file', async () => {
      const mockFiles: GASFile[] = [
        { name: 'Code', type: 'SERVER_JS', source: 'function old() {}' },
      ]
      vi.mocked(GASClient.getContent).mockResolvedValue(mockFiles)
      vi.mocked(GASClient.updateContent).mockResolvedValue()

      await ClaspManager.saveProject(
        'test-script-id',
        'function new() {}',
        'Code',
      )

      expect(GASClient.getContent).toHaveBeenCalledWith('test-script-id')
      expect(GASClient.updateContent).toHaveBeenCalledWith('test-script-id', [
        { name: 'Code', type: 'SERVER_JS', source: 'function new() {}' },
      ])
    })

    it('should add new file if not found', async () => {
      const mockFiles: GASFile[] = []
      vi.mocked(GASClient.getContent).mockResolvedValue(mockFiles)
      vi.mocked(GASClient.updateContent).mockResolvedValue()

      await ClaspManager.saveProject(
        'test-script-id',
        'function new() {}',
        'NewCode',
      )

      expect(GASClient.updateContent).toHaveBeenCalledWith('test-script-id', [
        { name: 'NewCode', type: 'SERVER_JS', source: 'function new() {}' },
      ])
    })

    it('should throw error when API call fails', async () => {
      vi.mocked(GASClient.getContent).mockRejectedValue(new Error('API error'))

      await expect(
        ClaspManager.saveProject(
          'test-script-id',
          'function test() {}',
          'Code',
        ),
      ).rejects.toThrow('API error')
    })
  })
})
