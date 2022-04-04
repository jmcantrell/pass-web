export const classes = {
  digit: { name: "numeric digits", value: "0123456789" },
  lower: { name: "lower-case letters", value: "abcdefghijklmnopqrstuvwxyz" },
  upper: { name: "upper-case letters", value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
  punct: { name: "punctuation characters", value: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~'" },
};

export default function (options = {}) {
  const result = Array(options.length);
  const pool = options.classes.map((type) => classes[type].value).join("");

  for (let i = 0; i < result.length; i++) {
    result[i] = pool[Math.floor(Math.random() * pool.length)];
  }

  return result.join("");
}
