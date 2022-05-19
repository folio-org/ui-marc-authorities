import {
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';
import {
  useLocalStorage,
  writeStorage,
} from '@rehooks/local-storage';
import queryString from 'query-string';

import {
  Button,
  Icon,
  Pane,
  PaneMenu,
  MenuSection,
  Select,
} from '@folio/stripes/components';
import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  PersistedPaneset,
  useColumnManager,
  ColumnManagerMenu,
} from '@folio/stripes/smart-components';
import {
  AppIcon,
  useNamespace,
  CalloutContext,
} from '@folio/stripes/core';
import { buildSearch } from '@folio/stripes-acq-components';

import { useAuthorityExport } from '../../queries';
import { useReportGenerator } from '../../hooks';
import {
  SearchResultsList,
  BrowseFilters,
  SearchFilters,
  AuthoritiesSearchForm,
} from '../../components';
import { AuthoritiesSearchContext } from '../../context';
import {
  navigationSegments,
  searchableIndexesValues,
  searchResultListColumns,
  sortableSearchResultListColumns,
  sortOrders,
} from '../../constants';
import { AuthorityShape } from '../../constants/shapes';
import css from './AuthoritiesSearch.css';

const prefix = 'authorities';

const propTypes = {
  authorities: PropTypes.arrayOf(AuthorityShape).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  handleLoadMore: PropTypes.func.isRequired,
  hidePageIndices: PropTypes.bool,
  isLoaded: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onChangeSortOption: PropTypes.func.isRequired,
  onHeaderClick: PropTypes.func.isRequired,
  onSubmitSearch: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  query: PropTypes.string,
  sortedColumn: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf([sortOrders.ASC, sortOrders.DES]).isRequired,
  totalRecords: PropTypes.number.isRequired,
};

const AuthoritiesSearch = ({
  children,
  sortOrder,
  sortedColumn,
  onChangeSortOption,
  onHeaderClick,
  handleLoadMore,
  authorities,
  isLoading,
  isLoaded,
  totalRecords,
  query,
  pageSize,
  onSubmitSearch,
  hidePageIndices,
}) => {
  const intl = useIntl();
  const [, getNamespace] = useNamespace();
  const history = useHistory();
  const location = useLocation();

  const {
    searchQuery,
    searchIndex,
    filters,
    navigationSegmentValue,
    isGoingToBaseURL,
    setIsGoingToBaseURL,
  } = useContext(AuthoritiesSearchContext);
  const callout = useContext(CalloutContext);

  const columnMapping = {
    [searchResultListColumns.SELECT]: null,
    [searchResultListColumns.AUTH_REF_TYPE]: <FormattedMessage id="ui-marc-authorities.search-results-list.authRefType" />,
    [searchResultListColumns.HEADING_REF]: <FormattedMessage id="ui-marc-authorities.search-results-list.headingRef" />,
    [searchResultListColumns.HEADING_TYPE]: <FormattedMessage id="ui-marc-authorities.search-results-list.headingType" />,
  };
  const {
    visibleColumns,
    toggleColumn,
  } = useColumnManager(prefix, columnMapping);

  const reportGenerator = useReportGenerator('QuickAuthorityExport');
  const filterPaneVisibilityKey = getNamespace({ key: 'marcAuthoritiesFilterPaneVisibility' });

  useEffect(() => {
    const selectedIndex = searchIndex !== searchableIndexesValues.KEYWORD ? searchIndex : '';

    const queryParams = {
      ...queryString.parse(location.search),
      query: searchQuery,
      qindex: selectedIndex,
      ...filters,
    };

    if (navigationSegmentValue) {
      queryParams.segment = navigationSegmentValue;
    }

    if (sortOrder && sortedColumn) {
      const order = sortOrder === sortOrders.ASC ? '' : '-';

      queryParams.sort = `${order}${sortedColumn}`;
    }

    const searchString = `${buildSearch(queryParams)}`;

    const pathname = isGoingToBaseURL
      ? '/marc-authorities'
      : location.pathname;

    if (isGoingToBaseURL) {
      setIsGoingToBaseURL(false);
    }

    history.push({
      pathname,
      search: searchString,
      state: location.state,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchQuery,
    searchIndex,
    filters,
    navigationSegmentValue,
    sortOrder,
    sortedColumn,
  ]);

  const [storedFilterPaneVisibility] = useLocalStorage(filterPaneVisibilityKey, true);
  const [isFilterPaneVisible, setIsFilterPaneVisible] = useState(storedFilterPaneVisibility);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const selectedRowsIds = useMemo(() => (Object.keys(selectedRows)), [selectedRows]);
  const selectedRowsCount = useMemo(() => (Object.keys(selectedRows).length), [selectedRows]);

  const uniqueAuthorities = useMemo(() => authorities.filter(item => !!item.id), [authorities]);

  const uniqueAuthoritiesCount = useMemo(() => {
    // determine count of unique ids in authorities array.
    // this is needed to check or uncheck "Select all" checkbox in header when all rows are explicitly
    // checked or unchecked.
    const filteredAuthorities = authorities.map(authority => authority.id).filter(id => !!id);

    return new Set(filteredAuthorities).size;
  }, [authorities]);

  const rowExistsInSelectedRows = row => {
    return selectedRowsIds.includes(row.id);
  };

  useEffect(() => {
    // on pagination, when authorities search list change, update "selectAll" checkbox based on the selected rows in the searchList.
    setSelectAll(authorities.every(rowExistsInSelectedRows));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorities]);

  const resetSelectedRows = () => {
    setSelectedRows({});
    setSelectAll(false);
  };

  const { exportRecords } = useAuthorityExport({
    onError: () => {
      const message = (
        <FormattedMessage
          id="ui-marc-authorities.export.failure"
        />
      );

      callout.sendCallout({ type: 'error', message });
    },
    onSuccess: () => {
      const { filename } = reportGenerator.toCSV(selectedRowsIds);

      const message = (
        <FormattedMessage
          id="ui-marc-authorities.export.success"
          values={{ exportJobName: filename }}
        />
      );

      callout.sendCallout({ type: 'success', message });
      resetSelectedRows();
    },
  });

  const getNextSelectedRowsState = row => {
    const { id } = row;
    const isRowSelected = !!selectedRows[id];
    const newSelectedRows = { ...selectedRows };

    if (isRowSelected) {
      delete newSelectedRows[id];
    } else {
      newSelectedRows[id] = row;
    }

    return newSelectedRows;
  };

  const toggleRowSelection = row => {
    const newRows = getNextSelectedRowsState(row);

    setSelectedRows(newRows);

    // while selectAll is false, if all rows in current page are selected, update the state "selectAll" to true
    // while select all is true, if one of the rows is unselected, then update select all false
    const newSelectedRowIds = Object.keys(newRows);

    if (
      (!selectAll && uniqueAuthorities.every(item => newSelectedRowIds.includes(item.id))) ||
      (selectAll && (Object.keys(newRows).length !== uniqueAuthoritiesCount))
    ) {
      setSelectAll(prev => !prev);
    }
  };

  const getSelectAllRowsState = () => {
    const newSelectedRows = { ...selectedRows };

    if (!selectAll) {
      // check each of the authorities, if it is not present in selectedRows, add to it
      uniqueAuthorities.forEach(item => {
        if (!selectedRowsIds.includes(item.id)) {
          newSelectedRows[item.id] = item;
        }
      });
    } else {
      // check each of the authorities, if it is present in selectedRows, remove it
      uniqueAuthorities.forEach(item => {
        if (selectedRowsIds.includes(item.id)) {
          delete newSelectedRows[item.id];
        }
      });
    }

    return newSelectedRows;
  };

  const toggleSelectAll = () => {
    setSelectedRows(getSelectAllRowsState());
    setSelectAll(prev => !prev);
  };

  const toggleFilterPane = () => {
    setIsFilterPaneVisible(!isFilterPaneVisible);
    writeStorage(filterPaneVisibilityKey, !isFilterPaneVisible);
  };

  const renderResultsFirstMenu = () => {
    if (isFilterPaneVisible) {
      return null;
    }

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          onClick={toggleFilterPane}
        />
      </PaneMenu>
    );
  };

  const options = Object.values(sortableSearchResultListColumns).map(option => ({
    value: option,
    label: intl.formatMessage({ id: `ui-marc-authorities.search-results-list.${option}` }),
  }));

  const sortByOptions = [
    {
      value: '',
      label: intl.formatMessage({ id: 'ui-marc-authorities.actions.menuSection.sortBy.relevance' }),
    },
    ...options,
  ];

  const renderActionMenu = ({ onToggle }) => {
    return (
      <>
        <MenuSection
          data-testid="menu-section-actions"
          label={intl.formatMessage({ id: 'ui-marc-authorities.actions' })}
        >
          <Button
            buttonStyle="dropdownItem"
            id="dropdown-clickable-export-marc"
            disabled={!selectedRowsCount}
            onClick={() => {
              exportRecords(selectedRowsIds);
              onToggle();
            }}
          >
            <Icon
              icon="download"
              size="medium"
            />
            <FormattedMessage id="ui-marc-authorities.export-selected-records" />
          </Button>
        </MenuSection>
        {navigationSegmentValue !== navigationSegments.browse &&
          <MenuSection
            data-testid="menu-section-sort-by"
            label={intl.formatMessage({ id: 'ui-marc-authorities.actions.menuSection.sortBy' })}
          >
            <Select
              data-testid="sort-by-selection"
              dataOptions={sortByOptions}
              value={sortedColumn}
              onChange={e => onChangeSortOption(e.target.value)}
            />
          </MenuSection>
        }
        <ColumnManagerMenu
          prefix={prefix}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
          columnMapping={columnMapping}
          excludeColumns={[searchResultListColumns.SELECT, searchResultListColumns.HEADING_REF]}
        />
      </>
    );
  };

  const renderPaneSub = () => {
    return (
      <span className={css.delimiter}>
        <span>
          {intl.formatMessage({
            id: 'ui-marc-authorities.search-results-list.paneSub',
          }, {
            totalRecords,
          })}
        </span>
        {
          !!selectedRowsCount &&
          <span>
            <FormattedMessage
              id="ui-inventory.instances.rows.recordsSelected"
              values={{ count: selectedRowsCount }}
            />
          </span>
        }
      </span>
    );
  };

  return (
    <PersistedPaneset
      appId="@folio/marc-authorities"
      id="marc-authorities-paneset"
      data-testid="marc-authorities-paneset"
    >
      {isFilterPaneVisible &&
        <Pane
          defaultWidth="320px"
          id="pane-authorities-filters"
          data-testid="pane-authorities-filters"
          fluidContentWidth
          paneTitle={intl.formatMessage({ id: 'ui-marc-authorities.search.searchAndFilter' })}
          lastMenu={(
            <PaneMenu>
              <CollapseFilterPaneButton onClick={toggleFilterPane} />
            </PaneMenu>
          )}
        >
          <AuthoritiesSearchForm
            isAuthoritiesLoading={isLoading}
            onSubmitSearch={onSubmitSearch}
            onChangeSortOption={onChangeSortOption}
            resetSelectedRows={resetSelectedRows}
          />
          {
            navigationSegmentValue === navigationSegments.browse
              ? (
                <BrowseFilters cqlQuery={query} />
              )
              : (
                <SearchFilters
                  isSearching={isLoading}
                  cqlQuery={query}
                />
              )
          }
        </Pane>
      }
      <Pane
        id="authority-search-results-pane"
        appIcon={<AppIcon app="marc-authorities" />}
        defaultWidth="fill"
        paneTitle={intl.formatMessage({ id: 'ui-marc-authorities.meta.title' })}
        paneSub={renderPaneSub()}
        firstMenu={renderResultsFirstMenu()}
        actionMenu={renderActionMenu}
        padContent={false}
        noOverflow
      >
        <SearchResultsList
          authorities={authorities}
          totalResults={totalRecords}
          pageSize={pageSize}
          onNeedMoreData={handleLoadMore}
          loading={isLoading}
          loaded={isLoaded}
          visibleColumns={visibleColumns}
          selectedRows={selectedRows}
          sortedColumn={sortedColumn}
          sortOrder={sortOrder}
          onHeaderClick={onHeaderClick}
          isFilterPaneVisible={isFilterPaneVisible}
          toggleFilterPane={toggleFilterPane}
          toggleRowSelection={toggleRowSelection}
          toggleSelectAll={toggleSelectAll}
          selectAll={selectAll}
          hasFilters={!!filters.length}
          query={searchQuery}
          hidePageIndices={hidePageIndices}
        />
      </Pane>
      {children}
    </PersistedPaneset>
  );
};

AuthoritiesSearch.propTypes = propTypes;
AuthoritiesSearch.defaultProps = {
  hidePageIndices: false,
  query: '',
};

export default AuthoritiesSearch;
