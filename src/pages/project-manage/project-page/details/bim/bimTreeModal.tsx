import BimApi from "@/apis/bimApi";
import { ITreeItem } from "@/models/bimModel";
import { Alert, Button, Drawer, Tree, message } from "antd";
import { isArray } from "lodash";
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { BimContext } from ".";
import { ProjectContext } from "..";

export type IBimTreeModalRef = {
  show: (uuid: string) => void;
};
const BimTreeModal = forwardRef<
  IBimTreeModalRef,
  { motor3dId: string; unitProjectUuid: string; onSuccess: VoidFunction }
>(({ motor3dId, unitProjectUuid, onSuccess }, ref) => {
  const [visible, setVisible] = useState(false);
  const [treeData, setTreeData] = useState<any[]>();
  const { getToken } = useContext(BimContext);
  const [selectKeys, setSelectKeys] = useState<string[]>();
  const [uuid, setUuid] = useState<string>();
  const { projectId } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const getTeeData = useCallback(async () => {
    await getToken();
    const res = await BimApi.getBimMatchTree({
      motor3dId,
    });
    const tree2arr = (arr: ITreeItem[], path?: string): any => {
      const opts = arr?.map((e) => {
        const curPath = path ? `${path},${e.name}` : e.name;
        return {
          title: e.name,
          key: curPath,
          //   disabled: e.children ? true : false,
          children: tree2arr(e.children, curPath),
        };
      });
      return opts;
    };
    setTreeData(tree2arr(res.data.children));
  }, [getToken, motor3dId]);

  useImperativeHandle(
    ref,
    () => ({
      show(uuid) {
        setUuid(uuid);
        setVisible(true);
      },
    }),
    [],
  );
  useEffect(() => {
    getTeeData();
  }, [getTeeData]);
  const handleOk = () => {
    if (selectKeys && selectKeys?.length < 1) return;
    setLoading(true);
    BimApi.match({
      modelPathList: selectKeys?.[0].split(","),
      memberStoreyUuid: uuid,
      unitProjectUuid,
      projectId,
    })
      .then(() => {
        message.success("操作成功");
        onSuccess();
        setVisible(false);
        setSelectKeys(void 0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Drawer
        open={visible}
        width={500}
        title="选择构件"
        onClose={() => setVisible(false)}
        footer={
          <Button type="primary" onClick={handleOk} loading={loading}>
            确定
          </Button>
        }
      >
        <Alert
          message="请选择单个构件进行匹配"
          type="warning"
          style={{ marginBottom: 15 }}
        />
        <Tree
          checkable
          showLine
          defaultExpandParent
          checkedKeys={selectKeys}
          height={window.innerHeight - 100}
          // defaultExpandAll
          //   defaultExpandedKeys={["0-0-0", "0-0-1"]}
          //   defaultSelectedKeys={["0-0-0", "0-0-1"]}
          //   defaultCheckedKeys={["0-0-0", "0-0-1"]}
          onCheck={(e) => {
            console.log(e);
            if (isArray(e) && e.length > 0) {
              setSelectKeys([e[e.length - 1] as string]);
            }
          }}
          treeData={treeData}
        />
      </Drawer>
    </>
  );
});

export default BimTreeModal;
