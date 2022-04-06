export const classes = {
  digit: { name: "numeric digits", value: "0123456789" },
  lower: { name: "lower-case letters", value: "abcdefghijklmnopqrstuvwxyz" },
  upper: { name: "upper-case letters", value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
  punct: { name: "punctuation characters", value: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~'" },
};

export default function (length, classNames = Object.keys(classes)) {
  const result = new Array(length);

  const rand = new Uint32Array(length);
  crypto.getRandomValues(rand);

  const pool = classNames.map((name) => classes[name].value).join("");

  for (let i = 0; i < length; i++) {
    result[i] = pool[rand[i] % pool.length];
  }

  return result.join("");
}
