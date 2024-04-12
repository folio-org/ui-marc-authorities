import {
  fireEvent,
  render,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes/components';
import { runAxeTest } from '@folio/stripes-testing';
import { useUserTenantPermissions } from '@folio/stripes/core';

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

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingPane: () => (<div>Loading pane</div>),
  ConfirmationModal: jest.fn(({ open, message, onCancel, onConfirm }) => (open
    ? (
      <div>
        <span>Confirmation modal</span>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" id="confirmButton" onClick={onConfirm}>
          Delete
        </button>
        <span>{message}</span>
      </div>
    )
    : null)),
}));

const marcSource = {
  data: {
    parsedRecord: {
      content: {
        fields: [{
          100: {
            subfields: [{
              a: 'heading-ref',
            }],
            ind1: '',
            ind2: '',
          },
        }, {
          110: {
            subfields: [{
              a: 'value contains heading-ref string',
            }],
            ind1: '',
            ind2: '',
          },
        }, {
          400: {
            subfields: [{
              a: 'heading-ref',
            }],
            ind1: '',
            ind2: '',
          },
        }, {
          410: {
            subfields: [{
              a: 'heading-ref',
            }],
            ind1: '',
            ind2: '',
          },
        }, {
          500: {
            subfields: [{
              a: 'heading-ref',
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
  allData: [],
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
  beforeEach(() => {
    useUserTenantPermissions.mockReturnValue({
      userPermissions: [],
      isFetching: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when data is not loaded', () => {
    it('should show loading pane', () => {
      const { getByText } = renderAuthorityView({
        marcSource: {
          allData: [],
          data: {},
          isLoading: true,
        },
        authority: {
          allData: [],
          data: {},
          isLoading: true,
        },
      });

      expect(getByText('Loading pane')).toBeDefined();
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

  it('should display "Print" button', () => {
    const { getByText } = renderAuthorityView();

    expect(getByText('ui-marc-authorities.authority-record.print')).toBeDefined();
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

      expect(highlightedContent).toEqual('heading-ref');
    });
  });

  describe('when authority record has authRefType Reference', () => {
    it('should highlight all 4xx marc fields', () => {
      const { container } = renderAuthorityView({
        authority: {
          ...authority,
          data: {
            ...authority.data,
            authRefType: 'Reference',
          },
          isLoading: false,
        },
      });

      const highlightedContent = [...container.querySelectorAll('mark')].map(mark => mark.textContent).join(' ');

      expect(highlightedContent).toEqual('heading-ref heading-ref');
    });
  });

  describe('when authority record has authRefType Auth/Ref', () => {
    it('should highlight 5xx marc field', () => {
      const { container } = renderAuthorityView({
        authority: {
          ...authority,
          data: {
            ...authority.data,
            authRefType: 'Auth/Ref',
          },
          isLoading: false,
        },
      });

      const highlightedContent = [...container.querySelectorAll('mark')].map(mark => mark.textContent).join(' ');

      expect(highlightedContent).toEqual('heading-ref');
    });
  });

  describe('when tag value contains only part of authority heading ref value', () => {
    it('should not highlight tag value', () => {
      const { container } = renderAuthorityView();

      const highlightedContent = [...container.querySelectorAll('mark')].map(mark => mark.textContent).join(' ');

      expect(highlightedContent).not.toEqual('value contains heading-ref string');
    });
  });

  describe('when tag value completely equals to authority heading ref value', () => {
    it('should highlight tag value', () => {
      const { container } = renderAuthorityView({
        authority: {
          ...authority,
          data: {
            ...authority.data,
            headingRef: 'value contains heading-ref string',
          },
          isLoading: false,
        },
      });

      const highlightedContent = [...container.querySelectorAll('mark')].map(mark => mark.textContent).join(' ');

      expect(highlightedContent).toEqual('value contains heading-ref string');
    });
  });

  describe('when click on "Edit" button', () => {
    it('should redirect to EditQuickMarcRecord page', () => {
      const { getByText } = renderAuthorityView();

      fireEvent.click(getByText('ui-marc-authorities.authority-record.edit'));

      expect(mockHistoryPush).toHaveBeenCalled();
    });
  });

  describe('when click on "Print" button', () => {
    it('should display the print popup', () => {
      const { getByText, getByTestId } = renderAuthorityView();

      fireEvent.click(getByText('ui-marc-authorities.authority-record.print'));

      expect(getByTestId('print-popup')).toBeInTheDocument();
    });
  });

  describe('when click on "Delete" button', () => {
    it('should display ConfirmationModal', () => {
      const { getByText } = renderAuthorityView();

      fireEvent.click(getByText('ui-marc-authorities.authority-record.delete'));

      expect(getByText('Confirmation modal')).toBeDefined();
    });

    describe('and the record is not linked to a bib record', () => {
      it('should display the correct message', () => {
        const { getByText } = renderAuthorityView({
          authority,
        });

        fireEvent.click(getByText('ui-marc-authorities.authority-record.delete'));

        expect(getByText('ui-marc-authorities.delete.description')).toBeVisible();
      });
    });

    describe('and the record is linked to a bib record', () => {
      it('should display the correct message', () => {
        const { getByText } = renderAuthorityView({
          authority: {
            ...authority,
            allData: [{
              ...authority.data,
              numberOfTitles: 1,
            }],
          },
        });

        fireEvent.click(getByText('ui-marc-authorities.authority-record.delete'));

        expect(getByText('ui-marc-authorities.delete.linkedRecord.description')).toBeVisible();
      });
    });
  });

  describe('when confirmationModal is opened', () => {
    describe('when click Delete', () => {
      it('should hide ConfirmationModal', async () => {
        const { getByText, queryByText } = renderAuthorityView();

        fireEvent.click(
          getByText('ui-marc-authorities.authority-record.delete'),
        );
        fireEvent.click(getByText('Delete'));
        expect(queryByText('Confirmation modal')).toBeNull();
      });
    });

    describe('when click Cancel', () => {
      it('should hide ConfirmationModal', async () => {
        const { getByText, queryByText } = renderAuthorityView();

        fireEvent.click(
          getByText('ui-marc-authorities.authority-record.delete'),
        );
        fireEvent.click(getByText('Cancel'));
        expect(queryByText('Confirmation modal')).toBeNull();
      });
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

      const testDiv = getByTestId('marc-view-pane');

      openEditShortcut(testDiv);

      expect(mockHistoryPush).toHaveBeenCalled();
      expect(queryByTestId('marc-view-pane')).not.toBeNull();
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

  describe('when authority data is empty', () => {
    it('should not render the page', () => {
      const { queryByTestId } = renderAuthorityView({
        authority: {
          ...authority,
          data: null,
        },
      });

      expect(queryByTestId('marc-view-pane')).toBeNull();
    });
  });
});
