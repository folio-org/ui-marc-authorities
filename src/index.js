import 'core-js/stable';
import 'regenerator-runtime/runtime';

import PropTypes from 'prop-types';
import {
  Route,
  Switch,
} from 'react-router-dom';
import SearchRoute from './routes/search-route';

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
    <Switch>
      <Route
        path={path}
        exact
        component={SearchRoute}
      />
    </Switch>
  );
};

MarcAuthorities.propTypes = propTypes;

export default MarcAuthorities;
