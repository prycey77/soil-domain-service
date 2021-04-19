const isJson = (string: any) => {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  // eslint-disable-next-line no-restricted-globals
  return isNaN(string);
};

export { isJson };
