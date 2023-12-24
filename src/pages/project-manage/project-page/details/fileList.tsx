import ProjectApi from "@/apis/projectApi";
import { IProjectModel } from "@/models/projectModel";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Popconfirm, Space, Typography, message } from "antd";
import JsFileDownloader from "js-file-downloader";
import { isNil } from "lodash";
import { useEffect, useRef } from "react";
import UploadFile from "./components/uploadFile";
import useUnitSelect from "./components/useUnitSelect";

/**
 * @author Destin
 * @description 项目资料
 * @date 2023/10/11
 */

type IFileListProps = {
  info?: IProjectModel;
};
const FileList = ({ info }: IFileListProps) => {
  const actionRef = useRef<ActionType>();
  const { selectView2File, searchData } = useUnitSelect(0, info?.id, {
    unitProjectId: 0,
    sectionId: 0,
  });

  useEffect(() => {
    if (!isNil(searchData.unitProjectId)) {
      actionRef.current?.reset?.();
    }
  }, [searchData.unitProjectId]);

  const columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "orgCode",
      render(_, _e, index) {
        return index + 1;
      },
    },
    {
      title: "资料名称",
      dataIndex: "fileName",
    },
    {
      title: "上传时间",
      dataIndex: "gmtCreated",
    },
    {
      title: "上传人",
      dataIndex: "createUserName",
    },
    {
      title: "操作",
      fixed: "right",
      width: "auto",
      render: (_, val) => {
        return (
          <Space>
            <Typography.Link
              onClick={() => {
                new JsFileDownloader({
                  // eslint-disable-next-line prettier/prettier
                  url: `${import.meta.env.VITE_HTTP_UPLOAD}/upload/${
                    val.fileUrl
                  }`,
                  filename: val.fileName,
                })
                  .then(() => {
                    message.destroy();
                    message.success("下载完成");
                  })
                  .catch(() => {
                    message.destroy();
                    message.error("下载失败");
                  });
              }}
            >
              下载
            </Typography.Link>
            <Typography.Link
              onClick={() => {
                window.open(
                  `${import.meta.env.VITE_HTTP_UPLOAD}/upload/${val.fileUrl}`,
                );
              }}
            >
              打开
            </Typography.Link>
            <Popconfirm
              title="确认删除此文件吗？"
              onConfirm={() => {
                return ProjectApi.file
                  .delete({
                    id: val.id,
                  })
                  .then(() => {
                    actionRef.current?.reload();
                    message.success("操作成功");
                  });
              }}
            >
              <Typography.Link type="danger">删除</Typography.Link>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <ProTable
        actionRef={actionRef}
        search={false}
        scroll={{ x: "max-content" }}
        rowKey={"id"}
        request={async () => {
          if (!info || isNil(searchData.unitProjectId)) return { data: [] };
          const res = await ProjectApi.file.getList({
            id: info.id,
            unitProjectId: searchData.unitProjectId,
          });
          return {
            data: res.data,
            success: true,
            total: res.totalRow,
          };
        }}
        bordered
        columns={columns}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        toolBarRender={() => [
          selectView2File,
          <UploadFile
            id={info?.id}
            unitProjectId={searchData.unitProjectId}
            onSuccess={() => {
              actionRef.current?.reload();
            }}
          />,
        ]}
        toolbar={{
          settings: [],
        }}
      />
    </div>
  );
};

export default FileList;
