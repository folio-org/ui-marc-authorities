import { useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

import {
  get,
} from 'lodash';

import {
  Button,
  Icon,
  Pane,
  PaneMenu,
  SearchField,
} from '@folio/stripes/components';

import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  PersistedPaneset,
} from '@folio/stripes/smart-components';

import css from './AuthoritiesSearch.css';

const rawSearchableIndexes = [
  { label: 'ui-marc-authorities.keyword', value: '' },
  { label: 'ui-marc-authorities.identifier', value: 'identifier' },
  { label: 'ui-marc-authorities.personalName', value: 'personal-name' },
  { label: 'ui-marc-authorities.corporateConferenceName', value: 'corporate-conference-name' },
  { label: 'ui-marc-authorities.geographicName', value: 'geographic-name' },
  { label: 'ui-marc-authorities.nameTitle', value: 'name-title' },
  { label: 'ui-marc-authorities.uniformTitle', value: 'uniform-title' },
  { label: 'ui-marc-authorities.subject', value: 'subject' },
  { label: 'ui-marc-authorities.childrensSubjectHeading', value: 'childrens-subject-heading' },
  { label: 'ui-marc-authorities.genre', value: 'genre' },
  { label: 'ui-marc-authorities.authorityUUID', value: 'authority-uuid' },
];

const filterPaneVisibilityKey = '@folio/marc-authorities/marcAuthoritiesFilterPaneVisibility';

const AuthoritiesSearch = ({
  mutator,
  location,
  resources,
}) => {
  const intl = useIntl();

  const [storedFilterPaneVisibility] = useLocalStorage(filterPaneVisibilityKey, true);
  const [isFilterPaneVisible, setIsFilterPaneVisible] = useState(storedFilterPaneVisibility);

  const toggleFilterPane = () => {
    setIsFilterPaneVisible(!isFilterPaneVisible);
    writeStorage(filterPaneVisibilityKey, !isFilterPaneVisible);
  };

  const onChangeIndex = (e) => {
    const index = e.target.value;

    mutator.query.update({ qindex: index });

    console.log('onChangeIndex index', index);
  };

  const onSubmitSearch = () => {
    // e.preventDefault();

    console.log('onSubmitSearch');
  };

  const renderResultsFirstMenu = () => {
    console.log('isFilterPaneVisible', isFilterPaneVisible);

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

  const searchableIndexes = rawSearchableIndexes.map(index => ({
    label: intl.formatMessage({ id: index.label }),
    value: index.value,
  }));

  return (
    <PersistedPaneset
      appId="@folio/marc-authorities"
      id="marc-authorities-paneset"
    >
      {isFilterPaneVisible &&
        <Pane
          defaultWidth="320px"
          id="pane-authorities-filters"
          fluidContentWidth
          paneTitle={intl.formatMessage({ id: 'ui-marc-authorities.search.searchAndFilter' })}
          lastMenu={(
            <PaneMenu>
              <CollapseFilterPaneButton onClick={toggleFilterPane} />
            </PaneMenu>
          )}
        >
          <form onSubmit={onSubmitSearch}>
            <div className={css.searchGroupWrap}>
              <SearchField
                // value={searchValue.query}
                // onChange={(e) => {
                //   if (e.target.value) {
                //     getSearchHandlers().query(e);
                //   } else {
                //     getSearchHandlers().reset();
                //   }
                // }}
                autoFocus
                autoComplete="off"
                name="query"
                id="input-authorities-search"
                className={css.searchField}
                searchableIndexes={searchableIndexes}
                onChangeIndex={onChangeIndex}
                selectedIndex={get(resources.query, 'qindex')}
              />
              <Button
                id="submit-authorities-search"
                type="submit"
                buttonStyle="primary"
                fullWidth
                marginBottom0
                // disabled={(!searchValue.query || searchValue.query === '')}
              >
                {intl.formatMessage({ id: 'ui-marc-authorities.label.search' })}
              </Button>
            </div>
            <Button
              buttonStyle="none"
              id="clickable-reset-all"
              // disabled={!location.search || isLoading}
              disabled={!location.search}
              // onClick={resetAll}
            >
              <Icon icon="times-circle-solid">
                {intl.formatMessage({ id: 'stripes-smart-components.resetAll' })}
              </Icon>
            </Button>
          </form>
        </Pane>
      }
      <Pane
        defaultWidth="fill"
        id="search-results"
        firstMenu={renderResultsFirstMenu()}
      >
        <p>Results</p>
      </Pane>
    </PersistedPaneset>
  );
};

AuthoritiesSearch.propTypes = {
  location: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    query: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    query: PropTypes.shape({
      qindex: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default AuthoritiesSearch;
