const modules = import.meta.globEager("./!(*.test.*)");

export default Object.values(modules);
