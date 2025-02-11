import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useAuditSettings } from './useAuditSettings';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockPut = jest.fn().mockReturnValue({
  json: jest.fn().mockResolvedValue(),
});

const settings = [
  {
    key: 'records.page.size',
    value: 25,
    metadata: {},
  },
];

const mockGet = jest.fn().mockReturnValue({
  json: jest.fn().mockResolvedValue({
    settings,
  }),
});

useOkapiKy.mockReturnValue({
  put: mockPut,
  get: mockGet,
});

describe('useAuditSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should make a get request', async () => {
    const { result } = renderHook(useAuditSettings, { wrapper });

    await act(() => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledWith('audit/config/groups/audit.authority/settings');
    expect(result.current.settings).toEqual(settings);
  });

  it('should make a put request', async () => {
    const { result } = renderHook(useAuditSettings, { wrapper });

    const body = {
      key: 'foo',
      value: 50,
    };

    const settingKey = 'some-key';

    await act(() => !result.current.isLoading);
    await act(() => result.current.updateSetting({
      body,
      settingKey,
    }));

    expect(mockPut).toHaveBeenCalledWith(`audit/config/groups/audit.authority/settings/${settingKey}`, {
      json: body,
    });
  });
});
