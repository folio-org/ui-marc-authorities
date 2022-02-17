import noop from 'lodash/noop';
import {
  fireEvent,
  render,
} from '@testing-library/react';

import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes-components';
import { runAxeTest } from '@folio/stripes-testing';

import Harness from '../../../test/jest/helpers/harness';
import AuthorityView from './AuthorityView';
import { SelectedAuthorityRecordContext } from '../../context';
import { openEditShortcut } from '../../../test/utilities';

const mockHistoryPush = jest.fn();
const mockSetSelectedAuthorityRecordContext = jest.fn();

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
  data: {
    id: 'authority-id',
    headingRef: 'heading-ref',
    headingType: 'heading-type',
  },
  isLoading: false,
};

const renderAuthorityView = (props = {}) => render(
  <SelectedAuthorityRecordContext.Provider value={[null, mockSetSelectedAuthorityRecordContext]}>
    <Harness>
      <CommandList commands={defaultKeyboardShortcuts}>
        <AuthorityView
          marcSource={marcSource}
          authority={authority}
          stripes={noop}
          {...props}
        />
      </CommandList>
    </Harness>
  </SelectedAuthorityRecordContext.Provider>,
);

describe('Given AuthorityView', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it('should render with no axe errors', async () => {
    const { container } = renderAuthorityView();

    await runAxeTest({
      rootNode: container,
    });
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
    const canEditMock = jest.fn();

    it('should not call onEdit function', () => {
      const {
        queryByTestId,
        getByTestId,
      } = renderAuthorityView({
        onEdit: onEditMock,
        canEdit: canEditMock,
      });

      const testDiv = getByTestId('authority-marc-view');

      openEditShortcut(testDiv);

      expect(mockHistoryPush).toHaveBeenCalled();
      expect(queryByTestId('authority-marc-view')).not.toBeNull();
    });
  });

  describe('when click on Close button', () => {
    it('should handle setSelectedAuthorityRecordContext', () => {
      const { getByText } = renderAuthorityView();

      fireEvent.click(getByText('Close QuickMarcView'));

      expect(mockSetSelectedAuthorityRecordContext).toHaveBeenCalledWith(null);
    });

    it('should redirect to /marc-authorities', () => {
      const { getByText } = renderAuthorityView();

      fireEvent.click(getByText('Close QuickMarcView'));

      expect(mockHistoryPush).toHaveBeenCalled();
    });
  });
});
