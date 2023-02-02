import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useExportReport } from './useExportReport';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockOnError = jest.fn();
const mockOnSuccess = jest.fn();

describe('useExportReport', () => {
  it('should make post request', async () => {
    const postMock = jest.fn().mockReturnValue({
      json: jest.fn().mockResolvedValue({}),
    });

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useExportReport({ onError: mockOnError, onSuccess: mockOnSuccess }),
      { wrapper },
    );

    result.current.doExport();

    await waitForNextUpdate();

    expect(postMock).toHaveBeenCalled();
  });

  it('should make post request and call onError', async () => {
    const postMock = jest.fn().mockReturnValue({
      json: jest.fn().mockRejectedValue(new Error('Async error')),
    });

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
    });

    const { result, waitForNextUpdate } = renderHook(
      () => useExportReport({ onError: mockOnError, onSuccess: mockOnSuccess }),
      { wrapper },
    );

    result.current.doExport();

    await waitForNextUpdate();

    expect(postMock).toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalled();
  });
});
