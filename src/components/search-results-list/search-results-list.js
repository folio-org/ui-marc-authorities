import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
  Pane,
} from '@folio/stripes/components';
import {
  AppIcon,
} from '@folio/stripes/core';

import {
  AuthorityShape,
} from '../../constants/shapes';

const propTypes = {
  authorities: PropTypes.arrayOf(AuthorityShape).isRequired,
  loading: PropTypes.bool,
  onNeedMoreData: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalResults: PropTypes.number,
};

const authRef = 'Auth/Ref';

const SearchResultsList = ({
  authorities,
  totalResults,
  loading,
  pageSize,
  onNeedMoreData,
}) => {
  const columnMapping = {
    authRefType: <FormattedMessage id="ui-marc-authorities.search-results-list.authRefType" />,
    headingRef: <FormattedMessage id="ui-marc-authorities.search-results-list.headingRef" />,
    headingType: <FormattedMessage id="ui-marc-authorities.search-results-list.headingType" />,
  };
  const columnWidths = {
    authRefType: '25%',
    headingRef: '40%',
    headingType: '35%',
  };
  const formatter = {
    authRefType: (authority) => {
      return authority.authRefType === authRef
        ? <b>{authority.authRefType}</b>
        : authority.authRefType;
    },
  };
  const visibleColumns = ['authRefType', 'headingRef', 'headingType'];

  return (
    <Pane
      appIcon={<AppIcon app="marc-authorities" />}
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-marc-authorities.meta.title" />}
    >
      <MultiColumnList
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        contentData={authorities}
        formatter={formatter}
        id="authority-result-list"
        onNeedMoreData={onNeedMoreData}
        visibleColumns={visibleColumns}
        totalCount={totalResults}
        pagingType="prev-next"
        pageAmount={pageSize}
        loading={loading}
      />
    </Pane>
  );
};

SearchResultsList.propTypes = propTypes;

export default SearchResultsList;
