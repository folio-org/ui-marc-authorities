import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  renderHook,
  act,
} from '@testing-library/react-hooks';
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
    const deleteMock = jest.fn().mockResolvedValue({ json: () => ({ actionId: 'actionId' }) });
    const getMock = jest.fn().mockResolvedValue({ json: () => ({ status: 'COMPLETED' }) });
    const successMock = jest.fn();

    useOkapiKy.mockClear().mockReturnValue({
      delete: deleteMock,
      get: getMock,
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useAuthorityDelete({ onError: () => {}, onSuccess: successMock }),
      { wrapper },
    );

    result.current.deleteItem({ id: 234 });

    await waitForNextUpdate();

    expect(deleteMock).toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(600));
    expect(await successMock).toHaveBeenCalled();
  });

  it('should make delete request and call onError', async () => {
    const deleteMock = jest.fn().mockRejectedValue(new Error('Async error'));
    const errorMock = jest.fn();

    useOkapiKy.mockClear().mockReturnValue({
      delete: deleteMock,
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useAuthorityDelete({ onError: errorMock, onSuccess: () => {} }),
      { wrapper },
    );

    result.current.deleteItem({ id: 234 });

    await waitForNextUpdate();

    expect(deleteMock).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalled();
  });
});
