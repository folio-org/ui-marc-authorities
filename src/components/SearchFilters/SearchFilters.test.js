import {
  fireEvent,
  render,
} from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import SearchFilters from './SearchFilters';
import Harness from '../../../test/jest/helpers/harness';
import { navigationSegments } from '../../constants';

jest.mock('../../queries', () => ({
  ...jest.requireActual('../../queries'),
  useFacets: jest.fn().mockReturnValue({
    isLoading: false,
    facets: {
      subjectHeadings: {
        values: [{
          id: 'a',
          totalRecords: 10,
        }],
      },
    },
  }),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AcqDateRangeFilter: ({ name }) => <div>{name}</div>,
}));

jest.mock('../MultiSelectionFacet', () => ({
  MultiSelectionFacet: ({ name, onClearFilter }) => (
    <div>
      {name}
      <button type="button" onClick={() => onClearFilter(name)}>Clear {name}</button>
    </div>
  ),
}));

const mockSetFilters = jest.fn();

const defaultCtxValue = {
  setFilters: mockSetFilters,
  filters: {
    headingType: ['val-a', 'val-b'],
    subjectHeadings: ['Other'],
  },
  navigationSegmentValue: navigationSegments.search,
};

const renderSearchFilters = (props = {}, ctxValue = defaultCtxValue) => render(
  <Harness authoritiesCtxValue={ctxValue}>
    <SearchFilters
      isSearching={false}
      cqlQquery=""
      {...props}
    />
  </Harness>,
);

describe('Given SearchFilters', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render Type of heading filter', () => {
    const { getByText } = renderSearchFilters();

    expect(getByText('headingType')).toBeDefined();
  });

  it('should render Subject heading/thesaurus filter', () => {
    const { getByText } = renderSearchFilters();

    expect(getByText('subjectHeadings')).toBeDefined();
  });

  it('should display "References" accordion and "Exclude see from" checkbox', () => {
    const { getByRole } = renderSearchFilters();

    expect(getByRole('heading', { name: 'ui-marc-authorities.search.references' })).toBeDefined();
    expect(getByRole('checkbox', { name: 'ui-marc-authorities.search.excludeSeeFrom' })).toBeDefined();
  });

  it('should render created date filter', () => {
    const { getByText } = renderSearchFilters();

    expect(getByText('createdDate')).toBeDefined();
  });

  it('should render updated date filter', () => {
    const { getByText } = renderSearchFilters();

    expect(getByText('updatedDate')).toBeDefined();
  });

  describe('when clearing a filter', () => {
    it('should call setFilters with correct filters', () => {
      mockSetFilters.mockImplementation(setter => setter(defaultCtxValue.filters));

      const { getByText } = renderSearchFilters();

      fireEvent.click(getByText('Clear headingType'));

      expect(mockSetFilters.mock.results[0].value).toMatchObject({});
    });
  });

  describe('when navigation segment is Browse', () => {
    it('should display "References" accordion and "Exclude see from" checkbox', () => {
      const { getByRole } = renderSearchFilters(null, {
        ...defaultCtxValue,
        navigationSegmentValue: navigationSegments.browse,
      });

      expect(getByRole('heading', { name: 'ui-marc-authorities.search.references' })).toBeDefined();
      expect(getByRole('checkbox', { name: 'ui-marc-authorities.search.excludeSeeFrom' })).toBeDefined();
    });

    it('should not display other filters except for "References" accordion', () => {
      const { queryByText } = renderSearchFilters(null, {
        ...defaultCtxValue,
        navigationSegmentValue: navigationSegments.browse,
      });

      expect(queryByText('headingType')).toBeNull();
      expect(queryByText('createdDate')).toBeNull();
      expect(queryByText('updatedDate')).toBeNull();
    });
  });

  describe('when expanding all filters', () => {
    it('should render with no axe errors', async () => {
      const {
        container,
        getByText,
      } = renderSearchFilters();

      fireEvent.click(getByText('ui-marc-authorities.search.references'));
      fireEvent.click(getByText('headingType'));
      fireEvent.click(getByText('createdDate'));
      fireEvent.click(getByText('updatedDate'));

      await runAxeTest({
        rootNode: container,
      });
    });
  });
});
