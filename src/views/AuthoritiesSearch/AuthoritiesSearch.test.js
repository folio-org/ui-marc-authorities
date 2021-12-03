import {
  act,
  waitFor,
  render,
  fireEvent,
} from '@testing-library/react';

import Harness from '../../../test/jest/helpers/harness';
import AuthoritiesSearch from './AuthoritiesSearch';
import { searchableIndexesValues } from '../../constants';

jest.mock('../../hooks/useAuthorities', () => ({
  useAuthorities: () => ({ authorities: [] }),
}));

const history = {
  replace: jest.fn(),
};

const location = {
  pathname: 'pathname',
  search: '',
};

const renderAuthoritiesSearch = (props = {}) => render(
  <Harness>
    <AuthoritiesSearch
      history={history}
      location={location}
      {...props}
    />
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

    expect(getByTestId('textarea-authorities-search')).toBeDefined();
  });

  it('should display Search button', () => {
    const { getByRole } = renderAuthoritiesSearch();

    expect(getByRole('button', { name: 'ui-marc-authorities.label.search' })).toBeDefined();
  });

  it('should display Reset all button', () => {
    const { getByRole } = renderAuthoritiesSearch();

    expect(getByRole('button', { name: 'stripes-smart-components.resetAll' })).toBeDefined();
  });

  describe('when textarea is not empty and Reset all button is clicked', () => {
    it('should clear textarea', () => {
      const {
        getByRole,
        getByTestId,
      } = renderAuthoritiesSearch();

      const textarea = getByTestId('textarea-authorities-search');
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

      const textarea = getByTestId('textarea-authorities-search');
      const resetAllButton = getByRole('button', { name: 'stripes-smart-components.resetAll' });

      fireEvent.change(textarea, { target: { value: 'test search' } });

      expect(textarea.value).toBe('test search');

      fireEvent.click(resetAllButton);

      expect(history.replace).toHaveBeenCalled();
    });
  });

  describe('when click on toggle filter pane button', () => {
    describe('when filters were shown', () => {
      it('should hide filters', async () => {
        let getByRoleFunction;
        let getByTestIdFunction;
        let queryByTestIdFunction;

        await act(async () => {
          const {
            getByRole,
            getByTestId,
            queryByTestId,
          } = await renderAuthoritiesSearch({
            location: {
              ...location,
              search: '?qindex=test',
            },
          });

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
        let getByRoleFunction;
        let getByTestIdFunction;
        let queryByTestIdFunction;

        await act(async () => {
          const {
            getByRole,
            getByTestId,
            queryByTestId,
          } = await renderAuthoritiesSearch({
            location: {
              ...location,
              search: '?query=test',
            },
          });

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
});
