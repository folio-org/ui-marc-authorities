import {
  act,
  waitFor,
  render,
  fireEvent,
} from '@testing-library/react';
import routeData from 'react-router';
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

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useLocation: jest.fn().mockImplementation(() => ({
    pathname: '',
  })),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useSortColumnManager: jest.fn(),
  useReportGenerator: jest.fn(),
}));

jest.mock('../../queries/useAuthorities', () => ({
  useAuthorities: () => ({ authorities: [] }),
}));

jest.mock('../../components', () => ({
  ...jest.requireActual('../../components'),
  SearchResultsList: (props) => {
    const mapedProps = mockMapValues(props, (prop) => ((typeof prop === 'object') ? JSON.stringify(prop) : prop));

    return (
      <div data-testid="SearchResultsList" {...mapedProps}>
        {props.authorities.map((authority) => (
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
  SearchFilters: () => <div>SearchFilters</div>,
  AuthoritiesSearchForm: () => <div>AuthoritiesSearchForm</div>,
}));

const mockHandleLoadMore = jest.fn();
const mockOnChangeSortOption = jest.fn();
const mockOnHeaderClick = jest.fn();
const mockOnSubmitSearch = jest.fn();

const renderAuthoritiesSearch = (props = {}) => render(
  <Harness>
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
  </Harness>,
);

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

  it('should display `Search & filter` label', () => {
    const { getByText } = renderAuthoritiesSearch();

    expect(getByText('ui-marc-authorities.search.searchAndFilter')).toBeDefined();
  });

  it('should display AuthoritiesSearchForm', () => {
    const { getByText } = renderAuthoritiesSearch();

    expect(getByText('AuthoritiesSearchForm')).toBeDefined();
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

  describe('when click on toggle filter pane button', () => {
    describe('when filters were shown', () => {
      it('should hide filters', async () => {
        jest.spyOn(routeData, 'useLocation').mockReturnValue({
          pathname: 'pathname',
          search: '?qindex=test&segment=browse',
        });

        let getByRoleFunction;
        let getByTestIdFunction;
        let queryByTestIdFunction;

        await act(async () => {
          const {
            getByRole,
            getByTestId,
            queryByTestId,
          } = await renderAuthoritiesSearch();

          getByRoleFunction = getByRole;
          getByTestIdFunction = getByTestId;
          queryByTestIdFunction = queryByTestId;
        });

        const filterPaneTestId = 'pane-authorities-filters';
        const hideFilterPaneButton = getByRoleFunction('button', { name: 'stripes-smart-components.hideSearchPane' });

        expect(getByTestIdFunction(filterPaneTestId)).toBeDefined();

        fireEvent.click(hideFilterPaneButton);

        await waitFor(() => {
          expect(queryByTestIdFunction(filterPaneTestId)).toBeNull();
        });
      });
    });

    describe('when filters were hidden', () => {
      it('should show filters', async () => {
        jest.spyOn(routeData, 'useLocation').mockReturnValue({
          pathname: 'pathname',
          search: '?excludeSeeFrom=true&query=test',
        });

        let getByRoleFunction;
        let getByTestIdFunction;
        let queryByTestIdFunction;

        await act(async () => {
          const {
            getByRole,
            getByTestId,
            queryByTestId,
          } = await renderAuthoritiesSearch();

          getByRoleFunction = getByRole;
          getByTestIdFunction = getByTestId;
          queryByTestIdFunction = queryByTestId;
        });

        const filterPaneTestId = 'pane-authorities-filters';
        const showFilterPaneButton = getByRoleFunction('button', { name: 'stripes-smart-components.showSearchPane' });

        expect(queryByTestIdFunction(filterPaneTestId)).toBeNull();

        fireEvent.click(showFilterPaneButton);

        await waitFor(() => {
          expect(getByTestIdFunction(filterPaneTestId)).toBeDefined();
        });
      });
    });
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

      expect(getByRole('checkbox', { name: 'ui-marc-authorities.search-results-list.authRefType' })).toBeDefined();
      expect(getByRole('checkbox', { name: 'ui-marc-authorities.search-results-list.headingType' })).toBeDefined();
    });

    it('should be checked by the default', () => {
      const { getByRole } = renderAuthoritiesSearch();

      fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

      expect(getByRole('checkbox', { name: 'ui-marc-authorities.search-results-list.authRefType' })).toBeChecked();
      expect(getByRole('checkbox', { name: 'ui-marc-authorities.search-results-list.headingType' })).toBeChecked();
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
            useAuthorityExport: ({ onSuccess }) => ({ exportRecords: (data) => onSuccess(data) }),
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
        fireEvent.click(getByRole('checkbox', { name: 'ui-marc-authorities.search-results-list.headingType' }));

        expect(getByTestId('SearchResultsList')).toHaveAttribute('visibleColumns', JSON.stringify([
          searchResultListColumns.SELECT,
          searchResultListColumns.AUTH_REF_TYPE,
          searchResultListColumns.HEADING_REF,
        ]));
      });
    });
  });
});
