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
    parsedRecord: {
      content: {
        fields: [{
          100: {
            subfields: [{
              a: '100',
            }, {
              b: 'heading-ref',
            }],
            ind1: '',
            ind2: '',
          },
        }, {
          400: {
            subfields: [{
              a: '400',
            }, {
              b: 'heading-ref',
            }],
            ind1: '',
            ind2: '',
          },
        }, {
          410: {
            subfields: [{
              a: '410',
            }, {
              b: 'heading-ref',
            }],
            ind1: '',
            ind2: '',
          },
        }, {
          500: {
            subfields: [{
              a: '500',
            }, {
              b: 'heading-ref',
            }],
            ind1: '',
            ind2: '',
          },
        }],
      },
    },
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
    authRefType: 'Authorized',
  },
  isLoading: false,
};

const renderAuthorityView = (props = {}) => render(
  <Harness selectedRecordCtxValue={[null, mockSetSelectedAuthorityRecordContext]}>
    <CommandList commands={defaultKeyboardShortcuts}>
      <AuthorityView
        marcSource={marcSource}
        authority={authority}
        {...props}
      />
    </CommandList>
  </Harness>,
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
    const { getByTestId } = renderAuthorityView();

    expect(getByTestId('marc-view-pane')).toBeDefined();
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

  describe('when authority record has authRefType Authorized', () => {
    it('should highlight 1xx marc field', () => {
      const { container } = renderAuthorityView();

      const highlightedContent = [...container.querySelectorAll('mark')].map(mark => mark.textContent).join(' ');

      expect(highlightedContent).toEqual('100 heading-ref');
    });
  });

  describe('when authority record has authRefType Reference', () => {
    it('should highlight all 4xx marc fields', () => {
      const { container } = renderAuthorityView({
        authority: {
          data: {
            ...authority.data,
            authRefType: 'Reference',
          },
          isLoading: false,
        },
      });

      const highlightedContent = [...container.querySelectorAll('mark')].map(mark => mark.textContent).join(' ');

      expect(highlightedContent).toEqual('400 heading-ref 410 heading-ref');
    });
  });

  describe('when authority record has authRefType Auth/Ref', () => {
    it('should highlight 5xx marc field', () => {
      const { container } = renderAuthorityView({
        authority: {
          data: {
            ...authority.data,
            authRefType: 'Auth/Ref',
          },
          isLoading: false,
        },
      });

      const highlightedContent = [...container.querySelectorAll('mark')].map(mark => mark.textContent).join(' ');

      expect(highlightedContent).toEqual('500 heading-ref');
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
      const { getByLabelText } = renderAuthorityView();

      fireEvent.click(getByLabelText('stripes-components.closeItem'));

      expect(mockSetSelectedAuthorityRecordContext).toHaveBeenCalledWith(null);
    });

    it('should redirect to /marc-authorities', () => {
      const { getByLabelText } = renderAuthorityView();

      fireEvent.click(getByLabelText('stripes-components.closeItem'));

      expect(mockHistoryPush).toHaveBeenCalled();
    });
  });
});
