// Prop validation helper
const validateProps = (props) => {
    const warnings = [];
    
    if (!props.fields || !Array.isArray(props.fields) || props.fields.length === 0) {
      warnings.push('fields prop is required and should be a non-empty array');
    }
    
    if (!props.item || typeof props.item !== 'object') {
      warnings.push('item prop is required and should be an object');
    }
    
    if (process.env.NODE_ENV === 'development' && warnings.length > 0) {
      console.warn('ManagerCard validation warnings:', warnings);
    }
    
    return warnings.length === 0;
  };

  export default validateProps;