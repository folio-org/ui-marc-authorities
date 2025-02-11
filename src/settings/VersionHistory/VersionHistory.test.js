import {
  render,
  act,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useCallout } from '@folio/stripes/core';

import { useVersionHistoryConfig } from '../../queries/useVersionHistoryConfig';
import Harness from '../../../test/jest/helpers/harness';
import { VersionHistory } from './VersionHistory';

jest.mock('../../queries/useVersionHistoryConfig', () => ({
  useVersionHistoryConfig: jest.fn(),
}));

const mockRefetch = jest.fn().mockResolvedValue();
const mockUpdatePageSize = jest.fn().mockResolvedValue();
const mockSendCallout = jest.fn();

useVersionHistoryConfig.mockReturnValue({
  pageSize: 10,
  refetch: mockRefetch,
  isLoading: false,
  updatePageSize: mockUpdatePageSize,
});

useCallout.mockReturnValue({
  sendCallout: mockSendCallout,
});

const renderVersionHistory = () => render(
  <VersionHistory />,
  { wrapper: Harness },
);

describe('VersionHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render VersionHistory', () => {
    const { getByText, getByLabelText } = renderVersionHistory();

    expect(getByText('ui-marc-authorities.settings.versionHistory.pane.title')).toBeInTheDocument();
    expect(getByLabelText('ui-marc-authorities.settings.versionHistory.field.pageSize')).toBeInTheDocument();
  });

  it('should submit the form successfully', async () => {
    const { getByLabelText, getByText } = renderVersionHistory();

    await act(() => userEvent.selectOptions(getByLabelText('ui-marc-authorities.settings.versionHistory.field.pageSize'), '50'));
    await act(() => userEvent.click(getByText('stripes-core.button.save')));

    expect(mockUpdatePageSize).toHaveBeenCalledWith(50);
    expect(mockSendCallout).toHaveBeenCalledWith({ message: 'stripes-smart-components.cm.success' });
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('should handle form submission error', async () => {
    mockUpdatePageSize.mockRejectedValueOnce({});

    const { getByLabelText, getByText } = renderVersionHistory();

    await act(() => userEvent.selectOptions(getByLabelText('ui-marc-authorities.settings.versionHistory.field.pageSize'), '50'));
    await act(() => userEvent.click(getByText('stripes-core.button.save')));

    expect(mockSendCallout).toHaveBeenCalledWith({
      message: 'ui-marc-authorities.error.defaultSaveError',
      type: 'error',
    });
  });
});
