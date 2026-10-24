
import { getMarkValue } from '@/utils/mediaMarks';

// Constants for dropdown and sorting
const ALL_FILTER_VALUE = 'all';

// `mark` is JSON now ({ value, hide }) — read its scalar value for the
// dropdown. Every other field is read as-is.
const readField = (item, field) =>
  field === 'mark' ? getMarkValue(item) : item[field];

const getUniqueFilterOptions = (data, field, allLabel) => {
  const uniqueValues = Array.from(
    new Set(
      (Array.isArray(data) ? data : [])
        .map((item) => readField(item, field))
        .filter(Boolean)
    )
  );
  const sortedValues = uniqueValues.sort((a, b) => String(a).localeCompare(String(b)));
  return [
    { value: ALL_FILTER_VALUE, label: allLabel },
    ...sortedValues.map(value => ({ value, label: value }))
  ];
};

export default getUniqueFilterOptions;
