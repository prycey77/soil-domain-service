import * as hello from "./service";

test("Hello World test", () => {
  expect(hello.helloWorld()).toEqual("Hello, World!");
});
