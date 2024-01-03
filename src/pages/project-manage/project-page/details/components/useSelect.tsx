import { ContractImportApi } from "@/apis/projectApi";
import { ActionType } from "@ant-design/pro-components";
import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ProjectContext } from "..";

const useSelect = ({
  actionRef,
  type = 1,
}: {
  actionRef?: ActionType;
  type?: number;
}) => {
  const [options, setOptions] = useState<DefaultOptionType[]>();
  const [types, setTypes] = useState<{ typeId1?: string; typeId2?: string }>();
  const { projectId } = useContext(ProjectContext);

  useEffect(() => {
    if (!types && options && options?.length > 0) {
      setTypes({
        typeId1: options[0]?.value?.toString(),
        typeId2: options[0]?.children?.[0]?.value,
      });
      actionRef?.reloadAndRest?.();
    }
  }, [options, types, actionRef]);

  const getTypeList = useCallback(() => {
    return ContractImportApi.getProjectTypeList({
      id: projectId,
      type,
    }).then((res) => {
      const opts = res.data.map((v) => ({
        label: v.unitProject,
        value: v.uuid,
        children: v.unitSectionDtoList?.map((e) => ({
          label: e.name,
          value: e.uuid,
        })),
      }));
      setOptions(opts);
    });
  }, [projectId, type]);

  const selectProject = useMemo(() => {
    return (
      <Select
        style={{ width: 300 }}
        placeholder="请选择单位工程"
        options={options?.map((e) => ({ label: e.label, value: e.value }))}
        value={types?.typeId1}
        onChange={(v) => {
          setTypes({ typeId1: v, typeId2: void 0 });
        }}
        allowClear
      />
    );
  }, [options, types?.typeId1]);
  const selectProjectType = useMemo(() => {
    return (
      <Select
        style={{ width: 300 }}
        placeholder="请选择分部分项工程"
        options={options
          ?.find((v) => v.value === types?.typeId1)
          ?.children?.map((e) => ({ label: e.label, value: e.value }))}
        value={types?.typeId2}
        onChange={(v) => {
          setTypes({ ...types, typeId2: v });
          actionRef?.reloadAndRest?.();
        }}
        allowClear
      />
    );
  }, [actionRef, options, types]);
  return {
    getTypeList,
    types,
    selectProject,
    selectProjectType,
  };
};

export default useSelect;
