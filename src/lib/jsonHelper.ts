const isJsonObject = (obj: any) => {
  if (obj.length === 0) {
    return false;
  }
  try {
    JSON.stringify(obj);
    // if (Object.prototype.toString.call(json).slice(8, -1) !== "Object") {
    return true;
    // }
  } catch (e) {
    return false;
  }
};

export { isJsonObject };
