import noop from 'lodash/noop';
import {
  fireEvent,
  render,
} from '@testing-library/react';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';

import Harness from '../../../test/jest/helpers/harness';
import AuthorityView from './AuthorityView';
import { openEditShortcut } from '../../../test/utilities';

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
    <CommandList commands={defaultKeyboardShortcuts}>
      <AuthorityView
        marcSource={marcSource}
        authority={authority}
        stripes={noop}
        {...props}
      />
    </CommandList>
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

  describe('when user clicked edit shortcuts', () => {
    const onEditMock = jest.fn();
    const hasEditPermissionMock = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should not call onEdit function', () => {
      const {
        queryByTestId,
        getByTestId,
      } = renderAuthorityView({
        onEdit: onEditMock,
        isPermission:  hasEditPermissionMock,
      });

      const testDiv = getByTestId('ui-marc-authorities.authority-record.edit');

      openEditShortcut(testDiv);

      expect(mockHistoryPush).toHaveBeenCalled();
      expect(queryByTestId('ui-marc-authorities.authority-record.edit')).not.toBeNull();
    });
  });
});
