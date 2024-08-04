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
import useSelect from "../components/useSelect";
import { ProjectContext } from "../detailContext";

export interface IMatchMemberRef {
  show: (e: any, type: number) => void;
}
const MatchMemberModal = forwardRef<IMatchMemberRef, { onSuccess: () => void }>(
  ({ onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { types, selectProject, getTypeList } = useSelect({ type: 1 });
    const { projectId } = useContext(ProjectContext);
    const [options, setOptions] = useState<IMathchMemberConfig>();
    const [gJoptions, setGjOptions] =
      useState<{ value: string; label: string }[]>();
    const formRef = useRef<ProFormInstance>();
    const idRef = useRef<string>();
    const [type, setType] = useState(1);
    useImperativeHandle(
      ref,
      () => ({
        show: (e, t) => {
          setVisible(true);
          setType(t);
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
    }, [projectId, type, types?.typeId1]);

    useEffect(() => {
      if (types?.typeId1 && projectId && type === 2) {
        BuildApi.getMemberType({
          id: projectId,
          uuid: types?.typeId1,
          type: 2,
        }).then((res) => {
          const arr = res.data.map((e) => ({
            label: e.memberType,
            value: e.memberType,
          }));
          setGjOptions(arr);
        });
      }
    }, [projectId, type, types?.typeId1]);

    return (
      <ModalForm
        title={type === 1 ? "匹配构件" : "匹配钢筋"}
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
            if (type === 1) {
              await BuildApi.matchMember({
                ...params,
                id: idRef.current,
                unitProjectUuid: types?.typeId1,
              });
            } else {
              await BuildApi.matchGj({
                ...params,
                id: idRef.current,
                unitProjectUuid: types?.typeId1,
              });
            }
            message.success("匹配成功");
            formRef.current?.resetFields();
            onSuccess();
            return true;
          } catch (error) {
            return false;
          }
        }}
      >
        <ProForm.Item label="单位工程">{selectProject()}</ProForm.Item>

        {type === 1 && (
          <>
            <ProFormSelect
              label={"构件类型"}
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
          </>
        )}
        {type === 2 && (
          <>
            <ProFormSelect
              label={"钢筋类型"}
              name="memberType"
              options={gJoptions}
              rules={[{ required: true }]}
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
          </>
        )}
      </ModalForm>
    );
  },
);

export default MatchMemberModal;
