import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';
import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';

import css from './Reports.css';

const Reports = ({
  onToggle,
}) => {
  const stripes = useStripes();
  const intl = useIntl();

  const showReports = stripes.hasPerm('ui-marc-authorities.authority-record.view') &&
    stripes.hasPerm('ui-quick-marc.quick-marc-authorities-editor.all') &&
    stripes.hasPerm('ui-inventory.all-permissions.TEMPORARY') &&
    (stripes.hasPerm('ui-quick-marc.quick-marc-editor.view') || stripes.hasPerm('ui-quick-marc.quick-marc-editor.all')) &&
    (stripes.hasPerm('ui-export-manager.export-manager.all') || stripes.hasPerm('ui-export-manager.jobs.downloadAndResend'));

  if (!showReports) return null;

  const renderReport = ({ translationId, onClick }) => (
    <Button
      buttonStyle="dropdownItem"
      onClick={() => {
        onClick?.();
        onToggle();
      }}
    >
      <Icon
        icon="download"
        size="medium"
      />
      <FormattedMessage id={translationId} />
    </Button>
  );

  return (
    <MenuSection
      className={css.container}
      data-testid="menu-section-reports"
      label={intl.formatMessage({ id: 'ui-marc-authorities.reports' })}
    >
      {renderReport({
        translationId: 'ui-marc-authorities.reports.marcAuthorityHeadings',
      })}
      {renderReport({
        translationId: 'ui-marc-authorities.reports.blindAuthorityHeadings',
      })}
      {renderReport({
        translationId: 'ui-marc-authorities.reports.failedUpdates',
      })}
    </MenuSection>
  );
};

Reports.propTypes = {
  onToggle: PropTypes.func.isRequired,
};

export default Reports;
