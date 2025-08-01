import saveAs from 'file-saver';

import {
  waitFor,
  render,
  fireEvent,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';
import {
  navigationSegments,
  searchResultListColumns,
  SearchResultsList,
} from '@folio/stripes-authority-components';

import AuthoritiesSearch from './AuthoritiesSearch';
import authorities from '../../../mocks/authorities';

import '../../../test/jest/__mock__';
import Harness from '../../../test/jest/helpers/harness';
import {
  sortableColumns,
  sortOrders,
} from '../../constants';
import {
  useSortColumnManager,
  useResourcesIds,
} from '../../hooks';

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

jest.mock('file-saver', () => jest.fn());

jest.mock('@folio/stripes-authority-components', () => ({
  ...jest.requireActual('@folio/stripes-authority-components'),
  useAuthorities: () => ({ authorities: [] }),
  AuthoritiesSearchPane: props => (
    <div>
      AuthoritiesSearchPane
      <button type="button" data-testid="reset-all" onClick={() => props.resetSelectedRows()}>Reset all</button>
    </div>
  ),
  useAuthoritySourceFiles: jest.fn().mockReturnValue({
    isLoading: false,
    sourceFiles: [],
  }),
  SearchResultsList: jest.fn(props => {
    const ReactSearchResultsList = jest.requireActual('@folio/stripes-authority-components').SearchResultsList;

    return <ReactSearchResultsList {...props} />;
  }),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useSortColumnManager: jest.fn(),
  useReportGenerator: jest.fn(),
  useResourcesIds: jest.fn().mockReturnValue({
    getResourcesIds: jest.fn(),
  }),
}));

const mockHandleLoadMore = jest.fn();
const mockSetSortedColumn = jest.fn();
const mockOnHeaderClick = jest.fn();
const mockOnSubmitSearch = jest.fn();

const getAuthoritiesSearch = (props = {}, selectedRecord = null, authoritiesCtxValue = {}) => (
  <Harness
    selectedRecordCtxValue={[selectedRecord, mockSetSelectedAuthorityRecordContext]}
    authoritiesCtxValue={{
      searchQuery: '',
      filters: [],
      setSortedColumn: mockSetSortedColumn,
      navigationSegmentValue: navigationSegments.search,
      ...authoritiesCtxValue,
    }}
  >
    <AuthoritiesSearch
      handleLoadMore={mockHandleLoadMore}
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
    >
      <div>children</div>
    </AuthoritiesSearch>
  </Harness>
);

const renderAuthoritiesSearch = (...params) => render(getAuthoritiesSearch(...params));

describe('Given AuthoritiesSearch', () => {
  beforeEach(() => {
    sessionStorage.clear();
    useSortColumnManager.mockImplementation(jest.requireActual('../../hooks').useSortColumnManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when search displays a list of items', () => {
    it('should render with no axe errors', async () => {
      const { container } = renderAuthoritiesSearch({ authorities });

      await runAxeTest({
        rootNode: container,
      });
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

  it('should not display count of selected rows on panesub untill no rows are selected', () => {
    const { queryByText } = renderAuthoritiesSearch();

    expect(queryByText('ui-marc-authorities.authorities.rows.recordsSelected')).toBeNull();
  });

  describe('when click on row checkbox', () => {
    it('should select record', () => {
      const { getAllByTestId, queryByText } = renderAuthoritiesSearch({ authorities });

      const rowToggleButtons = getAllByTestId('row-toggle-button');

      fireEvent.click(rowToggleButtons[0]);

      expect(queryByText('ui-marc-authorities.authorities.rows.recordsSelected')).toBeDefined();
    });
  });

  describe('when double click on the same row checkbox', () => {
    it('should unselect record', () => {
      const { getAllByTestId, queryByText } = renderAuthoritiesSearch({ authorities });

      const rowToggleButtons = getAllByTestId('row-toggle-button');

      fireEvent.click(rowToggleButtons[0]);
      fireEvent.click(rowToggleButtons[0]);

      expect(queryByText('ui-marc-authorities.authorities.rows.recordsSelected')).toBeNull();
    });
  });

  describe('when click on "Actions" button', () => {
    it('should display disabled "Export selected records (CSV/MARC)" button', () => {
      const { getByRole } = renderAuthoritiesSearch();

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

      const exportRecordsButton = getByRole('button', { name: 'ui-marc-authorities.export-selected-records' });

      expect(exportRecordsButton).toBeDefined();
      expect(exportRecordsButton).toBeDisabled();
    });

    it('should display disabled "Save authorities CQL query" button', () => {
      const { getByRole } = renderAuthoritiesSearch();

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

      const exportRecordsButton = getByRole('button', { name: 'ui-marc-authorities.export-cql-query' });

      expect(exportRecordsButton).toBeDefined();
      expect(exportRecordsButton).toBeDisabled();
    });

    it('should show Save Authorities UUIDs button', async () => {
      renderAuthoritiesSearch();

      fireEvent.click(screen.getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

      const saveAuthoritiesUIIDSButton = screen.getByRole('button', { name: 'ui-marc-authorities.actions.saveAuthoritiesUIIDS' });

      expect(saveAuthoritiesUIIDSButton).toBeVisible();
      expect(saveAuthoritiesUIIDSButton).toBeDisabled();
    });

    describe('when in Browse mode', () => {
      it('should not display "Save authorities CQL query" button', () => {
        const { getByRole, queryByRole } = renderAuthoritiesSearch(null, null, {
          navigationSegmentValue: navigationSegments.browse,
        });

        fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

        const exportRecordsButton = queryByRole('button', { name: 'ui-marc-authorities.export-cql-query' });

        expect(exportRecordsButton).not.toBeInTheDocument();
      });

      it('should not show Save Authorities UUIDs button', () => {
        renderAuthoritiesSearch(null, null, {
          navigationSegmentValue: navigationSegments.browse,
        });

        fireEvent.click(screen.getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

        const saveAuthoritiesUIIDSButton = screen.queryByRole('button', { name: 'ui-marc-authorities.actions.saveAuthoritiesUIIDS' });

        expect(saveAuthoritiesUIIDSButton).not.toBeInTheDocument();
      });
    });

    describe('when search results list contains at least 1 authority', () => {
      beforeEach(() => {
        renderAuthoritiesSearch({
          authorities: [{
            id: 'testid',
          }],
          query: 'keyword all test',
        });

        fireEvent.click(screen.getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
      });

      it('should enable the "Save authorities CQL query" button', () => {
        const exportRecordsButton = screen.getByRole('button', { name: 'ui-marc-authorities.export-cql-query' });

        expect(exportRecordsButton).toBeEnabled();
      });

      describe('when clicking the "Save authorities CQL query" button', () => {
        it('should save a cql file', () => {
          fireEvent.click(screen.getByRole('button', { name: 'ui-marc-authorities.export-cql-query' }));

          expect(saveAs).toHaveBeenCalledWith(expect.any(Object), expect.stringContaining('SearchAuthorityCQLQuery'));
        });
      });

      it('should enable the "Save authorities UUIDs" button', () => {
        const saveAuthoritiesUUIDsButton = screen.getByRole('button', { name: 'ui-marc-authorities.actions.saveAuthoritiesUIIDS' });

        expect(saveAuthoritiesUUIDsButton).toBeEnabled();
      });

      describe('when clicking the "Save authorities CQL query" button', () => {
        const mockGetResourcesIds = jest.fn();

        useResourcesIds.mockClear().mockReturnValue({
          getResourcesIds: mockGetResourcesIds,
        });

        it('should fetch uuids with correct query', () => {
          fireEvent.click(screen.getByRole('button', { name: 'ui-marc-authorities.actions.saveAuthoritiesUIIDS' }));

          expect(mockGetResourcesIds).toHaveBeenCalledWith('keyword all test', 'AUTHORITY');
        });
      });
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

    it('should display reports', () => {
      const { getByRole } = renderAuthoritiesSearch();

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

      const marcAuthorityHeadingsButton = getByRole('button', { name: 'ui-marc-authorities.reports.marcAuthorityHeadings' });
      // const failedUpdatesButton = getByRole('button', { name: 'ui-marc-authorities.reports.failedUpdates' });

      expect(marcAuthorityHeadingsButton).toBeVisible();
      // expect(failedUpdatesButton).toBeVisible();
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
          jest.mock('../../hooks/useAuthorityExport', () => ({
            useAuthorityExport: (_, onSuccess) => ({ exportRecords: data => onSuccess(data) }),
          }));

          const { getAllByTestId, getByRole, queryByText } = renderAuthoritiesSearch({ authorities });

          const rowToggleButtons = getAllByTestId('row-toggle-button');

          fireEvent.click(rowToggleButtons[0]);

          fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
          fireEvent.click(getByRole('button', { name: 'ui-marc-authorities.export-selected-records' }));

          expect(queryByText('ui-marc-authorities.export.success')).toBeDefined();
          await waitFor(() => expect(queryByText('ui-marc-authorities.authorities.rows.recordsSelected')).toBeNull);
        });

        it('should be able to show error toast message', () => {
          jest.mock('../../hooks/useAuthorityExport', () => ({
            useAuthorityExport: () => ({ exportRecords: () => {} }),
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

        expect(mockSetSortedColumn).toHaveBeenCalledWith(searchResultListColumns.HEADING_TYPE);
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

          expect(mockSetSortedColumn).toHaveBeenCalledWith('');
        });
      });
    });

    describe('when click on "Type of Heading" checkbox', () => {
      it('should hide "Type of Heading" column', () => {
        const {
          getByRole,
          queryByRole,
        } = renderAuthoritiesSearch({ authorities });

        fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));
        fireEvent.click(getByRole('checkbox', { name: 'stripes-authority-components.search-results-list.headingType' }));

        expect(queryByRole('button', { name: 'stripes-authority-components.search-results-list.headingType' })).toBeNull();
      });
    });
  });

  describe('should select all rows when header checkbox is clicked', () => {
    it('should select all rows', () => {
      const { getByTestId, queryByText } = renderAuthoritiesSearch({ authorities });

      const selectAllRowsToggleButton = getByTestId('select-all-rows-toggle-button');

      fireEvent.click(selectAllRowsToggleButton);

      expect(queryByText('ui-marc-authorities.authorities.rows.recordsSelected')).toBeDefined();
    });
  });

  describe('should unselect all rows when header checkbox is clicked twice', () => {
    it('should unselect all rows', () => {
      const { getByTestId, queryByText } = renderAuthoritiesSearch({ authorities });

      const selectAllRowsToggleButton = getByTestId('select-all-rows-toggle-button');

      fireEvent.click(selectAllRowsToggleButton);
      fireEvent.click(selectAllRowsToggleButton);

      expect(queryByText('ui-marc-authorities.authorities.rows.recordsSelected')).toBeNull();
    });
  });

  describe('should clear the selected records when clicking on "reset all" button', () => {
    it('should unselect all rows', () => {
      const { getByTestId, queryByText } = renderAuthoritiesSearch({ authorities });

      const resetAllButton = getByTestId('reset-all');

      fireEvent.click(resetAllButton);

      expect(queryByText('ui-marc-authorities.authorities.rows.recordsSelected')).toBeNull();
    });
  });

  describe('when there is only one record', () => {
    it('should call history.push with specific params', () => {
      renderAuthoritiesSearch({
        authorities: [authorities[0]],
        totalRecords: 1,
        query: '(keyword=="Chow, Shoo-jin, 1881-1936")',
      });
      expect(mockHistoryPush).toHaveBeenCalledWith(
        '/authorities/5a404f5d-2c46-4426-9f28-db8d26881b30?authRefType=Auth%2FRef&headingRef=Twain%2C%20Mark',
      );
    });

    describe('and a user clicks X icon to close the detail view', () => {
      it('should not open the detail view again', () => {
        const props = {
          authorities: [authorities[0]],
          totalRecords: 1,
          query: '(keyword=="Chow, Shoo-jin, 1881-1936")',
        };
        const pathToShowDetailView = '/authorities/5a404f5d-2c46-4426-9f28-db8d26881b30?authRefType=Auth%2FRef&headingRef=Twain%2C%20Mark';

        const { rerender } = renderAuthoritiesSearch(props);

        rerender(getAuthoritiesSearch(props));

        const numberOfDetailViewOpenings = mockHistoryPush.mock.calls
          .filter(call => call[0] === pathToShowDetailView)
          .length;

        expect(numberOfDetailViewOpenings).toBe(1);
      });
    });
  });

  describe('when there is a linked record', () => {
    it('should show number of titles and be a link to the inventory app by authority ID', () => {
      const { getAllByRole, getByTestId } = renderAuthoritiesSearch({
        authorities: authorities.slice(0, 3),
        totalRecords: 3,
      });

      expect(getAllByRole('row')[2].textContent).toContain('Authorized');
      expect(getAllByRole('row')[2].textContent).toContain('Twain, Mark linked');
      expect(getAllByRole('row')[2].textContent).toContain('1');
      expect(getByTestId('link-number-of-titles').href).toContain(
        '/inventory?qindex=authorityId&query=5a404f5d-2c46-4426-9f28-db8d26881b31&sort=title',
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

  describe('when Authority record is shared', () => {
    it('should render shared icon', () => {
      const { getByText } = renderAuthoritiesSearch({ authorities });

      expect(getByText('stripes-authority-components.search.shared')).toBeInTheDocument();
    });
  });

  it('should display columns', () => {
    const { getByRole } = renderAuthoritiesSearch({ authorities });

    expect(getByRole('columnheader', { name: 'stripes-authority-components.search-results-list.authRefType' })).toBeVisible();
    expect(getByRole('columnheader', { name: 'stripes-authority-components.search-results-list.headingRef' })).toBeVisible();
    expect(getByRole('columnheader', { name: 'stripes-authority-components.search-results-list.headingType' })).toBeVisible();
    expect(getByRole('columnheader', { name: 'stripes-authority-components.search-results-list.authoritySource' })).toBeVisible();
    expect(getByRole('columnheader', { name: 'ui-marc-authorities.search-results-list.numberOfTitles' })).toBeVisible();
  });

  it('should have correct props in SearchResultsList', () => {
    renderAuthoritiesSearch({ authorities });

    const expectedProps = {
      nonInteractiveHeaders: ['select'],
      sortableColumns,
    };

    expect(SearchResultsList).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
  });
});
