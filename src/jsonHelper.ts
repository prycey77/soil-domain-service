const isJson = (str: any) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export { isJson };
