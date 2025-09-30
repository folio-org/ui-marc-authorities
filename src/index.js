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
  CreateMarcAuthorityRoute,
  EditMarcAuthorityRoute,
} from './routes';
import { MarcAuthoritySettings } from './settings';
import {
  AuthorityTitleManager,
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
  focusSearchField = () => {
    const searchElement = document.getElementById('textarea-authorities-search');

    if (searchElement) {
      searchElement.focus();
    }
  },
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
            <AuthorityTitleManager>
              <Switch>
                <Route path={`${path}/quick-marc/create-authority`} component={CreateMarcAuthorityRoute} />
                <Route path={`${path}/quick-marc/edit-authority/:id`} component={EditMarcAuthorityRoute} />
                <Route
                  path={path}
                  component={RouteComponent}
                >
                  <Route path={`${path}/authorities/:id`} component={AuthorityViewRoute} />
                </Route>
              </Switch>
            </AuthorityTitleManager>
          </KeyShortCutsWrapper>
        </SelectedAuthorityRecordContextProvider>
      </AuthoritiesSearchContextProvider>
    </CommandList>
  );
};

MarcAuthorities.propTypes = propTypes;

export default MarcAuthorities;
