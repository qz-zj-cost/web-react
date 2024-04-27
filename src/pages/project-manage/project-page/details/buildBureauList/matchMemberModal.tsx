import BuildApi from "@/apis/buildApi";
import { IMathchMemberConfig } from "@/models/buildModel";
import {
  ModalForm,
  ProForm,
  ProFormInstance,
  ProFormSelect,
} from "@ant-design/pro-components";
import { message } from "antd";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ProjectContext } from "..";
import useSelect from "../components/useSelect";

export interface IMatchMemberRef {
  show: (e: any) => void;
}
const MatchMemberModal = forwardRef<IMatchMemberRef, { onSuccess: () => void }>(
  ({ onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { types, selectProject, getTypeList } = useSelect({ type: 1 });
    const { projectId } = useContext(ProjectContext);
    const [options, setOptions] = useState<IMathchMemberConfig>();
    const formRef = useRef<ProFormInstance>();
    const idRef = useRef<string>();
    useImperativeHandle(
      ref,
      () => ({
        show: (e) => {
          setVisible(true);
          idRef.current = e.id;
        },
      }),
      [],
    );
    useEffect(() => {
      getTypeList();
    }, [getTypeList]);
    useEffect(() => {
      if (types?.typeId1 && projectId) {
        BuildApi.getMatchMemberConfig({
          projectId,
          unitProjectUuid: types?.typeId1,
        }).then((res) => {
          setOptions(res.data);
        });
      }
    }, [projectId, types]);

    return (
      <ModalForm
        title="匹配构件"
        open={visible}
        formRef={formRef}
        onOpenChange={(v) => {
          if (!v) {
            setVisible(false);
            formRef.current?.resetFields();
          }
        }}
        onFinish={async (params) => {
          try {
            await BuildApi.matchMember({
              ...params,
              id: idRef.current,
              unitProjectUuid: types?.typeId1,
            });
            message.success("匹配成功");
            onSuccess();
            return true;
          } catch (error) {
            return false;
          }
        }}
      >
        <ProForm.Item label="单位工程">{selectProject()}</ProForm.Item>
        <ProFormSelect
          label="构件选择"
          name="memberType"
          options={options?.memberTypeDtos.map((item) => ({
            value: item.memberType,
            label: item.memberType,
          }))}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          label="计算项目"
          name="computeProject"
          options={options?.computeProjectDtos.map((item) => ({
            value: item.computeProject,
            label: item.computeProject,
          }))}
        />
        <ProFormSelect
          label="硂等级"
          name="concreteLevel"
          options={options?.concreteLevelDtos.map((item) => ({
            value: item.concreteLevel,
            label: item.concreteLevel,
          }))}
        />
        <ProFormSelect
          label="钢筋型号选择"
          name="rebarCode"
          options={options?.rebarCodeDtos.map((item) => ({
            value: item.rebarCode,
            label: item.rebarCode,
          }))}
        />
        <ProFormSelect
          label="钢筋直径选择"
          name="rebarType"
          options={options?.rebarTypeDtos.map((item) => ({
            value: item.rebarType,
            label: item.rebarType,
          }))}
        />
      </ModalForm>
    );
  },
);

export default MatchMemberModal;
