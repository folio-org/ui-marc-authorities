import 'core-js/stable';
import 'regenerator-runtime/runtime';

import PropTypes from 'prop-types';

import {
  Switch,
} from 'react-router-dom';

import {
  Route,
} from '@folio/stripes/core';

import {
  SearchRoute,
  AuthorityViewRoute,
  AuthorityQuickMarcEditRoute,
} from './routes';

import { MarcAuthoritiesAppContext } from './components';

const propTypes = {
  match: PropTypes.object.isRequired,
  stripes: PropTypes.shape({
    connect: PropTypes.func,
  }),
};

const MarcAuthorities = ({
  match: {
    path,
  },
}) => {
  return (
    <>
      <MarcAuthoritiesAppContext />
      <Switch>
        <Route path={`${path}/quick-marc`} component={AuthorityQuickMarcEditRoute} />
        <Route
          path={path}
          component={SearchRoute}
        >
          <Route path={`${path}/authorities/:id`} component={AuthorityViewRoute} />
        </Route>
      </Switch>
    </>
  );
};

MarcAuthorities.propTypes = propTypes;

export default MarcAuthorities;
