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
  searchableIndexesValues,
  searchResultListColumns,
} from '../../constants';

const mockHistoryReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
  useLocation: () => ({
    pathname: '',
  }),
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
  it('should render paneset', () => {
    const { getByTestId } = renderAuthoritiesSearch();

    expect(getByTestId('marc-authorities-paneset')).toBeDefined();
  });

  it('should display `Search & filter` label', () => {
    const { getByText } = renderAuthoritiesSearch();

    expect(getByText('ui-marc-authorities.search.searchAndFilter')).toBeDefined();
  });

  it('should display dropdown with searchable indexes', () => {
    const { getByText } = renderAuthoritiesSearch();

    Object.values(searchableIndexesValues).forEach(indexValue => {
      expect(getByText(`ui-marc-authorities.${indexValue}`)).toBeDefined();
    });
  });

  it('should display textarea', () => {
    const { getByTestId } = renderAuthoritiesSearch();

    expect(getByTestId('search-textarea')).toBeDefined();
  });

  it('should display "Search" button', () => {
    const { getByRole } = renderAuthoritiesSearch();

    expect(getByRole('button', { name: 'ui-marc-authorities.label.search' })).toBeDefined();
  });

  it('should display "Reset all" button', () => {
    const { getByRole } = renderAuthoritiesSearch();

    expect(getByRole('button', { name: 'stripes-smart-components.resetAll' })).toBeDefined();
  });

  it('should display "Actions" button', () => {
    const { getByRole } = renderAuthoritiesSearch();

    expect(getByRole('button', { name: 'stripes-components.paneMenuActionsToggleLabel' })).toBeDefined();
  });

  describe('when textarea is not empty and Reset all button is clicked', () => {
    it('should clear textarea', () => {
      const {
        getByRole,
        getByTestId,
      } = renderAuthoritiesSearch();

      const textarea = getByTestId('search-textarea');
      const resetAllButton = getByRole('button', { name: 'stripes-smart-components.resetAll' });

      fireEvent.change(textarea, { target: { value: 'test search' } });

      expect(textarea.value).toBe('test search');

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
          search: '?qindex=test',
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
          search: '?query=test',
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
});
