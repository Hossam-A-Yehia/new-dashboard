type TreeNode = {
  id: string | number;
  alias: string;
  name_en: string;
  children?: TreeNode[];
};

type NestedName = {
  id: string | number;
  name: string;
};

export default function generateNestedNames(
  arr: TreeNode[],
  parentNames: string[] = []
): NestedName[] {
  let result: NestedName[] = [];

  arr.forEach((obj) => {
    const { id, alias, name_en, children } = obj;
    const nameAlias = `${name_en} [${alias}]`;

    if (!children || children.length === 0) {
      const name = [...parentNames, nameAlias].filter(Boolean).join("/");
      result.push({ id, name });
    }

    if (children && children.length > 0) {
      const nestedNames = generateNestedNames(children, [
        ...parentNames,
        nameAlias,
      ]);
      result = result.concat(nestedNames);
    }
  });

  return result;
}
