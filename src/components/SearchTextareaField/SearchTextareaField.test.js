import {
  render,
  fireEvent,
} from '@testing-library/react';

import SearchTextareaField from './SearchTextareaField';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  Select: () => <div>Select component</div>,
}));

const searchableIndexes = [{
  label: 'test-label-1',
  value: 'test-value-1',
}, {
  label: 'test-label-2',
  value: 'test-value-2',
}];

const onChange = jest.fn();
const onSubmitSearch = jest.fn();

const onKeyDown = () => onSubmitSearch();

const renderSearchTextareaField = (props = {}) => render(
  <SearchTextareaField
    id="test-search-textarea-field"
    onChange={onChange}
    onKeyDown={onKeyDown}
    searchableIndexes={searchableIndexes}
    {...props}
  />,
);

describe('Given SearchTextareaField', () => {
  it('should render Select component', () => {
    const { getByText } = renderSearchTextareaField();

    expect(getByText('Select component')).toBeDefined();
  });

  it('should render textarea', () => {
    const { getByTestId } = renderSearchTextareaField();

    expect(getByTestId('search-textarea')).toBeDefined();
  });

  describe('when typing inside textarea', () => {
    it('should handle onChange', () => {
      const { getByTestId } = renderSearchTextareaField();

      fireEvent.change(getByTestId('search-textarea'), { target: { value: 'test' } });

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('when user press "Enter" button', () => {
    it('should handle form submit', async () => {
      onKeyDown();

      expect(onSubmitSearch).toHaveBeenCalled();
    });
  });
});
