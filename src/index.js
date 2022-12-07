import 'core-js/stable';
import 'regenerator-runtime/runtime';

import PropTypes from 'prop-types';
import {
  Switch,
  useLocation,
} from 'react-router-dom';
import queryString from 'query-string';

import { Route } from '@folio/stripes/core';
import { CommandList } from '@folio/stripes/components';
import {
  AuthoritiesSearchContextProvider,
  SelectedAuthorityRecordContextProvider,
  navigationSegments,
  searchableIndexesValues,
} from '@folio/stripes-authority-components';

import {
  SearchRoute,
  BrowseRoute,
  AuthorityViewRoute,
  AuthorityQuickMarcEditRoute,
} from './routes';
import {
  KeyShortCutsWrapper,
  MarcAuthoritiesAppContext,
} from './components';
import commands from './commands';

const propTypes = {
  focusSearchField: PropTypes.func,
  match: PropTypes.object.isRequired,
};

const defaultDropdownValueBySegment = {
  [navigationSegments.search]: searchableIndexesValues.KEYWORD,
  [navigationSegments.browse]: '',
};

const MarcAuthorities = ({
  match: { path },
  focusSearchField,
}) => {
  const location = useLocation();

  const RouteComponent = queryString.parse(location.search).segment === navigationSegments.browse
    ? BrowseRoute
    : SearchRoute;

  return (
    <CommandList commands={commands}>
      <SelectedAuthorityRecordContextProvider>
        <AuthoritiesSearchContextProvider defaultDropdownValueBySegment={defaultDropdownValueBySegment}>
          <MarcAuthoritiesAppContext />
          <KeyShortCutsWrapper focusSearchField={focusSearchField}>
            <Switch>
              <Route path={`${path}/quick-marc`} component={AuthorityQuickMarcEditRoute} />
              <Route
                path={path}
                component={RouteComponent}
              >
                <Route path={`${path}/authorities/:id`} component={AuthorityViewRoute} />
              </Route>
            </Switch>
          </KeyShortCutsWrapper>
        </AuthoritiesSearchContextProvider>
      </SelectedAuthorityRecordContextProvider>
    </CommandList>
  );
};

MarcAuthorities.propTypes = propTypes;
MarcAuthorities.defaultProps = {
  focusSearchField: () => {
    const searchElement = document.getElementById('textarea-authorities-search');

    if (searchElement) {
      searchElement.focus();
    }
  },
};

export default MarcAuthorities;
