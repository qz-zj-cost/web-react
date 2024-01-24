import BimApi from "@/apis/bimApi";
import { IMatchTreeItem } from "@/models/bimModel";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Space,
  Spin,
  Tree,
  TreeProps,
  Typography,
} from "antd";
import { uniqueId } from "lodash";
import Postmate, { ParentAPI } from "postmate";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { BimContext } from ".";
import CalculateModal from "./calculate";

const IframeView = ({
  motor3dId,
  uuid,
}: {
  motor3dId: string;
  uuid: string;
}) => {
  const urlRef = useRef<string>();
  const parentFrameRef = useRef<ParentAPI | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [selectInfo, setSelectInfo] = useState<string[]>();
  const tokenRef = useRef<string>();
  const [loading, setLoading] = useState(true);
  const [treeData, setTreeData] = useState<any[]>();
  const { getToken } = useContext(BimContext);
  const keysRef = useRef<string[]>([]);

  const getTeeData = useCallback(async () => {
    await getToken();
    const res = await BimApi.getMatchTree({
      uuid,
    });
    const tree2arr = (
      arr: IMatchTreeItem[],
      path?: string,
    ): TreeProps["treeData"] => {
      const opts = arr?.map((e) => {
        const curPath = path ? `${path},${e.name}` : `${e.name}`;
        let child: TreeProps["treeData"] = [];
        if (e.children) {
          child = tree2arr(e.children, curPath);
        } else if (e.modelPathList) {
          child = e.modelPathList.map((v) => {
            const _key = `${v}&${uniqueId("ids_")}`;
            keysRef.current.push(_key);
            return {
              title: v,
              key: _key,
            };
          });
        }
        const _key = `${curPath}&${uniqueId("ids_")}`;
        keysRef.current.push(_key);
        return {
          title: e.name,
          key: _key,
          children: child,
        };
      });
      return opts;
    };
    setTreeData(tree2arr(res.data.children));
  }, [getToken, uuid]);

  const loadProject = useCallback(() => {
    // 加载项目
    if (parentFrameRef.current === null) {
      return;
    }
    parentFrameRef.current.call("connectOpenProj", motor3dId);
  }, [motor3dId]);
  const onClickDestroy = useCallback(() => {
    if (parentFrameRef.current === null) {
      return;
    }
    parentFrameRef.current.call("destroy");
  }, []);

  const onChecked = useCallback((keys: string[]) => {
    if (parentFrameRef.current === null) {
      return;
    }
    setSelectInfo(keys);
    const newKeys = keys
      .map((e) => e.split("&")[0].split(","))
      .filter((v) => v.length > 4);
    // parentFrameRef.current.call("selectDir", [["第10层", "IFC", "IfcSlab", "未注板", "未注板"]]);
    parentFrameRef.current.call("selectDir", newKeys);
  }, []);
  // 创建连接
  const onCreateConnection = useCallback(() => {
    if (iframeRef.current === null || !urlRef.current) {
      return;
    }
    if (parentFrameRef.current !== null) {
      parentFrameRef.current.destroy();
      parentFrameRef.current = null;
    }
    const handleShake = new Postmate({
      container: iframeRef.current,
      url: urlRef.current,
      name: "motor-frame",
      classListArray: ["iframe-box"],
      model: {
        verson: 1,
      },
    });
    handleShake.then((parent) => {
      // 监听构件选中事件
      parent.on(
        "selectChange",
        (info: { id: string; bimId: string; dir: string[] }[]) => {
          const path = info.map((el) => el.dir.join(","));
          //寻找对应的唯一key
          const keys = keysRef.current.filter((v) =>
            path.some((e) => e === v.split("&")[0]),
          );
          setSelectInfo(keys);
        },
      );

      parentFrameRef.current = parent;
      setLoading(false);

      loadProject();
    });
  }, [loadProject]);
  const onClickCommond = useCallback((name: string, data: any) => {
    if (parentFrameRef.current === null) {
      return;
    }
    parentFrameRef.current.call(name, data);
  }, []);

  const init = useCallback(async () => {
    onClickDestroy();
    tokenRef.current = await getToken();
    const url = `http://192.168.13.153:8182/iworks-motor/#/login?token=${tokenRef.current}&from=newStandard`;
    urlRef.current = url;
    onCreateConnection();
  }, [getToken, onClickDestroy, onCreateConnection]);

  useEffect(() => {
    init();
    getTeeData();
  }, [getTeeData, init]);
  return (
    <Spin spinning={loading} tip="加载中...">
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 300,
            padding: 15,
            boxShadow: " 2px 2px 5px #e5e5e5",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "15px 0",
            }}
          >
            <Typography.Title level={5}>构件树</Typography.Title>
            <CalculateModal
              pathList={selectInfo?.map((v) => v.split("&")[0])}
            />
          </div>
          <Tree
            checkable
            showLine
            treeData={treeData}
            checkedKeys={selectInfo}
            onCheck={(k) => {
              onChecked(k as string[]);
            }}
            height={window.innerHeight - 100}
          />
        </div>
        <div
          ref={iframeRef}
          style={{
            flex: 1,
            border: "none",
            overflow: "auto",
          }}
        />
        <div style={{ position: "absolute", top: 15, left: 350 }}>
          <Space>
            <Checkbox
              onChange={(e) => {
                if (e.target.checked) {
                  onClickCommond("setSelectMultiple", true);
                } else {
                  onClickCommond("setSelectMultiple", false);
                }
              }}
            >
              多选
            </Checkbox>
            <Button
              onClick={() => onClickCommond("clearSelect", undefined)}
              icon={<DeleteOutlined />}
            >
              清除选中
            </Button>
          </Space>
        </div>
      </div>
    </Spin>
  );
};

export default IframeView;
