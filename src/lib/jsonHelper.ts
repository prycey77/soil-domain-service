const isJson = (str: string) => {
  try {
    const json = JSON.parse(str);
    console.log(`Object.prototype${Object.prototype.toString.call(json[0])}`);
    if (Object.prototype.toString.call(json[0]).slice(8, -1) !== "Object") {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
};

export { isJson };
