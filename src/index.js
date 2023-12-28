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
} from '@folio/stripes-authority-components';

import {
  SearchRoute,
  BrowseRoute,
  AuthorityViewRoute,
  AuthorityQuickMarcRoute,
} from './routes';
import { MarcAuthoritySettings } from './settings';
import {
  KeyShortCutsWrapper,
  MarcAuthoritiesAppContext,
} from './components';
import commands from './commands';

const propTypes = {
  focusSearchField: PropTypes.func,
  match: PropTypes.object.isRequired,
  showSettings: PropTypes.bool.isRequired,
};

const MarcAuthorities = ({
  match: { path },
  focusSearchField,
  showSettings,
}) => {
  const location = useLocation();

  const RouteComponent = queryString.parse(location.search).segment === navigationSegments.browse
    ? BrowseRoute
    : SearchRoute;

  if (showSettings) {
    return (
      <MarcAuthoritySettings />
    );
  }

  return (
    <CommandList commands={commands}>
      <AuthoritiesSearchContextProvider>
        <SelectedAuthorityRecordContextProvider
          readParamsFromUrl
        >
          <MarcAuthoritiesAppContext />
          <KeyShortCutsWrapper focusSearchField={focusSearchField}>
            <Switch>
              <Route path={`${path}/quick-marc`} component={AuthorityQuickMarcRoute} />
              <Route
                path={path}
                component={RouteComponent}
              >
                <Route path={`${path}/authorities/:id`} component={AuthorityViewRoute} />
              </Route>
            </Switch>
          </KeyShortCutsWrapper>
        </SelectedAuthorityRecordContextProvider>
      </AuthoritiesSearchContextProvider>
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
