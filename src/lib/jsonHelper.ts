const isJsonObject = (obj: any) => {
  if (obj.length === 0) {
    return false;
  }
  try {
    if (typeof obj === "object" && obj !== null) {
      JSON.stringify(obj);
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
};

export { isJsonObject };
