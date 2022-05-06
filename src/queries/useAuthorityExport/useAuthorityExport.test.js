import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

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

    const { result, waitForNextUpdate } = renderHook(
      () => useAuthorityExport({}),
      { wrapper },
    );

    result.current.exportRecords();

    await waitForNextUpdate();

    expect(postMock).toHaveBeenCalled();
  });

  it('should make post request and call onError', async () => {
    const postMock = jest.fn().mockRejectedValue(new Error('Async error'));
    const errorMock = jest.fn();

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useAuthorityExport({ onError: errorMock }),
      { wrapper },
    );

    result.current.exportRecords([]);

    await waitForNextUpdate();

    expect(postMock).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalled();
  });
});
