import {
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import {
  Select,
  TextArea,
} from '@folio/stripes/components';

import css from './SearchTextareaField.css';

const propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeIndex: PropTypes.func,
  onSubmitSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  searchableIndexes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  selectedIndex: PropTypes.string,
  value: PropTypes.string,
};

const SearchTextareaField = ({
  className,
  id,
  value,
  onChange,
  loading,
  searchableIndexes,
  placeholder,
  onChangeIndex,
  selectedIndex,
  disabled,
  onSubmitSearch,
  ...rest
}) => {
  const intl = useIntl();
  const textAreaRef = useRef(null);

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
  }, [value]);

  const indexLabel = intl.formatMessage({ id: 'stripes-components.searchFieldIndex' });
  const textAreaLabel = intl.formatMessage({ id: 'ui-marc-authorities.label.search.textArea' });

  const rootStyles = classNames(
    css.searchFieldWrap,
    className,
  );

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      onSubmitSearch();
    }
  };

  return (
    <div className={rootStyles}>
      <Select
        aria-label={indexLabel}
        dataOptions={searchableIndexes}
        disabled={loading}
        id={`${id}-qindex`}
        marginBottom0
        onChange={onChangeIndex}
        selectClass={css.select}
        value={selectedIndex}
        data-testid="search-select"
        placeholder={placeholder}
      />
      <TextArea
        {...rest}
        disabled={disabled}
        id={id}
        data-testid="search-textarea"
        loading={loading}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        type="search"
        value={value || ''}
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
};

export default SearchTextareaField;
