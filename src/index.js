import 'core-js/stable';
import 'regenerator-runtime/runtime';

import PropTypes from 'prop-types';

import {
  Switch,
} from 'react-router-dom';

import {
  Route,
} from '@folio/stripes/core';

import { CommandList } from '@folio/stripes/components';

import {
  SearchRoute,
  AuthorityViewRoute,
  AuthorityQuickMarcEditRoute,
} from './routes';

import { MarcAuthoritiesAppContext } from './components';

import commands from './commands';
import KeyShortCutsWrapper from './components/KeyShortCutsWrapper';

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
  return (
    <CommandList commands={commands}>
      <MarcAuthoritiesAppContext />
      <KeyShortCutsWrapper focusSearchField={focusSearchField}>
        <Switch>
          <Route path={`${path}/quick-marc`} component={AuthorityQuickMarcEditRoute} />
          <Route
            path={path}
            component={SearchRoute}
          >
            <Route path={`${path}/authorities/:id`} component={AuthorityViewRoute} />
          </Route>
        </Switch>
      </KeyShortCutsWrapper>
    </CommandList>
  );
};

MarcAuthorities.propTypes = propTypes;

export default MarcAuthorities;
