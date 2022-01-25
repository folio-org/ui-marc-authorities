import {
  act,
  waitFor,
  render,
  fireEvent,
} from '@testing-library/react';
import routeData, { MemoryRouter } from 'react-router';
import mockMapValues from 'lodash/mapValues';

import AuthoritiesSearch from './AuthoritiesSearch';

import '../../../test/jest/__mock__';
import Harness from '../../../test/jest/helpers/harness';
import {
  rawDefaultSearchableIndexes,
  rawBrowseSearchableIndexes,
  searchResultListColumns,
  sortOrders,
} from '../../constants';
import { useSortColumnManager } from '../../hooks';

const mockHistoryReplace = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
  useLocation: jest.fn().mockImplementation(() => ({
    pathname: '',
  })),
}));

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useSortColumnManager: jest.fn(),
}));

jest.mock('../../queries/useAuthorities', () => ({
  useAuthorities: () => ({ authorities: [] }),
}));

jest.mock('../../components', () => ({
  ...jest.requireActual('../../components'),
  SearchResultsList: (props) => {
    const mapedProps = mockMapValues(props, (prop) => ((typeof prop === 'object') ? JSON.stringify(prop) : prop));

    return (<div data-testid="SearchResultsList" {...mapedProps} />);
  },
  SearchFilters: () => <div>SearchFilters</div>,
}));

const renderAuthoritiesSearch = (props = {}) => render(
  <Harness Router={MemoryRouter}>
    <AuthoritiesSearch {...props} />
  </Harness>,
);

describe('Given AuthoritiesSearch', () => {
  const useLocation = jest.spyOn(routeData, 'useLocation');

  beforeEach(() => {
    useSortColumnManager.mockImplementation(jest.requireActual('../../hooks').useSortColumnManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render paneset', () => {
    const { getByTestId } = renderAuthoritiesSearch();

    expect(getByTestId('marc-authorities-paneset')).toBeDefined();
  });

  it('should display `Search & filter` label', () => {
    const { getByText } = renderAuthoritiesSearch();

    expect(getByText('ui-marc-authorities.search.searchAndFilter')).toBeDefined();
  });

  it('should display Search and Browse navigation toggle', () => {
    const { getByTestId } = renderAuthoritiesSearch();

    expect(getByTestId('segment-navigation-search')).toBeDefined();
    expect(getByTestId('segment-navigation-browse')).toBeDefined();
  });

  it('should display dropdown with default searchable indexes', () => {
    const { getByText } = renderAuthoritiesSearch();

    rawDefaultSearchableIndexes.forEach(({ label }) => {
      expect(getByText(label)).toBeDefined();
    });
  });

  it('should display textarea', () => {
    const { getByTestId } = renderAuthoritiesSearch();

    expect(getByTestId('search-textarea')).toBeDefined();
  });

  it('should display "Search" button', () => {
    const { getByTestId } = renderAuthoritiesSearch();

    expect(getByTestId('submit-authorities-search')).toBeDefined();
  });

  it('should display "Reset all" button', () => {
    const { getByRole } = renderAuthoritiesSearch();

    expect(getByRole('button', { name: 'stripes-smart-components.resetAll' })).toBeDefined();
  });

  it('should display "Actions" button', () => {
    const { getByRole } = renderAuthoritiesSearch();

    expect(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' })).toBeDefined();
  });

  it('should be default sort order', () => {
    const { getByTestId } = renderAuthoritiesSearch();

    expect(getByTestId('SearchResultsList')).toHaveAttribute('sortOrder', '');
  });

  it('should not be sorted by any column', () => {
    const { getByTestId } = renderAuthoritiesSearch();

    expect(getByTestId('SearchResultsList')).toHaveAttribute('sortedColumn', '');
  });

  it('should render AdvancedSearch button', () => {
    const { getByText } = renderAuthoritiesSearch();

    expect(getByText('stripes-components.advancedSearch.button')).toBeDefined();
  });

  describe('when using Advanced Search', () => {
    it('should show Advanced Search modal', () => {
      const { getByText } = renderAuthoritiesSearch();

      fireEvent.click(getByText('stripes-components.advancedSearch.button'));

      expect(getByText('stripes-components.advancedSearch.title')).toBeDefined();
    });

    describe('when making changes to rows and searching', () => {
      it('should update search textarea', () => {
        const {
          getByText,
          getAllByTestId,
          getByTestId,
        } = renderAuthoritiesSearch();

        fireEvent.click(getByText('stripes-components.advancedSearch.button'));

        const queryInputs = getAllByTestId('advanced-search-query');

        fireEvent.change(queryInputs[0], { target: { value: 'Music' } });
        fireEvent.change(queryInputs[1], { target: { value: 'Painting' } });
        fireEvent.blur(queryInputs[1]);

        fireEvent.click(getByText('stripes-components.advancedSearch.footer.search'));

        expect(getByTestId('search-textarea').value).toBe('keyword==Music and keyword==Painting');
      });
    });

    describe('when component was loaded with initial search', () => {
      it('should apply all url parameters', () => {
        jest.spyOn(routeData, 'useLocation').mockReturnValue({
          pathname: 'pathname',
          search: '?qindex=personalName&query=Music',
        });

        const {
          getByText,
          getAllByTestId,
        } = renderAuthoritiesSearch();

        fireEvent.click(getByText('stripes-components.advancedSearch.button'));

        const queryInputs = getAllByTestId('advanced-search-query');
        const searchOptionSelects = getAllByTestId('advanced-search-option');

        expect(queryInputs[0].value).toBe('Music');
        expect(searchOptionSelects[0].value).toBe('personalName');
      });
    });
  });

  describe('when toggle navigation segment to Browse', () => {
    it('should focus back on the search input', () => {
      const { getByTestId } = renderAuthoritiesSearch();

      fireEvent.click(getByTestId('segment-navigation-browse'));

      expect(getByTestId('search-textarea')).toHaveFocus();
    });

    it('should display dropdown with searchable indexes for browse segment', () => {
      const { getByTestId, getByText } = renderAuthoritiesSearch();

      fireEvent.click(getByTestId('segment-navigation-browse'));

      expect(getByText('None')).toBeDefined();

      rawBrowseSearchableIndexes.forEach(({ label }) => {
        expect(getByText(label)).toBeDefined();
      });
    });
  });

  describe('when toggle navigation segment to Search', () => {
    it('should focus back on the search input', () => {
      const { getByTestId } = renderAuthoritiesSearch();

      fireEvent.click(getByTestId('segment-navigation-browse'));
      fireEvent.click(getByTestId('segment-navigation-search'));

      expect(getByTestId('search-textarea')).toHaveFocus();
    });
  });

  describe('when textarea is not empty and Reset all button is clicked', () => {
    it('should clear textarea', () => {
      const {
        getByRole,
        getByTestId,
      } = renderAuthoritiesSearch();

      const textarea = getByTestId('search-textarea');
      const searchButton = getByTestId('submit-authorities-search');
      const resetAllButton = getByRole('button', { name: 'stripes-smart-components.resetAll' });

      fireEvent.change(textarea, { target: { value: 'test search' } });

      expect(textarea.value).toBe('test search');

      fireEvent.click(searchButton);
      fireEvent.click(resetAllButton);

      expect(textarea.value).toBe('');
    });

    it('should handle history replace', () => {
      const {
        getByRole,
        getByTestId,
      } = renderAuthoritiesSearch();

      const textarea = getByTestId('search-textarea');
      const resetAllButton = getByRole('button', { name: 'stripes-smart-components.resetAll' });

      fireEvent.change(textarea, { target: { value: 'test search' } });

      expect(textarea.value).toBe('test search');

      fireEvent.click(resetAllButton);

      expect(mockHistoryReplace).toHaveBeenCalled();
    });
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

  describe('when click on "Actions" button', () => {
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

    describe('when change sorted column throught selection to "Type of heading"', () => {
      it('should sort by "Type of Heading" column in descending order', () => {
        const {
          getByRole,
          getByTestId,
        } = renderAuthoritiesSearch();

        fireEvent.click(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' }));

        fireEvent.change(getByTestId('sort-by-selection'), { target: { value: 'headingType' } });

        expect(getByTestId('SearchResultsList')).toHaveAttribute('sortedColumn', searchResultListColumns.HEADING_TYPE);
        expect(getByTestId('SearchResultsList')).toHaveAttribute('sortOrder', sortOrders.ASC);
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

          expect(getByTestId('SearchResultsList')).toHaveAttribute('sortedColumn', '');
          expect(getByTestId('SearchResultsList')).toHaveAttribute('sortOrder', '');
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
          searchResultListColumns.AUTH_REF_TYPE,
          searchResultListColumns.HEADING_REF,
        ]));
      });
    });
  });

  describe('when component was loaded with initial search', () => {
    it('should apply all url parameters', () => {
      jest.spyOn(routeData, 'useLocation').mockReturnValue({
        pathname: 'pathname',
        search: '?qindex=keyword&query=Music',
      });

      const {
        getByTestId,
      } = renderAuthoritiesSearch();

      expect(getByTestId('search-textarea').value).toBe('Music');
      expect(getByTestId('search-select').value).toBe('keyword');
    });
  });

  describe('when location has changed', () => {
    const mockOnChangeSortOption = jest.fn();

    beforeEach(() => {
      useSortColumnManager.mockImplementation(() => ({
        sortOrder: '',
        sortedColumn: '',
        onChangeSortOption: mockOnChangeSortOption,
        onHeaderClick: jest.fn(),
      }));
    });

    describe('and sort parameter is "authRefType"', () => {
      beforeEach(() => {
        useLocation.mockReturnValue({
          search: `sort=${searchResultListColumns.AUTH_REF_TYPE}`,
        });
      });

      it('should handle "onChangeSortOption" with "authRefType" and "ascending" parameters', () => {
        renderAuthoritiesSearch();

        expect(mockOnChangeSortOption)
          .toHaveBeenCalledWith(searchResultListColumns.AUTH_REF_TYPE, sortOrders.ASC);
      });
    });

    describe('and sort parameter is "-authRefType"', () => {
      beforeEach(() => {
        useLocation.mockReturnValue({
          search: `sort=-${searchResultListColumns.AUTH_REF_TYPE}`,
        });
      });

      it('should handle "onChangeSortOption" with "authRefType" and "descending" parameters', () => {
        renderAuthoritiesSearch();

        expect(mockOnChangeSortOption)
          .toHaveBeenCalledWith(searchResultListColumns.AUTH_REF_TYPE, sortOrders.DES);
      });
    });
  });
});
