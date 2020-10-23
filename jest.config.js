module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testURL: "http://localhost",
  testRegex: "(src/__tests__/.*.test.*)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
