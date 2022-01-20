import {
  render,
  fireEvent,
} from '@testing-library/react';

import FilterNavigation from './FilterNavigation';
import Harness from '../../../test/jest/helpers/harness';
import { navigationSegments } from '../../constants';

const onChange = jest.fn();

const renderFilterNavigation = (props = {}) => render(
  <Harness>
    <FilterNavigation
      segment={navigationSegments.search}
      onChange={onChange}
      {...props}
    />
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

      expect(onChange).toHaveBeenCalled();
    });
  });
});
