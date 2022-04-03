const modules = import.meta.globEager("./*");

export default Object.values(modules);
