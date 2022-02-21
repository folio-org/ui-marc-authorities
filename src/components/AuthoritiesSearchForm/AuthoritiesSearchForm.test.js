import {
  render,
  fireEvent,
} from '@testing-library/react';
import routeData from 'react-router';

import { runAxeTest } from '@folio/stripes-testing';

import AuthoritiesSearchForm from './AuthoritiesSearchForm';
import { rawBrowseSearchableIndexes, rawDefaultSearchableIndexes } from '../../constants';

import Harness from '../../../test/jest/helpers/harness';

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

const mockOnChangeSortOption = jest.fn();
const mockOnSubmitSearch = jest.fn();
const mockSetSelectedAuthorityRecordContext = jest.fn();

const renderAuthoritiesSearchForm = (props = {}) => render(
  <Harness selectedRecordCtxValue={[null, mockSetSelectedAuthorityRecordContext]}>
    <AuthoritiesSearchForm
      onChangeSortOption={mockOnChangeSortOption}
      onSubmitSearch={mockOnSubmitSearch}
      isAuthoritiesLoading={false}
      {...props}
    />
  </Harness>,
);

describe('Given AuthoritiesSearchForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with no axe errors', async () => {
    const { container } = renderAuthoritiesSearchForm();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should render AdvancedSearch button', () => {
    const { getByText } = renderAuthoritiesSearchForm();

    expect(getByText('stripes-components.advancedSearch.button')).toBeDefined();
  });

  describe('when using Advanced Search', () => {
    it('should show Advanced Search modal', () => {
      const { getByText } = renderAuthoritiesSearchForm();

      fireEvent.click(getByText('stripes-components.advancedSearch.button'));

      expect(getByText('stripes-components.advancedSearch.title')).toBeDefined();
    });

    describe('when making changes to rows and searching', () => {
      it('should update search textarea', () => {
        const {
          getByText,
          getAllByTestId,
          getByTestId,
        } = renderAuthoritiesSearchForm();

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
        } = renderAuthoritiesSearchForm();

        fireEvent.click(getByText('stripes-components.advancedSearch.button'));

        const queryInputs = getAllByTestId('advanced-search-query');
        const searchOptionSelects = getAllByTestId('advanced-search-option');

        expect(queryInputs[0].value).toBe('Music');
        expect(searchOptionSelects[0].value).toBe('personalName');
      });
    });
  });

  it('should display dropdown with default searchable indexes', () => {
    const { getByText } = renderAuthoritiesSearchForm();

    rawDefaultSearchableIndexes.forEach(({ label }) => {
      expect(getByText(label)).toBeDefined();
    });
  });

  it('should display textarea', () => {
    const { getByTestId } = renderAuthoritiesSearchForm();

    expect(getByTestId('search-textarea')).toBeDefined();
  });

  it('should display "Search" button', () => {
    const { getByTestId } = renderAuthoritiesSearchForm();

    expect(getByTestId('submit-authorities-search')).toBeDefined();
  });

  it('should display "Reset all" button', () => {
    const { getByRole } = renderAuthoritiesSearchForm();

    expect(getByRole('button', { name: 'stripes-smart-components.resetAll' })).toBeDefined();
  });

  describe('when toggle navigation segment to Browse', () => {
    it('should focus back on the search input', () => {
      const { getByTestId } = renderAuthoritiesSearchForm();

      fireEvent.click(getByTestId('segment-navigation-browse'));

      expect(getByTestId('search-textarea')).toHaveFocus();
    });

    it('should display dropdown with searchable indexes for browse segment', () => {
      jest.spyOn(routeData, 'useLocation').mockReturnValue({
        pathname: 'pathname',
        search: '?segment=browse',
      });

      const { getByText } = renderAuthoritiesSearchForm();

      rawBrowseSearchableIndexes.forEach(({ label }) => {
        expect(getByText(label)).toBeDefined();
      });
    });
  });

  describe('when toggle navigation segment to Search', () => {
    it('should focus back on the search input', () => {
      const { getByTestId } = renderAuthoritiesSearchForm();

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
      } = renderAuthoritiesSearchForm();

      const textarea = getByTestId('search-textarea');
      const searchButton = getByTestId('submit-authorities-search');
      const resetAllButton = getByRole('button', { name: 'stripes-smart-components.resetAll' });

      fireEvent.change(textarea, { target: { value: 'test search' } });

      expect(textarea.value).toBe('test search');

      fireEvent.click(searchButton);
      fireEvent.click(resetAllButton);

      expect(textarea.value).toBe('');
    });

    it('should handle setSelectedAuthorityRecordContext', () => {
      const {
        getByRole,
        getByTestId,
      } = renderAuthoritiesSearchForm();

      const textarea = getByTestId('search-textarea');
      const resetAllButton = getByRole('button', { name: 'stripes-smart-components.resetAll' });

      fireEvent.change(textarea, { target: { value: 'test search' } });

      expect(textarea.value).toBe('test search');

      fireEvent.click(resetAllButton);

      expect(mockSetSelectedAuthorityRecordContext).toHaveBeenCalledWith(null);
    });
  });
});
