import ProjectApi from "@/apis/projectApi";
import { IEqModel } from "@/models/projectModel";
import { Select, Space } from "antd";
import { Key, useCallback, useEffect, useMemo, useRef, useState } from "react";

type IOptions = { label: string; value: Key; status?: number };

const engineerMap = new Map([
  [0, "未提交"],
  [1, "已提交"],
  [2, "已通过"],
]);
const expertStatusMap = new Map([
  [0, "未审核"],
  [1, "已审核"],
  [2, "已通过"],
]);
type ISearchType = {
  unitProjectId: number | null;
  sectionId: number | null;
};
const useUnitSelect = (type: number, id?: Key, initSearch?: ISearchType) => {
  const [unitList, setUnitList] = useState<IOptions[]>([]);
  const unitDataRef = useRef<IEqModel[]>();
  const [subOption, setSubOption] = useState<IOptions[]>();
  const [status, setStatus] = useState<number>();
  const [search, setSearch] = useState<ISearchType>({
    unitProjectId: null,
    sectionId: null,
  });

  const getData = useCallback(() => {
    if (!id) return;
    ProjectApi.eq.getUnitList(id).then((res) => {
      unitDataRef.current = res.data;
      const _unitList =
        res.data?.map((e) => {
          const _l =
            type === 0
              ? e.unitProject
              : type === 1
                ? `${e.unitProject}(${
                    engineerMap.get(e.engineerStatus) ?? "-"
                  })`
                : `${e.unitProject}(${
                    expertStatusMap.get(e.expertStatus) ?? "-"
                  })`;
          return {
            label: _l,
            value: e.id,
            status:
              type === 0
                ? void 0
                : type == 1
                  ? e.engineerStatus
                  : e.expertStatus,
          };
        }) ?? [];
      setUnitList(_unitList);
      if (unitDataRef.current && unitDataRef.current.length > 0) {
        setSubOption(
          unitDataRef.current[0].unitSectionDtos.map((v) => ({
            label: `${v.name}`,
            value: v.id,
          })),
        );
        const _firstSectionId = unitDataRef.current[0].unitSectionDtos[0].id;
        setSearch({
          unitProjectId: initSearch?.unitProjectId ?? _unitList[0].value,
          sectionId: initSearch?.sectionId ?? _firstSectionId,
        });
        setStatus(_unitList[0].status);
      }
    });
  }, [id, initSearch?.unitProjectId, initSearch?.sectionId, type]);

  useEffect(() => {
    getData();
  }, [getData]);
  const selectView = useMemo(
    () => (
      <Space>
        <Select
          style={{ width: 400 }}
          options={unitList}
          popupMatchSelectWidth={400}
          placeholder="请选择单位工程"
          value={search.unitProjectId}
          onChange={(val) => {
            if (val) {
              const options =
                unitDataRef.current
                  ?.find((e) => e.id === val)
                  ?.unitSectionDtos.map((v) => ({
                    label: `${v.name}`,
                    value: v.id,
                  })) ?? [];
              const _status = unitList?.find((v) => v.value === val)?.status;
              setStatus(_status);
              setSearch({ unitProjectId: val, sectionId: options[0].value });
              setSubOption(options);
            } else {
              setStatus(void 0);
              setSearch({ unitProjectId: null, sectionId: null });
              setSubOption([]);
            }
          }}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          allowClear
        />
        <Select
          style={{ width: 200 }}
          options={subOption}
          placeholder="请选择分部分项"
          value={search.sectionId}
          allowClear
          onChange={(val) => {
            setSearch({ ...search, sectionId: val });
          }}
        />
      </Space>
    ),
    [search, subOption, unitList],
  );
  const selectView2File = useMemo(() => {
    const _options: IOptions[] = unitList.concat([
      { value: 0, label: "公共资料" },
    ]);
    return (
      <Select
        style={{ width: 400 }}
        options={_options}
        popupMatchSelectWidth={400}
        placeholder="请选择单位工程"
        value={search.unitProjectId}
        onChange={(val) => {
          setSearch({ ...search, unitProjectId: val });
        }}
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
      />
    );
  }, [search, unitList]);
  return {
    selectView,
    selectView2File,
    searchData: search,
    unitList,
    disabled: status ? status > 0 : void 0,
    getData,
  };
};

export default useUnitSelect;
