import { Form } from 'react-final-form';
import {
  render,
  fireEvent,
} from '@testing-library/react';

import { Datepicker } from '@folio/stripes/components';
import { runAxeTest } from '@folio/stripes-testing';

import Harness from '../../../test/jest/helpers/harness';

import { DateRangeFieldset } from './DateRangeFieldset';

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
}));

const renderDateRangeFieldset = (props = {}) => render(
  <Harness>
    <Form
      onSubmit={() => {}}
      render={() => (
        <DateRangeFieldset
          startValueGetter={() => '2018-07-10'}
          endValueGetter={() => '2018-07-25'}
          {...props}
        >
          {({
            endDateExclude,
            startDateExclude,
          }) => (
            <>
              <Datepicker
                data-testid="StartDateInput"
                name="startDate"
                exclude={startDateExclude}
                dateFormat="YYYY-MM-DD"
                value="2018-07-10"
              />
              <Datepicker
                data-testid="EndDateInput"
                name="endDate"
                exclude={endDateExclude}
                dateFormat="YYYY-MM-DD"
                value="2018-07-25"
              />
            </>
          )}
        </DateRangeFieldset>
      )}
    />
  </Harness>,
);

describe('DateRangeFieldset', () => {
  it('should have to a11y issues', async () => {
    const { container } = renderDateRangeFieldset();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should render children', () => {
    const { getByTestId } = renderDateRangeFieldset();

    expect(getByTestId('StartDateInput')).toBeDefined();
    expect(getByTestId('EndDateInput')).toBeDefined();
  });

  describe('excluded days for start datepicker', () => {
    it('should exclude days after the end date', () => {
      const { getAllByLabelText } = renderDateRangeFieldset();

      fireEvent.click(getAllByLabelText('stripes-components.showOrHideDatepicker')[0]);
      const excludedDates = getAllByLabelText('stripes-components.Datepicker.unavailable stripes-components.selectDay').map(el => el.textContent);

      expect(excludedDates).toEqual(['26', '27', '28', '29', '30', '31', '1', '2', '3', '4']);
    });
  });

  describe('excluded days for end datepicker', () => {
    it('should exclude days before the start date', () => {
      const { getAllByLabelText } = renderDateRangeFieldset();

      fireEvent.click(getAllByLabelText('stripes-components.showOrHideDatepicker')[1]);
      const excludedDates = getAllByLabelText('stripes-components.Datepicker.unavailable stripes-components.selectDay').map(el => el.textContent);

      expect(excludedDates).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    });
  });
});
