
export const awsSdkPrimoseResponse = jest.fn().mockReturnValue(Promise.resolve(true));

const putFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPrimoseResponse}));

export class DocumentClient {
  put = putFn
}