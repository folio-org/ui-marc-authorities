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

import { REPORT_TYPES } from '../constants';

import css from './ReportsMenu.css';

const ReportsMenu = ({
  onToggle,
  onSelectReport,
}) => {
  const stripes = useStripes();
  const intl = useIntl();

  const showReports = stripes.hasPerm('ui-marc-authorities.authority-record.view') &&
    stripes.hasPerm('ui-quick-marc.quick-marc-authorities-editor.all') &&
    stripes.hasPerm('ui-inventory.all-permissions.TEMPORARY') &&
    stripes.hasPerm('ui-quick-marc.quick-marc-editor.view') &&
    stripes.hasPerm('ui-export-manager.jobs.downloadAndResend');

  const renderReport = ({ translationId, reportType }) => (
    <Button
      buttonStyle="dropdownItem"
      onClick={() => {
        onSelectReport(reportType);
        onToggle();
      }}
    >
      <Icon
        icon="download"
        size="medium"
      >
        <FormattedMessage id={translationId} />
      </Icon>
    </Button>
  );

  if (!showReports) return null;

  return (
    <MenuSection
      className={css.container}
      data-testid="menu-section-reports"
      label={intl.formatMessage({ id: 'ui-marc-authorities.reports' })}
    >
      {renderReport({
        translationId: 'ui-marc-authorities.reports.marcAuthorityHeadings',
        reportType: REPORT_TYPES.HEADINGS_UPDATES,
      })}
      {renderReport({
        translationId: 'ui-marc-authorities.reports.failedUpdates',
        reportType: REPORT_TYPES.FAILED_UPDATES,
      })}
    </MenuSection>
  );
};

ReportsMenu.propTypes = {
  onSelectReport: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ReportsMenu;
