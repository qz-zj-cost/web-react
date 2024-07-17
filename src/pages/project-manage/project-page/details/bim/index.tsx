import BimApi from "@/apis/bimApi";
import BuildApi from "@/apis/buildApi";
import { ActionType, ProTable } from "@ant-design/pro-components";
import { Button, Space, Spin, Tag } from "antd";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ProjectContext } from "../detailContext";
import BimModal from "./bimModal";
import BindModel from "./bindModel";
import MatchBuildModel from "./matchBuildModel";
interface IBimContextProps {
  getToken: () => Promise<string>;
}
export const BimContext = createContext<IBimContextProps>(null as any);
const Bim = () => {
  const { projectId } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number>();
  const tokenRef = useRef<string>();
  const actionRef = useRef<ActionType>();

  const getToken = useCallback(async () => {
    try {
      const nowTime = new Date().getTime();
      if (
        timerRef.current &&
        tokenRef.current &&
        Math.abs(nowTime - timerRef.current) <= 25 * 60 * 1000
      ) {
        return tokenRef.current;
      }
      setLoading(true);
      const res = await BimApi.login();
      timerRef.current = new Date().getTime();
      tokenRef.current = res.data.token;
      setLoading(false);
      return res.data.token;
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getToken();
  }, [getToken]);

  const onUpload = useCallback(async () => {
    const token = await getToken();
    const url = `http://192.168.13.153:8182/luban-bim-web/#/login?token=${token}&orgId=cb060f5669a14accbe3c4d74b697c9d5&menuId=192-2008&from=newStandard&epid=90001150`;
    window.open(url, "_blank");
  }, [getToken]);

  return (
    <BimContext.Provider value={{ getToken }}>
      <Spin spinning={loading}>
        <ProTable
          search={false}
          actionRef={actionRef}
          scroll={{ x: "max-content" }}
          rowKey={"id"}
          request={async () => {
            const res = await BuildApi.getBuildProject({
              id: projectId,
              // queryStatus: Number(tabRef.current),
            });
            return {
              data: res.data || [],
              success: true,
            };
          }}
          bordered
          columns={[
            {
              title: "单位工程",
              dataIndex: "unitProject",
            },
            {
              title: "是否绑定模型",
              dataIndex: "motor3dId",
              render(_, entity) {
                return entity["motor3dId"] ? (
                  <Tag color="success">已绑定</Tag>
                ) : (
                  <Tag>未绑定</Tag>
                );
              },
            },
            {
              title: "操作",
              width: "auto",
              fixed: "right",
              align: "center",
              render(_, record) {
                return (
                  <Space>
                    <BindModel
                      uuid={record.uuid}
                      onSuccess={() => {
                        actionRef.current?.reload();
                      }}
                    />
                    <MatchBuildModel
                      uuid={record.uuid}
                      motor3dId={record.motor3dId}
                    />
                    <BimModal motor3dId={record.motor3dId} uuid={record.uuid} />
                  </Space>
                );
              },
            },
          ]}
          pagination={false}
          toolbar={{
            actions: [
              <Button type="primary" onClick={onUpload}>
                上传模型
              </Button>,
            ],
          }}
        />
      </Spin>
    </BimContext.Provider>
  );
};

export default Bim;
