import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  act,
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useAuthorityExport from './useAuthorityExport';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useAuthorityExport', () => {
  it('should make post request', async () => {
    const postMock = jest.fn().mockResolvedValue({});

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
    });

    const { result } = renderHook(
      () => useAuthorityExport({}),
      { wrapper },
    );

    result.current.exportRecords();

    await act(() => waitFor(() => expect(postMock).toHaveBeenCalled()));
  });

  it('should make post request and call onError', async () => {
    const postMock = jest.fn().mockRejectedValue(new Error('Async error'));
    const errorMock = jest.fn();

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
    });

    const { result } = renderHook(
      () => useAuthorityExport({ onError: errorMock }),
      { wrapper },
    );

    result.current.exportRecords([]);

    await act(() => waitFor(() => {
      expect(postMock).toHaveBeenCalled();
      expect(errorMock).toHaveBeenCalled();
    }));
  });
});
