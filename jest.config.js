module.exports = {
  transform: {
    "^.+\\.js$": [
      "babel-jest",
      {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: { node: "current" }
            }
          ]
        ]
      }
    ],
    "^.+\\.svelte$": [
      "svelte-jester",
      {
        preprocess: true
      }
    ]
  },
  moduleFileExtensions: ["js", "svelte"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"]
};
