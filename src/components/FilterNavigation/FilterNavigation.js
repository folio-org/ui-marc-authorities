import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  ButtonGroup,
} from '@folio/stripes/components';

import { navigationSegments } from '../../constants';

const FilterNavigation = ({
  segment,
  onChange,
}) => (
  <ButtonGroup fullWidth>
    {
      Object.keys(navigationSegments).map(name => (
        <Button
          key={`${name}`}
          to={`/marc-authorities?segment=${name}`}
          buttonStyle={`${segment === name ? 'primary' : 'default'}`}
          aria-selected={segment === name}
          id={`segment-navigation-${name}`}
          data-testid={`segment-navigation-${name}`}
          onClick={onChange}
        >
          <FormattedMessage id={`ui-marc-authorities.label.${name}`} />
        </Button>
      ))
    }
  </ButtonGroup>
);

FilterNavigation.propTypes = {
  onChange: PropTypes.func,
  segment: PropTypes.string,
};

FilterNavigation.defaultProps = {
  segment: navigationSegments.search,
};

export default FilterNavigation;
