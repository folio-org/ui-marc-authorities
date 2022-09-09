import {
  waitFor,
  render,
  fireEvent,
} from '@testing-library/react';
import mockMapValues from 'lodash/mapValues';

import { runAxeTest } from '@folio/stripes-testing';

import AuthoritiesSearch from './AuthoritiesSearch';
import authorities from '../../../mocks/authorities';

import '../../../test/jest/__mock__';
import Harness from '../../../test/jest/helpers/harness';
import {
  searchResultListColumns,
  sortOrders,
} from '../../constants';
import { useSortColumnManager } from '../../hooks';

const mockHistoryPush = jest.fn();
const mockSetSelectedAuthorityRecordContext = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: jest.fn(),
  }),
  useLocation: jest.fn().mockImplementation(() => ({
    pathname: '',
    state: { editSuccessful: true },
  })),
  useRouteMatch: jest.fn().mockReturnValue({ path: '' }),
}));

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthorities: () => ({ authorities: [] }),
  SearchResultsList: props => {
    const mapedProps = mockMapValues(props, prop => ((typeof prop === 'object') ? JSON.stringify(prop) : prop));

    return (
      <div data-testid="SearchResultsList" {...mapedProps}>
        <button type="button" data-testid="select-all-rows-toggle-button" onClick={() => props.toggleSelectAll()}>select-all-rows-toggle-button</button>
        {props.authorities.map(authority => (
          <button
            type="button"
            data-testid="row-toggle-button"
            onClick={() => props.toggleRowSelection({ ...authority })}
          >
            row-toggle-button
          </button>
        ))}
      </div>
    );
  },
  AuthoritiesSearchPane: props => (
    <div>
      AuthoritiesSearchPane
      <button type="button" data-testid="reset-all" onClick={() => props.resetSelectedRows()}>Reset all</button>
    </div>
  ),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useSortColumnManager: jest.fn(),
  useReportGenerator: jest.fn(),
}));

const mockHandleLoadMore = jest.fn();
const mockOnChangeSortOption = jest.fn();
const mockOnHeaderClick = jest.fn();
const mockOnSubmitSearch = jest.fn();

const getAuthoritiesSearch = (props = {}, selectedRecord = null) => (
  <Harness selectedRecordCtxValue={[selectedRecord, mockSetSelectedAuthorityRecordContext]}>
    <AuthoritiesSearch
      handleLoadMore={mockHandleLoadMore}
      onChangeSortOption={mockOnChangeSortOption}
      onHeaderClick={mockOnHeaderClick}
      onSubmitSearch={mockOnSubmitSearch}
      authorities={[]}
      isLoaded
      isLoading={false}
      pageSize={100}
      sortedColumn="headingRef"
      sortOrder={sortOrders.ASC}
      totalRecords={100}
      {...props}
    />
  </Harness>
);

const renderAuthoritiesSearch = (...params) => render(getAuthoritiesSearch(...params));

describe('Given AuthoritiesSearch', () => {
  beforeEach(() => {
    useSortColumnManager.mockImplementation(jest.requireActual('../../hooks').useSortColumnManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderAuthoritiesSearch();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should render paneset', () => {
    const { getByTestId } = renderAuthoritiesSearch();

    expect(getByTestId('marc-authorities-paneset')).toBeDefined();
  });

  it('should display AuthoritiesSearchPane', () => {
    const { getByText } = renderAuthoritiesSearch();

    expect(getByText('AuthoritiesSearchPane')).toBeDefined();
  });

  it('should display "Actions" button', () => {
    const { getByRole } = renderAuthoritiesSearch();

    expect(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' })).toBeDefined();
  });

  it('should be default sort order', () => {
    const { getByTestId } = renderAuthoritiesSearch();

    expect(getByTestId('SearchResultsList')).toHaveAttribute('sortOrder', 'ascending');
  });

  it('should not be sorted by any column', () => {
    const { getByTestId } = renderAuthoritiesSearch();

    expect(getByTestId('SearchResultsList')).toHaveAttribute('sortedColumn', 'headingRef');
  });

  it('should not display count of selected rows on panesub untill no rows are selected', () => {
    const { queryByText } = renderAuthoritiesSearch();

    expect(queryByText('ui-inventory.instances.rows.recordsSelected')).toBeNull();
  });

  describe('when click on row checkbox', () => {
    it('should select record', () => {
      const { getAllByTestId, queryByText } = renderAuthoritiesSearch({ authorities });

      const rowToggleButtons = getAllByTestId('row-toggle-button');

      fireEvent.click(rowToggleButtons[0]);

      expect(queryByText('ui-inventory.instances.rows.recordsSelected')).toBeDefined();
    });
  });

  describe('when double click on the same row checkbox', () => {
    it('should unselect record', () => {
      const { getAllByTestId, queryByText } = renderAuthoritiesSearch({ authorities });

      const rowToggleButtons = getAllByTestId('row-toggle-button');

      fireEvent.click(rowToggleButtons[0]);
      fireEvent.click(rowToggleButtons[0]);

      expect(queryByText('ui-inventory.instances.rows.recordsSelected')).toBeNull();
    });
  });

  describe('when click on "Actions" button', () => {
    it('should display "Actions" section', () => {
      const {
        getByRole,
        getByText,
      } = renderAuthoritiesSearch();

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

      expect(getByText('ui-marc-authorities.actions')).toBeDefined();
    });

    it('should display disabled "Export selected records (CSV/MARC)" button', () => {
      const { getByRole } = renderAuthoritiesSearch();

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

      const exportRecordsButton = getByRole('button', { name: 'ui-marc-authorities.export-selected-records' });

      expect(exportRecordsButton).toBeDefined();
      expect(exportRecordsButton).toBeDisabled();
    });

    it('should display "Sort by" section', () => {
      const {
        getByRole,
        getByText,
      } = renderAuthoritiesSearch();

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

      expect(getByText('ui-marc-authorities.actions.menuSection.sortBy')).toBeDefined();
    });

    it('should display selection', () => {
      const {
        getByRole,
        getByText,
      } = renderAuthoritiesSearch();

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

      expect(getByText('ui-marc-authorities.actions.menuSection.sortBy.relevance')).toBeDefined();
    });

    it('should display "Show columns" section', () => {
      const {
        getByRole,
        getByText,
      } = renderAuthoritiesSearch();

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

      expect(getByText('stripes-smart-components.columnManager.showColumns')).toBeDefined();
    });

    it('should display "Authorized/Reference" and "Type of heading" checkboxes', () => {
      const { getByRole } = renderAuthoritiesSearch();

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

      expect(getByRole('checkbox', { name: 'stripes-authority-components.search-results-list.authRefType' })).toBeDefined();
      expect(getByRole('checkbox', { name: 'stripes-authority-components.search-results-list.headingType' })).toBeDefined();
    });

    it('should be checked by the default', () => {
      const { getByRole } = renderAuthoritiesSearch();

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

      expect(getByRole('checkbox', { name: 'stripes-authority-components.search-results-list.authRefType' })).toBeChecked();
      expect(getByRole('checkbox', { name: 'stripes-authority-components.search-results-list.headingType' })).toBeChecked();
    });

    describe('when there are selected rows', () => {
      it('"Export selected records (CSV/MARC)" button should be enabled', () => {
        const { getAllByTestId, getByRole } = renderAuthoritiesSearch({ authorities });

        fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

        const rowToggleButtons = getAllByTestId('row-toggle-button');

        fireEvent.click(rowToggleButtons[0]);

        const exportRecordsButton = getByRole('button', { name: 'ui-marc-authorities.export-selected-records' });

        expect(exportRecordsButton).toBeDefined();
        expect(exportRecordsButton).toBeEnabled();
      });

      describe('when click on "Export selected records (CSV/MARC)" button', () => {
        it('should be able to show success toast message and unselect records', async () => {
          jest.mock('../../queries/useAuthorityExport', () => ({
            useAuthorityExport: ({ onSuccess }) => ({ exportRecords: data => onSuccess(data) }),
          }));

          const { getAllByTestId, getByRole, queryByText } = renderAuthoritiesSearch({ authorities });

          const rowToggleButtons = getAllByTestId('row-toggle-button');

          fireEvent.click(rowToggleButtons[0]);

          fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
          fireEvent.click(getByRole('button', { name: 'ui-marc-authorities.export-selected-records' }));

          expect(queryByText('ui-marc-authorities.export.success')).toBeDefined();
          await waitFor(() => expect(queryByText('ui-inventory.instances.rows.recordsSelected')).toBeNull);
        });

        it('should be able to show error toast message', () => {
          jest.mock('../../queries/useAuthorityExport', () => ({
            useAuthorityExport: ({ onError }) => ({ exportRecords: () => onError() }),
          }));

          const { getAllByTestId, getByRole, queryByText } = renderAuthoritiesSearch({ authorities });

          const rowToggleButtons = getAllByTestId('row-toggle-button');

          fireEvent.click(rowToggleButtons[0]);

          fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
          fireEvent.click(getByRole('button', { name: 'ui-marc-authorities.export-selected-records' }));

          expect(queryByText('ui-marc-authorities.export.failure')).toBeDefined();
        });
      });
    });

    describe('when change sorted column throught selection to "Type of heading"', () => {
      it('should sort by "Type of Heading" column in descending order', () => {
        const {
          getByRole,
          getByTestId,
        } = renderAuthoritiesSearch();

        fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

        fireEvent.change(getByTestId('sort-by-selection'), { target: { value: 'headingType' } });

        expect(mockOnChangeSortOption).toHaveBeenCalledWith(searchResultListColumns.HEADING_TYPE);
      });

      describe('when change back to "Relevance" option', () => {
        it('should not sorted by any column', () => {
          const {
            getByRole,
            getByTestId,
          } = renderAuthoritiesSearch();

          fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

          fireEvent.change(getByTestId('sort-by-selection'), { target: { value: 'headingType' } });
          fireEvent.change(getByTestId('sort-by-selection'), { target: { value: '' } });

          expect(mockOnChangeSortOption).toHaveBeenCalledWith('');
        });
      });
    });

    describe('when click on "Type of Heading" checkbox', () => {
      it('should hide "Type of Heading" column', () => {
        const {
          getByRole,
          getByTestId,
        } = renderAuthoritiesSearch();

        fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
        fireEvent.click(getByRole('checkbox', { name: 'stripes-authority-components.search-results-list.headingType' }));

        expect(getByTestId('SearchResultsList')).toHaveAttribute('visibleColumns', JSON.stringify([
          searchResultListColumns.SELECT,
          searchResultListColumns.AUTH_REF_TYPE,
          searchResultListColumns.HEADING_REF,
        ]));
      });
    });
  });

  describe('should select all rows when header checkbox is clicked', () => {
    it('should select all rows', () => {
      const { getByTestId, queryByText } = renderAuthoritiesSearch({ authorities });

      const selectAllRowsToggleButton = getByTestId('select-all-rows-toggle-button');

      fireEvent.click(selectAllRowsToggleButton);

      expect(queryByText('ui-inventory.instances.rows.recordsSelected')).toBeDefined();
    });
  });

  describe('should unselect all rows when header checkbox is clicked twice', () => {
    it('should unselect all rows', () => {
      const { getByTestId, queryByText } = renderAuthoritiesSearch({ authorities });

      const selectAllRowsToggleButton = getByTestId('select-all-rows-toggle-button');

      fireEvent.click(selectAllRowsToggleButton);
      fireEvent.click(selectAllRowsToggleButton);

      expect(queryByText('ui-inventory.instances.rows.recordsSelected')).toBeNull();
    });
  });

  describe('should clear the selected records when clicking on "reset all" button', () => {
    it('should unselect all rows', () => {
      const { getByTestId, queryByText } = renderAuthoritiesSearch({ authorities });

      const resetAllButton = getByTestId('reset-all');

      fireEvent.click(resetAllButton);

      expect(queryByText('ui-inventory.instances.rows.recordsSelected')).toBeNull();
    });
  });

  describe('when there is only one record', () => {
    it('should call history.push with specific params', () => {
      renderAuthoritiesSearch({
        authorities: [authorities[0]],
        totalRecords: 1,
      });
      expect(mockHistoryPush).toHaveBeenCalledWith(
        '/authorities/5a404f5d-2c46-4426-9f28-db8d26881b30?authRefType=Auth%2FRef&headingRef=Twain%2C%20Mark',
      );
    });
  });

  describe('when there is an updated record to highlight', () => {
    it('should redirect to that updated record', () => {
      const { rerender } = renderAuthoritiesSearch({
        authorities: [{
          id: 'cbc03a36-2870-4184-9777-0c44d07edfe4',
          headingType: 'Geographic Name',
          authRefType: 'Authorized',
          headingRef: 'Springfield (Colo.)',
        }, {
          id: 'cbc03a36-2870-4184-9777-0c44d07edfe4',
          headingType: 'Geographic Name',
          authRefType: 'Reference',
          headingRef: 'Springfield (Colo.) Reference',
        }],
        totalResults: 2,
      }, {
        id: 'cbc03a36-2870-4184-9777-0c44d07edfe4',
        headingType: 'Geographic Name',
        authRefType: 'Reference',
        headingRef: 'Springfield',
      });

      rerender(getAuthoritiesSearch({
        authorities: [{
          id: 'cbc03a36-2870-4184-9777-0c44d07edfe4',
          headingType: 'Geographic Name',
          authRefType: 'Authorized',
          headingRef: 'Springfield (Colo.)',
        }, {
          id: 'cbc03a36-2870-4184-9777-0c44d07edfe4',
          headingType: 'Geographic Name',
          authRefType: 'Reference',
          headingRef: 'SpringfieldEDITED',
        }],
        totalResults: 2,
      }, {
        id: 'cbc03a36-2870-4184-9777-0c44d07edfe4',
        headingType: 'Geographic Name',
        authRefType: 'Reference',
        headingRef: 'Springfield',
      }));

      expect(mockHistoryPush).toHaveBeenCalledWith('/authorities/cbc03a36-2870-4184-9777-0c44d07edfe4?authRefType=Reference&headingRef=SpringfieldEDITED');
    });
  });
});
