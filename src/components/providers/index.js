import { rootname } from "@/lib/path";

const modules = import.meta.globEager("./!(*.test.*)");

export default Object.fromEntries(
  Object.entries(modules).map(([path, module]) => [rootname(path), module])
);
