import {
  render,
  fireEvent,
} from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import Harness from '../../../../test/jest/helpers/harness';

import { ReportsModal } from './ReportsModal';
import { REPORT_TYPES } from '../constants';

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

const renderReportsModal = (props = {}) => render(
  <Harness>
    <ReportsModal
      open
      onClose={mockOnClose}
      reportType={REPORT_TYPES.HEADINGS_UPDATES}
      onSubmit={mockOnSubmit}
      {...props}
    />
  </Harness>,
);

describe('Given ReportsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderReportsModal();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should render correct report type in label', () => {
    const { getByText } = renderReportsModal();

    expect(getByText(`ui-marc-authorities.reportModal.${REPORT_TYPES.HEADINGS_UPDATES}.label`)).toBeDefined();
  });

  describe('when form is empty', () => {
    it('should disable export button', () => {
      const { getByTestId } = renderReportsModal();

      expect(getByTestId('export-button')).toBeDisabled();
    });
  });

  describe('when clicking on export button', () => {
    it('should call submit', () => {
      const {
        getByText,
        getByRole,
      } = renderReportsModal();

      fireEvent.change(getByRole('textbox', { name: 'ui-marc-authorities.reportModal.startDate' }), { target: { value: '01/01/2023' } });
      fireEvent.change(getByRole('textbox', { name: 'ui-marc-authorities.reportModal.endDate' }), { target: { value: '02/01/2023' } });

      fireEvent.click(getByText('ui-marc-authorities.reportModal.button.export'));

      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
