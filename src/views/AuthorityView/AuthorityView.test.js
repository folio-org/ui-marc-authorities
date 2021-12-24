import {
  fireEvent,
  render,
} from '@testing-library/react';

import Harness from '../../../test/jest/helpers/harness';
import AuthorityView from './AuthorityView';

const mockHistoryPush = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const marcSource = {
  data: {
    metadata: {
      lastUpdatedDate: '2020-12-04T09:05:30.000+0000',
    },
  },
  isLoading: false,
};

const authority = {
  data: {},
  isLoading: false,
};

const renderAuthorityView = (props = {}) => render(
  <Harness>
    <AuthorityView
      marcSource={marcSource}
      authority={authority}
      {...props}
    />
  </Harness>,
);

describe('Given AuthorityView', () => {
  describe('when data is not loaded', () => {
    it('should show loading view', () => {
      const { getByText } = renderAuthorityView({
        marcSource: {
          data: {},
          isLoading: true,
        },
        authority: {
          data: {},
          isLoading: true,
        },
      });

      expect(getByText('Loading view')).toBeDefined();
    });
  });

  it('should render MARC view', () => {
    const { getByText } = renderAuthorityView();

    expect(getByText('QuickMarcView')).toBeDefined();
  });

  it('should display "Edit" button', () => {
    const { getByText } = renderAuthorityView();

    expect(getByText('ui-marc-authorities.authority-record.edit')).toBeDefined();
  });

  describe('when click on "Edit" button', () => {
    it('should redirect to EditQuickMarcRecord page', () => {
      const { getByText } = renderAuthorityView();

      fireEvent.click(getByText('ui-marc-authorities.authority-record.edit'));

      expect(mockHistoryPush).toHaveBeenCalled();
    });
  });
});
