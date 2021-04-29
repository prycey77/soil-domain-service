const headResponse = (fileSize: number) => {
  return {
    AcceptRanges: "bytes",
    LastModified: "2021-04-29T15:19:14.000Z",
    ContentLength: fileSize,
    ETag: '"02d4058ef67f70a2b0b64297ed555746"',
    ContentType: "text/csv",
    Metadata: {},
  };
};

export { headResponse };
