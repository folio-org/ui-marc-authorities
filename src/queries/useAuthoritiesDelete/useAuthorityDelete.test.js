import { QueryClient, QueryClientProvider } from 'react-query';

import {
  renderHook,
  act,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';
import useAuthorityDelete from './useAuthorityDelete';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useAuthorityDeleteMutation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should make delete request and call onSuccess', async () => {
    const deleteMock = jest.fn().mockResolvedValue({});
    const successMock = jest.fn();

    useOkapiKy.mockClear().mockReturnValue({
      delete: deleteMock,
    });

    const { result } = renderHook(
      () => useAuthorityDelete({ onError: () => {}, onSuccess: successMock }),
      { wrapper },
    );

    result.current.deleteItem({ id: 234 });

    await act(() => waitFor(() => expect(deleteMock).toHaveBeenCalled()));

    act(() => jest.advanceTimersByTime(1600));
    expect(await successMock).toHaveBeenCalled();
  });

  it('should make delete request and call onError', async () => {
    const deleteMock = jest.fn().mockRejectedValue(new Error('Async error'));
    const errorMock = jest.fn();

    useOkapiKy.mockClear().mockReturnValue({
      delete: deleteMock,
    });

    const { result } = renderHook(
      () => useAuthorityDelete({ onError: errorMock, onSuccess: () => {} }),
      { wrapper },
    );

    result.current.deleteItem({ id: 234 });

    await act(() => waitFor(() => {
      expect(deleteMock).toHaveBeenCalled();
      expect(errorMock).toHaveBeenCalled();
    }));
  });
});
