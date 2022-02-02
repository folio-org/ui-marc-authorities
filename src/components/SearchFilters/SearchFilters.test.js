import {
  fireEvent,
  render,
} from '@testing-library/react';

import { runAxeTest } from '@folio/stripes-testing';

import SearchFilters from './SearchFilters';
import Harness from '../../../test/jest/helpers/harness';
import { navigationSegments } from '../../constants';

jest.mock('../MultiSelectionFacet', () => ({
  MultiSelectionFacet: ({ name, onClearFilter }) => (
    <div>
      {name}
      <button type="button" onClick={() => onClearFilter(name)}>Clear {name}</button>
    </div>
  ),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  AcqDateRangeFilter: ({ name }) => <div>{name}</div>,
}));

const mockSetFilters = jest.fn().mockImplementation((cb) => {
  return cb({
    filterA: 'val-a',
    headingType: 'val-b',
  });
});

const mockApplyExcludeSeeFromLimiter = jest.fn();
const mockSetIsExcludedSeeFromLimiter = jest.fn();

const renderSearchFilters = (props = {}) => render(
  <Harness>
    <SearchFilters
      activeFilters={{}}
      isSearching={false}
      query=""
      setFilters={mockSetFilters}
      segment={navigationSegments.search}
      applyExcludeSeeFromLimiter={mockApplyExcludeSeeFromLimiter}
      isExcludedSeeFromLimiter={false}
      setIsExcludedSeeFromLimiter={mockSetIsExcludedSeeFromLimiter}
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
      const { getByText } = renderSearchFilters();

      fireEvent.click(getByText('Clear headingType'));

      expect(mockSetFilters).toHaveReturnedWith({
        filterA: 'val-a',
      });
    });
  });

  describe('when navigation segment is Browse', () => {
    it('should display "References" accordion and "Exclude see from" checkbox', () => {
      const { getByRole } = renderSearchFilters({
        segment: navigationSegments.browse,
      });

      expect(getByRole('heading', { name: 'ui-marc-authorities.search.references' })).toBeDefined();
      expect(getByRole('checkbox', { name: 'ui-marc-authorities.search.excludeSeeFrom' })).toBeDefined();
    });

    it('should not display other filters except for "References" accordion', () => {
      const { queryByText } = renderSearchFilters({
        segment: navigationSegments.browse,
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
