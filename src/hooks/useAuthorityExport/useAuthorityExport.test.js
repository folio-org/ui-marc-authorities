import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  act,
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useCallout } from '@folio/stripes/core';

import { useAuthorityExport } from './useAuthorityExport';
import { useReportGenerator } from '../useReportGenerator';
import { useQuickExport } from '../../queries';

jest.mock('../useReportGenerator', () => ({
  useReportGenerator: jest.fn().mockReturnValue({
    toCSV: jest.fn().mockReturnValue({}),
  }),
}));

jest.mock('../../queries', () => ({
  useQuickExport: jest.fn().mockReturnValue({
    exportRecords: jest.fn(),
  }),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useCallout: jest.fn().mockReturnValue({
    sendCallout: jest.fn(),
  }),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const reportGenerator = {
  toCSV: jest.fn().mockReturnValue({}),
};

const mockCallout = {
  sendCallout: jest.fn(),
};

describe('useAuthorityExport', () => {
  const selectedRowsIds = ['id-1'];

  beforeEach(() => {
    useCallout.mockClear().mockReturnValue(mockCallout);
    useReportGenerator.mockClear().mockReturnValue(reportGenerator);
    jest.clearAllMocks();
  });

  describe('when export is successful', () => {
    beforeEach(() => {
      useQuickExport.mockClear().mockImplementation(({ onSuccess }) => {
        return { exportRecords: () => onSuccess() };
      });
    });

    it('should call toCSV with correct data', async () => {
      const mockOnSuccess = jest.fn();

      const { result } = renderHook(() => useAuthorityExport(selectedRowsIds, mockOnSuccess), { wrapper });

      result.current.exportRecords();

      await act(() => waitFor(() => expect(reportGenerator.toCSV).toHaveBeenCalledWith(selectedRowsIds)));
    });

    it('should call onSuccess callback', async () => {
      const mockOnSuccess = jest.fn();

      const { result } = renderHook(() => useAuthorityExport(selectedRowsIds, mockOnSuccess), { wrapper });

      result.current.exportRecords();

      await act(() => waitFor(() => expect(mockOnSuccess).toHaveBeenCalled()));
    });

    it('should show success callout message', async () => {
      const mockOnSuccess = jest.fn();

      const { result } = renderHook(() => useAuthorityExport(selectedRowsIds, mockOnSuccess), { wrapper });

      result.current.exportRecords();

      await act(() => waitFor(() => expect(mockCallout.sendCallout).toHaveBeenCalledWith({
        type: 'success',
        message: 'ui-marc-authorities.export.success',
      })));
    });
  });

  describe('when export fails', () => {
    beforeEach(() => {
      useQuickExport.mockClear().mockImplementation(({ onError }) => {
        return { exportRecords: () => onError() };
      });
    });

    it('should show success callout message', async () => {
      const mockOnSuccess = jest.fn();

      const { result } = renderHook(() => useAuthorityExport(selectedRowsIds, mockOnSuccess), { wrapper });

      result.current.exportRecords();

      await act(() => waitFor(() => expect(mockCallout.sendCallout).toHaveBeenCalledWith({
        type: 'error',
        message: 'ui-marc-authorities.export.failure',
      })));
    });
  });
});
