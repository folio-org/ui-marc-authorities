import {
  render,
  fireEvent,
} from '@testing-library/react';
import noop from 'lodash/noop';

import { runAxeTest } from '@folio/stripes-testing';
import { mockOffsetSize } from '@folio/stripes-acq-components/test/jest/helpers/mockOffsetSize';

import Harness from '../../../test/jest/helpers/harness';
import SearchResultsList from './SearchResultsList';
import authorities from '../../../mocks/authorities';
import { searchResultListColumns } from '../../constants';

const mockToggleFilterPane = jest.fn();
const mockSetSelectedAuthorityRecordContext = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: jest.fn(),
  }),
  useLocation: jest.fn().mockReturnValue({
    search: '',
    state: { editSuccessful: true },
  }),
  useRouteMatch: jest.fn().mockReturnValue({ path: '' }),
}));

const getSearchResultsList = (props = {}, selectedRecord = null) => (
  <Harness selectedRecordCtxValue={[selectedRecord, mockSetSelectedAuthorityRecordContext]}>
    <SearchResultsList
      authorities={authorities}
      visibleColumns={[
        searchResultListColumns.AUTH_REF_TYPE,
        searchResultListColumns.HEADING_REF,
        searchResultListColumns.HEADING_TYPE,
      ]}
      totalResults={authorities.length}
      loading={false}
      loaded={false}
      query=""
      hasFilters={false}
      pageSize={15}
      onNeedMoreData={noop}
      toggleFilterPane={mockToggleFilterPane}
      isFilterPaneVisible
      sortOrder=""
      sortedColumn=""
      onHeaderClick={jest.fn()}
      {...props}
    />
  </Harness>
);

const renderSearchResultsList = (...params) => render(getSearchResultsList(...params));

describe('Given SearchResultsList', () => {
  mockOffsetSize(500, 500);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render MCL component', async () => {
    const { getAllByText } = renderSearchResultsList();

    expect(getAllByText('Twain, Mark')).toHaveLength(15);
  });

  it('should render with no axe errors', async () => {
    const { container } = renderSearchResultsList();

    await runAxeTest({
      rootNode: container,
    });
  });

  it('should display 3 columns', () => {
    const { getByText } = renderSearchResultsList();

    expect(getByText('ui-marc-authorities.search-results-list.authRefType')).toBeDefined();
    expect(getByText('ui-marc-authorities.search-results-list.headingRef')).toBeDefined();
    expect(getByText('ui-marc-authorities.search-results-list.headingType')).toBeDefined();
  });

  it('should display empty message', () => {
    const { getByText } = renderSearchResultsList({
      authorities: [],
      totalResults: 0,
    });

    expect(getByText('stripes-smart-components.sas.noResults.noTerms')).toBeDefined();
  });

  describe('when click on a row', () => {
    it('should handle setSelectedAuthorityRecordContext', () => {
      const [firstRowRecord] = authorities;

      const { getAllByRole } = renderSearchResultsList();

      const [rowLink] = getAllByRole('link', { name: 'Twain, Mark' });

      fireEvent.click(rowLink);

      expect(mockSetSelectedAuthorityRecordContext).toHaveBeenCalledWith(firstRowRecord);
    });
  });

  describe('when search is pending', () => {
    it('should display pending message', () => {
      const { getByText } = renderSearchResultsList({
        authorities: [],
        totalResults: 0,
        loading: true,
      });

      expect(getByText('stripes-smart-components.sas.noResults.loading')).toBeDefined();
    });
  });

  describe('when search is finished and no results were returned', () => {
    it('should display pending message', () => {
      const { getByText } = renderSearchResultsList({
        authorities: [],
        totalResults: 0,
        query: 'test=abc',
        loaded: true,
      });

      expect(getByText('stripes-smart-components.sas.noResults.default')).toBeDefined();
    });
  });

  describe('when show columns checkbox for "Type of Heading" is not checked', () => {
    it('should display 2 columns', () => {
      const { queryByText } = renderSearchResultsList({
        visibleColumns: [
          searchResultListColumns.AUTH_REF_TYPE,
          searchResultListColumns.HEADING_REF,
        ],
      });

      expect(queryByText('ui-marc-authorities.search-results-list.authRefType')).toBeDefined();
      expect(queryByText('ui-marc-authorities.search-results-list.headingRef')).toBeDefined();
      expect(queryByText('ui-marc-authorities.search-results-list.headingType')).toBeNull();
    });
  });

  describe('when show columns checkbox for "Select" is checked', () => {
    it('should display 4 columns', () => {
      const { queryByText } = renderSearchResultsList({
        visibleColumns: [
          searchResultListColumns.SELECT,
          searchResultListColumns.AUTH_REF_TYPE,
          searchResultListColumns.HEADING_REF,
          searchResultListColumns.HEADING_TYPE,
        ],
        selectedRows: {},
      });

      expect(queryByText('ui-marc-authorities.search-results-list.select')).toBeDefined();
      expect(queryByText('ui-marc-authorities.search-results-list.authRefType')).toBeDefined();
      expect(queryByText('ui-marc-authorities.search-results-list.headingRef')).toBeDefined();
      expect(queryByText('ui-marc-authorities.search-results-list.headingType')).toBeDefined();
    });
  });

  describe('when record is an anchor', () => {
    it('should display an exclamation-circle icon', () => {
      const { container } = renderSearchResultsList({
        authorities: [{
          id: '43f76f93-cfc4-4b6a-a2d4-9b04c8ed7a46',
          headingType: 'Personal name',
          authRefType: 'Authorized',
          headingRef: 'Twain, Mark',
          isAnchor: true,
          isExactMatch: false,
        }],
        totalResults: 1,
        query: 'test=abc',
        loaded: true,
      });

      expect(container.querySelector('.icon-exclamation-circle')).toBeDefined();
    });

    it('should display "would be here" message', () => {
      const { getByText } = renderSearchResultsList({
        authorities: [{
          id: '43f76f93-cfc4-4b6a-a2d4-9b04c8ed7a46',
          headingType: 'Personal name',
          authRefType: 'Authorized',
          headingRef: 'Twain, Mark',
          isAnchor: true,
          isExactMatch: false,
        }],
        totalResults: 1,
        query: 'test=abc',
        loaded: true,
      });

      expect(getByText('ui-marc-authorities.browse.noMatch.wouldBeHereLabel')).toBeDefined();
    });
  });

  describe('when there is only one record', () => {
    it('should call history.replace with specific params', () => {
      renderSearchResultsList({
        authorities: [{
          id: 'cbc03a36-2870-4184-9777-0c44d07edfe4',
          headingType: 'Geographic Name',
          authRefType: 'Authorized',
          headingRef: 'Springfield (Colo.)',
        }],
        totalResults: 1,
      });
      expect(mockHistoryPush).toHaveBeenCalledWith(
        '/authorities/cbc03a36-2870-4184-9777-0c44d07edfe4?authRefType=Authorized&headingRef=Springfield%20%28Colo.%29',
      );
    });
  });

  describe('when there is an updated record to highlight', () => {
    it('should redirect to that updated record', () => {
      const { rerender } = renderSearchResultsList({
        authorities: [{
          id: 'cbc03a36-2870-4184-9777-0c44d07edfe4',
          headingType: 'Geographic Name',
          authRefType: 'Authorized',
          headingRef: 'Springfield (Colo.)',
        }, {
          id: 'cbc03a36-2870-4184-9777-0c44d07edfe4',
          headingType: 'Geographic Name',
          authRefType: 'Reference',
          headingRef: 'Springfield (Colo.) Reference',
        }],
        totalResults: 2,
      }, {
        id: 'cbc03a36-2870-4184-9777-0c44d07edfe4',
        headingType: 'Geographic Name',
        authRefType: 'Reference',
        headingRef: 'Springfield',
      });

      rerender(getSearchResultsList({
        authorities: [{
          id: 'cbc03a36-2870-4184-9777-0c44d07edfe4',
          headingType: 'Geographic Name',
          authRefType: 'Authorized',
          headingRef: 'Springfield (Colo.)',
        }, {
          id: 'cbc03a36-2870-4184-9777-0c44d07edfe4',
          headingType: 'Geographic Name',
          authRefType: 'Reference',
          headingRef: 'SpringfieldEDITED',
        }],
        totalResults: 2,
      }, {
        id: 'cbc03a36-2870-4184-9777-0c44d07edfe4',
        headingType: 'Geographic Name',
        authRefType: 'Reference',
        headingRef: 'Springfield',
      }));

      expect(mockHistoryPush).toHaveBeenCalledWith('/authorities/cbc03a36-2870-4184-9777-0c44d07edfe4?authRefType=Reference&headingRef=SpringfieldEDITED');
    });
  });
});
