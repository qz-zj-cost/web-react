import { Checkbox, Tree } from "antd";
import { DataNode } from "antd/lib/tree";
import { cloneDeep } from "lodash";
import { Key, useEffect, useState } from "react";

interface IMyTreeSelectProps {
  value?: Key[];
  onChange?: (val: Key[]) => void;
  options?: DataNode[];
}
const MyTreeSelect = ({ options, value, onChange }: IMyTreeSelectProps) => {
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);

  useEffect(() => {
    if (value && value.length && !checkedKeys.length) {
      setCheckedKeys(value);
    }
    if ((!value || !value.length) && checkedKeys.length) {
      setCheckedKeys([]);
    }
  }, [value, options, checkedKeys]);
  const getChildrenKeys = (node?: DataNode[]) => {
    return (
      node?.reduce((pre: Key[], cur) => {
        let childKeys: Key[] = [];
        if (cur.children) childKeys = getChildrenKeys(cur.children);
        return [...pre, cur.key, ...childKeys];
      }, []) ?? []
    );
  };
  const getParentKeys = (
    treeData?: DataNode[],
    currentId?: Key,
    arr: Key[] = [],
  ): Key[] => {
    if (!treeData) return [];
    for (const data of treeData) {
      if (data.key === currentId) return arr;
      arr.push(data.key);
      if (data.children) {
        const findChildren = getParentKeys(data.children, currentId, arr);
        if (findChildren.length) return findChildren;
      }
      arr.pop();
    }
    return [];
  };

  return (
    <Tree
      // checkable
      // blockNode
      treeData={options}
      selectable={false}
      // checkedKeys={checkedKeys}
      // checkStrictly
      // onCheck={onCheck}
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: 4,
        backgroundColor: "#f5f5f5",
      }}
      titleRender={(node) => {
        const indeterminate =
          node.children?.every((e) => checkedKeys.includes(e.key)) ?? true;
        return (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Checkbox
              indeterminate={!indeterminate && checkedKeys.includes(node.key)}
              checked={checkedKeys.includes(node.key)}
              onChange={(e) => {
                if (e.target.checked) {
                  const childrenKeys = getChildrenKeys(node.children);
                  const parentIds = getParentKeys(options, node.key);

                  const keys = [
                    ...checkedKeys,
                    node.key,
                    ...childrenKeys,
                    ...parentIds,
                  ];
                  // if (parentId && !keys.includes(parentId)) {
                  //   keys.push(parentId);
                  // }
                  const setArr = Array.from(new Set(keys));
                  setCheckedKeys(setArr);
                  onChange?.(setArr);
                } else {
                  const childrenKeys = getChildrenKeys(node.children);
                  const keys = [node.key, ...childrenKeys];
                  const newKeys = cloneDeep(checkedKeys);
                  keys.forEach((e) => {
                    if (newKeys.indexOf(e) > -1) {
                      newKeys.splice(newKeys.indexOf(e), 1);
                    }
                  });
                  const setArr = Array.from(new Set(newKeys));
                  setCheckedKeys(setArr);
                  onChange?.(setArr);
                }
              }}
            >
              {node.title as React.ReactNode}
            </Checkbox>
          </div>
        );
      }}
    />
  );
};
export default MyTreeSelect;
