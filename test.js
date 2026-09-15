const toCamelCase = (str) => {
  return str.replace(/([-_][a-z])/ig, (match) => {
    return match.toUpperCase().replace('-', '').replace('_', '');
  });
};
const camelizeKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => camelizeKeys(v));
  } else if (obj !== null && obj.constructor === Object) {
    const result = Object.keys(obj).reduce((acc, key) => {
      acc[toCamelCase(key)] = camelizeKeys(obj[key]);
      return acc;
    }, {});
    
    if ('id' in result && ('city' in result || 'country' in result || 'firstName' in result)) {
      if (!result.location || typeof result.location !== 'object') {
        result.location = {
          city: result.city || '',
          country: result.country || '',
          latitude: result.latitude || null,
          longitude: result.longitude || null
        };
      } else {
        result.location.city = result.location.city || result.city || '';
        result.location.country = result.location.country || result.country || '';
        result.location.latitude = result.location.latitude || result.latitude || null;
        result.location.longitude = result.location.longitude || result.longitude || null;
      }
    }
    
    return result;
  }
  return obj;
};

fetch('http://localhost:3000/api/users/3781169c-a08c-4918-9b38-d2fb9c6fb9b1')
  .then(r => r.json())
  .then(res => {
    console.log(camelizeKeys(res).interests);
  });
