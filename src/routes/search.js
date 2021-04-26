import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Pane, Paneset } from '@folio/stripes/components';

const propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

const Search = ({ match }) => {
  const intl = useIntl();

  return (
    <Paneset>
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={intl.formatMessage({ id: 'ui-marc-authorities.meta.title' })}
      >
        <ul>
          <li data-test-application-examples>
            View the
            {' '}
            <Link to={`${match.path}/examples`}>examples page</Link>
            {' '}
            to see some useful components.
          </li>
          <li data-test-application-guide>
            Please refer to the
            {' '}
            <a href="https://github.com/folio-org/stripes/blob/master/doc/dev-guide.md">
              Stripes Module Developer&apos;s Guide
            </a>
            {' '}
            for more information.
          </li>
        </ul>
      </Pane>
    </Paneset>
  );
};

Search.propTypes = propTypes;

export { Search };
