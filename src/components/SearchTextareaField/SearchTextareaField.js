import {
  useEffect,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import {
  Select,
  TextArea,
} from '@folio/stripes/components';

import { AuthoritiesSearchContext } from '../../context';

import css from './SearchTextareaField.css';

const propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  onSubmitSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  searchableIndexes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  textAreaRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  value: PropTypes.string,
};

const SearchTextareaField = ({
  className,
  id,
  value,
  loading,
  searchableIndexes,
  placeholder,
  disabled,
  onSubmitSearch,
  textAreaRef,
  ...rest
}) => {
  const intl = useIntl();
  const {
    searchDropdownValue,
    setSearchDropdownValue,
    searchInputValue,
    setSearchInputValue,
  } = useContext(AuthoritiesSearchContext);

  const fitTextBoxToContent = () => {
    if (!textAreaRef.current?.style) {
      return;
    }

    // this is a hack to set textarea height to fit in all text
    textAreaRef.current.style.height = '';
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  };

  useEffect(() => {
    fitTextBoxToContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const indexLabel = intl.formatMessage({ id: 'stripes-components.searchFieldIndex' });
  const textAreaLabel = intl.formatMessage({ id: 'ui-marc-authorities.label.search.textArea' });

  const rootStyles = classNames(
    css.searchFieldWrap,
    className,
  );

  return (
    <div className={rootStyles}>
      <Select
        aria-label={indexLabel}
        dataOptions={searchableIndexes}
        disabled={loading}
        id={`${id}-qindex`}
        marginBottom0
        onChange={e => setSearchDropdownValue(e.target.value)}
        selectClass={css.select}
        value={searchDropdownValue}
        data-testid="search-select"
        placeholder={placeholder}
      />
      <TextArea
        {...rest}
        disabled={disabled}
        id={id}
        data-testid="search-textarea"
        loading={loading}
        onChange={e => setSearchInputValue(e.target.value)}
        type="search"
        value={searchInputValue || ''}
        readOnly={loading || rest.readOnly}
        inputRef={textAreaRef}
        aria-label={textAreaLabel}
      />
    </div>
  );
};

SearchTextareaField.propTypes = propTypes;
SearchTextareaField.defaultProps = {
  disabled: false,
  loading: false,
  className: '',
  placeholder: '',
  textAreaRef: null,
  value: '',
};

export default SearchTextareaField;
