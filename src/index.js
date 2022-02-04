import 'core-js/stable';
import 'regenerator-runtime/runtime';

import PropTypes from 'prop-types';
import {
  Switch,
  useLocation,
} from 'react-router-dom';
import queryString from 'query-string';

import {
  Route,
} from '@folio/stripes/core';
import { CommandList } from '@folio/stripes/components';

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
import { AuthoritiesSearchContextProvider } from './context';
import commands from './commands';
import { navigationSegments } from './constants';

const propTypes = {
  focusSearchField: PropTypes.func,
  match: PropTypes.object.isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func,
  }),
};

const MarcAuthorities = ({
  match: {
    path,
  },
  focusSearchField = () => {
    const searchElement = document.getElementById('textarea-authorities-search');

    if (searchElement) {
      searchElement.focus();
    }
  },
}) => {
  const location = useLocation();
  const RouteComponent = queryString.parse(location.search).segment === navigationSegments.browse
    ? BrowseRoute
    : SearchRoute;

  return (
    <CommandList commands={commands}>
      <AuthoritiesSearchContextProvider>
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
    </CommandList>
  );
};

MarcAuthorities.propTypes = propTypes;

export default MarcAuthorities;
