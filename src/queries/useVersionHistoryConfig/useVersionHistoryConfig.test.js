import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useVersionHistoryConfig } from './useVersionHistoryConfig';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockPut = jest.fn().mockReturnValue({
  json: jest.fn().mockResolvedValue(),
});

const mockGet = jest.fn().mockReturnValue({
  json: jest.fn().mockResolvedValue({
    settings: [
      {
        key: 'records.page.size',
        value: 25,
        metadata: {},
      },
    ],
  }),
});

useOkapiKy.mockReturnValue({
  put: mockPut,
  get: mockGet,
});

describe('useVersionHistoryConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should make a get request', async () => {
    const { result } = renderHook(useVersionHistoryConfig, { wrapper });

    await act(() => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledWith('audit/config/groups/audit.authority/settings');
    expect(result.current.pageSize).toBe(25);
  });

  it('should make a put request', async () => {
    const { result } = renderHook(useVersionHistoryConfig, { wrapper });

    await act(() => !result.current.isLoading);
    await act(() => result.current.updatePageSize(50));

    expect(mockPut).toHaveBeenCalledWith('audit/config/groups/audit.authority/settings/records.page.size', {
      json: {
        key: 'records.page.size',
        value: 50,
      },
    });
  });
});
