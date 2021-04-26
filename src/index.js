import 'core-js/stable';
import 'regenerator-runtime/runtime';

import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import { Search } from './routes/search';

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
        component={Search}
      />
    </Switch>
  );
};

MarcAuthorities.propTypes = propTypes;

export default MarcAuthorities;
