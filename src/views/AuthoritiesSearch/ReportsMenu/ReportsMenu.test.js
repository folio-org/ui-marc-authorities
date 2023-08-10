import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import Harness from '../../../../test/jest/helpers/harness';

import ReportsMenu from './ReportsMenu';
import { REPORT_TYPES } from '../constants';

const mockOnToggle = jest.fn();
const mockOnSelectReport = jest.fn();

const renderReportsMenu = (props = {}) => render(
  <Harness>
    <ReportsMenu
      onToggle={mockOnToggle}
      onSelectReport={mockOnSelectReport}
      {...props}
    />
  </Harness>,
);

describe('Given ReportsMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderReportsMenu();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should render report type buttons', () => {
    const { getByText } = renderReportsMenu();

    expect(getByText('ui-marc-authorities.reports.marcAuthorityHeadings')).toBeDefined();
    // expect(getByText('ui-marc-authorities.reports.failedUpdates')).toBeDefined();
  });

  describe('when clicking on report type', () => {
    it('should call onToggle', () => {
      const { getByText } = renderReportsMenu();

      fireEvent.click(getByText('ui-marc-authorities.reports.marcAuthorityHeadings'));

      expect(mockOnToggle).toHaveBeenCalled();
    });

    it('should call onSelectReport', () => {
      const { getByText } = renderReportsMenu();

      fireEvent.click(getByText('ui-marc-authorities.reports.marcAuthorityHeadings'));

      expect(mockOnSelectReport).toHaveBeenCalledWith(REPORT_TYPES.HEADINGS_UPDATES);
    });
  });
});
