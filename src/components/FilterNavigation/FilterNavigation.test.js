import {
  render,
  fireEvent,
} from '@testing-library/react';

import FilterNavigation from './FilterNavigation';
import { navigationSegments } from '../../constants';
import Harness from '../../../test/jest/helpers/harness';

const mockSetNavigationSegmentValue = jest.fn();
const mockSetSearchDropdownValue = jest.fn();
const mockSetSearchIndex = jest.fn();

const authoritiesCtxValue = {
  setNavigationSegmentValue: mockSetNavigationSegmentValue,
  setSearchDropdownValue: mockSetSearchDropdownValue,
  setSearchIndex: mockSetSearchIndex,
};

const renderFilterNavigation = () => render(
  <Harness authoritiesCtxValue={authoritiesCtxValue}>
    <FilterNavigation />
  </Harness>,
);

describe('Given FilterNavigation', () => {
  it('should display Search and Browse navigation toggle', () => {
    const { getByTestId } = renderFilterNavigation();

    expect(getByTestId('segment-navigation-search')).toBeDefined();
    expect(getByTestId('segment-navigation-browse')).toBeDefined();
  });

  describe('when toggle navigation segment', () => {
    it('should handle onClick', () => {
      const { getByTestId } = renderFilterNavigation();

      fireEvent.click(getByTestId('segment-navigation-browse'));

      expect(mockSetNavigationSegmentValue).toHaveBeenCalledWith(navigationSegments.browse);
    });
  });
});
