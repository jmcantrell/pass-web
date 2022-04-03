const modules = import.meta.globEager(`./*`);

export default Object.fromEntries(
  Object.values(modules).map((module) => [module.path, module.default])
);
