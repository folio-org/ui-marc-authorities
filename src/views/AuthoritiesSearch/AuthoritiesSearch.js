import {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import { useRouteMatch } from 'react-router';
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
import pick from 'lodash/pick';

import {
  Button,
  Icon,
  Pane,
  MenuSection,
  Select,
  TextLink,
  Checkbox,
  PaneMenu,
} from '@folio/stripes/components';
import {
  PersistedPaneset,
  useColumnManager,
  ColumnManagerMenu,
  ExpandFilterPaneButton,
} from '@folio/stripes/smart-components';
import {
  AppIcon,
  useNamespace,
  CalloutContext,
} from '@folio/stripes/core';
import { buildSearch } from '@folio/stripes-acq-components';
import {
  AuthoritiesSearchContext,
  AuthoritiesSearchPane,
  SearchResultsList,
  AuthorityShape,
  navigationSegments,
  searchableIndexesValues,
  searchResultListColumns,
  SelectedAuthorityRecordContext,
  useAutoOpenDetailView,
  AUTH_REF_TYPES,
} from '@folio/stripes-authority-components';
import { useHighlightEditedRecord } from '@folio/stripes-authority-components/lib/SearchResultsList/useHighlightEditedRecord';

import { ReportsMenu } from './ReportsMenu';
import { ReportsModal } from './ReportsModal/ReportsModal';
import {
  useAuthorityExport,
  useExportReport,
} from '../../queries';
import { useReportGenerator } from '../../hooks';
import {
  sortableSearchResultListColumns,
  sortOrders,
} from '../../constants';

import css from './AuthoritiesSearch.css';
import { REPORT_TYPES } from './constants';

const prefix = 'authorities';
const NON_INTERACTIVE_HEADERS = [searchResultListColumns.SELECT];

const propTypes = {
  authorities: PropTypes.arrayOf(AuthorityShape).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  handleLoadMore: PropTypes.func.isRequired,
  hasNextPage: PropTypes.bool,
  hasPrevPage: PropTypes.bool,
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
  hasNextPage,
  hasPrevPage,
}) => {
  const intl = useIntl();
  const [, getNamespace] = useNamespace();
  const match = useRouteMatch();
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
  const prevQuery = useRef('');
  const [, setSelectedAuthorityRecord] = useContext(SelectedAuthorityRecordContext);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const uniqueAuthorities = useMemo(() => authorities.filter(item => !!item.id), [authorities]);
  const reportGenerator = useReportGenerator('QuickAuthorityExport');
  const filterPaneVisibilityKey = getNamespace({ key: 'marcAuthoritiesFilterPaneVisibility' });
  const [storedFilterPaneVisibility] = useLocalStorage(filterPaneVisibilityKey, true);
  const [isFilterPaneVisible, setIsFilterPaneVisible] = useState(storedFilterPaneVisibility);
  const [showDetailView, setShowDetailView] = useState(false);
  const [reportsModalOpen, setReportsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const uniqueAuthoritiesCount = useMemo(() => {
    // determine count of unique ids in authorities array.
    // this is needed to check or uncheck "Select all" checkbox in header when all rows are explicitly
    // checked or unchecked.
    const filteredAuthorities = authorities.map(authority => authority.id).filter(id => !!id);

    return new Set(filteredAuthorities).size;
  }, [authorities]);

  const selectedRowsIds = useMemo(() => (Object.keys(selectedRows)), [selectedRows]);
  const selectedRowsCount = useMemo(() => (Object.keys(selectedRows).length), [selectedRows]);

  const rowExistsInSelectedRows = row => {
    return selectedRowsIds.includes(row.id);
  };

  const recordToHighlight = useHighlightEditedRecord(authorities);

  const getSelectAllRowsState = useCallback(() => {
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
  }, [selectAll, selectedRows, selectedRowsIds, uniqueAuthorities]);

  const toggleSelectAll = useCallback(() => {
    setSelectedRows(getSelectAllRowsState());
    setSelectAll(prev => !prev);
  }, [getSelectAllRowsState, setSelectedRows, setSelectAll]);

  const selectAllLabel = selectAll
    ? intl.formatMessage({ id: 'stripes-authority-components.search-results-list.selectAll' })
    : intl.formatMessage({ id: 'stripes-authority-components.search-results-list.unselectAll' });

  const columnMapping = useMemo(() => ({
    [searchResultListColumns.SELECT]: (
      <Checkbox
        onChange={() => toggleSelectAll()}
        name="select all authorities"
        aria-label={selectAllLabel}
        data-testid="select-all-rows-toggle-button"
        checked={selectAll}
        title={selectAllLabel}
      />
    ),
    [searchResultListColumns.AUTH_REF_TYPE]: <FormattedMessage id="stripes-authority-components.search-results-list.authRefType" />,
    [searchResultListColumns.HEADING_REF]: <FormattedMessage id="stripes-authority-components.search-results-list.headingRef" />,
    [searchResultListColumns.HEADING_TYPE]: <FormattedMessage id="stripes-authority-components.search-results-list.headingType" />,
    [searchResultListColumns.NUMBER_OF_TITLES]: <FormattedMessage id="ui-marc-authorities.search-results-list.numberOfTitles" />,
  }), [selectAll, selectAllLabel, toggleSelectAll]);

  const {
    visibleColumns,
    toggleColumn,
  } = useColumnManager(prefix, columnMapping);

  useEffect(() => {
    const selectedIndex = searchIndex !== searchableIndexesValues.KEYWORD ? searchIndex : '';

    const queryParams = {
      ...pick(queryString.parse(location.search), ['authRefType', 'headingRef']),
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

    const { pathname: curPathname, search: curSearch } = location;

    // change history only if the pathname and search are different from
    // the current pathname and search params.
    // https://issues.folio.org/browse/UIMARCAUTH-147
    if (`${curPathname}${curSearch}` !== `${pathname}?${searchString}`) {
      history.push({
        pathname,
        search: searchString,
        state: location.state,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchQuery,
    searchIndex,
    filters,
    navigationSegmentValue,
    sortOrder,
    sortedColumn,
  ]);

  useEffect(() => {
    // on pagination, when authorities search list change, update "selectAll" checkbox based on the selected rows in the searchList.
    setSelectAll(uniqueAuthorities.every(rowExistsInSelectedRows));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueAuthorities]);

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

  const { doExport } = useExportReport({
    onSuccess: res => {
      setReportsModalOpen(false);
      callout.sendCallout({
        type: 'success',
        message: intl.formatMessage({ id: `ui-marc-authorities.reports.${selectedReport}.success` }, { name: res.name }),
      });
    },
    onError: () => {
      setReportsModalOpen(false);
      callout.sendCallout({
        type: 'error',
        message: intl.formatMessage({ id: 'ui-marc-authorities.reports.fail' }),
      });
    },
  });

  const handleReportsSubmit = useCallback(data => {
    doExport(selectedReport, data);
  }, [doExport, selectedReport]);

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

  const toggleFilterPane = () => {
    setIsFilterPaneVisible(!isFilterPaneVisible);
    writeStorage(filterPaneVisibilityKey, !isFilterPaneVisible);
  };

  const formatter = {
    // eslint-disable-next-line react/prop-types, react/no-multi-comp
    [searchResultListColumns.SELECT]: ({ id, ...rowData }) => id && (
      <Checkbox
        checked={Boolean(selectedRows[id])}
        data-testid="row-toggle-button"
        aria-label={intl.formatMessage({ id: 'ui-marc-authorities.authorities.rows.select' })}
        onChange={() => toggleRowSelection({
          id,
          ...rowData,
        })}
        onClick={e => e.stopPropagation()}
      />
    ),
    /* eslint-disable-next-line */
    [searchResultListColumns.NUMBER_OF_TITLES]: ({ id, authRefType, numberOfTitles }) => {
      if (authRefType !== AUTH_REF_TYPES.AUTHORIZED || numberOfTitles === 0) {
        return null;
      }

      return (
        <TextLink
          to={`/inventory?qindex=authorityId&query=${id}&sort=title`}
          target="_blank"
          onClick={e => e.stopPropagation()}
          data-testid="link-number-of-titles"
        >
          {numberOfTitles}
        </TextLink>
      );
    },
  };

  const options = useMemo(() => Object.values(sortableSearchResultListColumns).map(option => ({
    value: option,
    label: intl.formatMessage({ id: `stripes-authority-components.search-results-list.${option}` }),
  })), [intl]);

  const sortByOptions = useMemo(() => [
    {
      value: '',
      label: intl.formatMessage({ id: 'ui-marc-authorities.actions.menuSection.sortBy.relevance' }),
    },
    ...options,
  ], [intl, options]);

  const formatAuthorityRecordLink = useCallback(authority => {
    const search = queryString.parse(location.search);
    const newSearch = queryString.stringify({
      ...search,
      headingRef: authority.headingRef,
      authRefType: authority.authRefType,
    });

    return `${match.path}/authorities/${authority.id}?${newSearch}`;
  }, [match.path, location.search]);

  const redirectToAuthorityRecord = useCallback(authority => {
    history.push(formatAuthorityRecordLink(authority));
  }, [history, formatAuthorityRecordLink]);

  useEffect(() => {
    if (!isLoading) {
      setShowDetailView(prevQuery.current !== query);
      prevQuery.current = query;
    }
  }, [query, prevQuery.current, isLoading]); // don't remove prevQuery.current from deps (linter asks)

  useAutoOpenDetailView(isLoading ? [] : authorities, redirectToAuthorityRecord, !showDetailView);

  useEffect(() => {
    if (!recordToHighlight) {
      return;
    }

    setSelectedAuthorityRecord(recordToHighlight);
    redirectToAuthorityRecord(recordToHighlight);
    // eslint-disable-next-line
  }, [recordToHighlight]);

  const onSelectReport = useCallback(reportType => {
    setSelectedReport(reportType);

    if (reportType === REPORT_TYPES.HEADINGS_UPDATES) {
      setReportsModalOpen(true);
    } else {
      doExport(reportType);
    }
  }, [doExport]);

  const renderActionMenu = useCallback(({ onToggle }) => {
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
        <ReportsMenu
          onToggle={onToggle}
          onSelectReport={onSelectReport}
        />
      </>
    );
  }, [
    columnMapping,
    exportRecords,
    intl,
    navigationSegmentValue,
    onChangeSortOption,
    selectedRowsCount,
    selectedRowsIds,
    sortByOptions,
    sortedColumn,
    toggleColumn,
    visibleColumns,
    onSelectReport,
  ]);

  const renderPaneSub = () => (
    <span className={css.delimiter}>
      {navigationSegmentValue !== navigationSegments.browse && (
        <span>
          {intl.formatMessage({
            id: 'stripes-authority-components.search-results-list.paneSub',
          }, {
            totalRecords,
          })}
        </span>
      )}
      {
        !!selectedRowsCount &&
        <span>
          <FormattedMessage
            id="ui-marc-authorities.authorities.rows.recordsSelected"
            values={{ count: selectedRowsCount }}
          />
        </span>
      }
    </span>
  );

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

  const renderHeadingRef = (authority, className) => (
    <TextLink
      className={className}
      to={formatAuthorityRecordLink(authority)}
    >
      {authority.headingRef}
    </TextLink>
  );

  return (
    <PersistedPaneset
      appId="@folio/marc-authorities"
      id="marc-authorities-paneset"
      data-testid="marc-authorities-paneset"
    >
      <AuthoritiesSearchPane
        isFilterPaneVisible={isFilterPaneVisible}
        toggleFilterPane={toggleFilterPane}
        isLoading={isLoading}
        onSubmitSearch={onSubmitSearch}
        onChangeSortOption={onChangeSortOption}
        resetSelectedRows={resetSelectedRows}
        query={query}
        hasAdvancedSearch
      />
      <Pane
        id="authority-search-results-pane"
        appIcon={<AppIcon app="marc-authorities" />}
        defaultWidth="fill"
        paneTitle={intl.formatMessage({ id: 'stripes-authority-components.meta.title' })}
        paneSub={renderPaneSub()}
        firstMenu={renderResultsFirstMenu()}
        actionMenu={renderActionMenu}
        padContent={false}
        noOverflow
      >
        <SearchResultsList
          authorities={authorities}
          columnMapping={columnMapping}
          columnWidths={{
            [searchResultListColumns.SELECT]: '30px',
            [searchResultListColumns.NUMBER_OF_TITLES]: '150px',
            [searchResultListColumns.AUTH_REF_TYPE]: '200px',
            [searchResultListColumns.HEADING_REF]: '600px',
            [searchResultListColumns.HEADING_TYPE]: '200px',
          }}
          formatter={formatter}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          totalResults={totalRecords}
          pageSize={pageSize}
          onNeedMoreData={handleLoadMore}
          loading={isLoading}
          loaded={isLoaded}
          visibleColumns={visibleColumns}
          sortedColumn={sortedColumn}
          sortOrder={sortOrder}
          onHeaderClick={onHeaderClick}
          isFilterPaneVisible={isFilterPaneVisible}
          toggleFilterPane={toggleFilterPane}
          hasFilters={!!filters.length}
          query={searchQuery}
          hidePageIndices={hidePageIndices}
          renderHeadingRef={renderHeadingRef}
          nonInteractiveHeaders={NON_INTERACTIVE_HEADERS}
        />
      </Pane>
      {children}
      <ReportsModal
        open={reportsModalOpen}
        reportType={selectedReport}
        onClose={() => setReportsModalOpen(false)}
        onSubmit={handleReportsSubmit}
      />
    </PersistedPaneset>
  );
};

AuthoritiesSearch.propTypes = propTypes;
AuthoritiesSearch.defaultProps = {
  hidePageIndices: false,
  query: '',
  hasNextPage: null,
  hasPrevPage: null,
};

export default AuthoritiesSearch;
