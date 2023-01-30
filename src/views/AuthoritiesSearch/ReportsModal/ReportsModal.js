import { useIntl } from 'react-intl';
import {
  Field,
  useFormState,
} from 'react-final-form';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalFooter,
  DateRangeWrapper,
  Datepicker,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes-final-form';

import { REPORT_TYPES } from '../constants';

import styles from './ReportsModal.css';

const propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  reportType: PropTypes.oneOf(Object.values(REPORT_TYPES)).isRequired,
};

const ReportsModal = ({
  open,
  onClose,
  reportType,
  handleSubmit,
}) => {
  const intl = useIntl();
  const { values } = useFormState();

  if (!open) {
    return null;
  }

  return (
    <Modal
      open
      size="small"
      label={intl.formatMessage({ id: `ui-marc-authorities.reportModal.${reportType}.label` })}
      id="authorities-report-modal"
      data-testid="authorities-report-modal"
      aria-label={intl.formatMessage({ id: `ui-marc-authorities.reportModal.${reportType}.label` })}
      onClose={onClose}
      modalClass={styles.reportsModal}
      contentClass={styles.reportsModalContent}
      footer={(
        <ModalFooter>
          <Button
            buttonStyle="primary"
            onClick={handleSubmit}
            data-testid="export-button"
          >
            {intl.formatMessage({ id: 'ui-marc-authorities.reportModal.button.export' })}
          </Button>
          <Button onClick={onClose}>
            {intl.formatMessage({ id: 'ui-marc-authorities.reportModal.button.cancel' })}
          </Button>
        </ModalFooter>
    )}
    >
      <DateRangeWrapper
        startValueGetter={() => values.fromDate}
        endValueGetter={() => values.toDate}
      >
        {({
          endDateExclude,
          startDateExclude,
        }) => (
          <div className={styles.dateRangeWrapper}>
            <Field
              name="fromDate"
              label={intl.formatMessage({ id: 'ui-marc-authorities.reportModal.startDate' })}
              required
              component={Datepicker}
              exclude={startDateExclude}
            />
            <Field
              name="toDate"
              label={intl.formatMessage({ id: 'ui-marc-authorities.reportModal.endDate' })}
              required
              component={Datepicker}
              exclude={endDateExclude}
            />
          </div>
        )}
      </DateRangeWrapper>
    </Modal>
  );
};

ReportsModal.propTypes = propTypes;

const ReportsModalForm = stripesFinalForm({
  subscription: { values: true },
})(ReportsModal);

export { ReportsModalForm as ReportsModal };
