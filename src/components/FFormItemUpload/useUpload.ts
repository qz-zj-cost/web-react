import HttpApi from "@/utils/https";
import { UploadProps } from "antd";
import { useCallback, useState } from "react";
import { value2List } from "./types";

export const useUpload = <T>(
  url: string,
  value2List?: value2List<T>,
  params?: Record<string, any>,
) => {
  const [fileList, setFileList] = useState<UploadProps["fileList"]>();
  const [loading, setLoading] = useState(false);
  const getFileList = useCallback(
    (value?: T): UploadProps["fileList"] => {
      if (value && !fileList) {
        const list = value2List?.(value);
        setFileList(list);
        return list;
      }
      if (fileList && fileList.length > 0 && !value) {
        return void 0;
      }
      return fileList;
    },
    [fileList, value2List],
  );
  const customRequest = (fileList: any) => {
    const data = new FormData();
    data.append("file", fileList.file);
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const item = params[key];
        data.append(key, item);
      }
    }
    setLoading(true);
    HttpApi.request({
      url: url,
      data,
      timeout: 3 * 60 * 1000,
      method: "POST",
      onUploadProgress: (progressEvent) => {
        const percent =
          Math.round((progressEvent.loaded / progressEvent.total!) * 10000) /
          100.0;
        fileList.onProgress({ percent });
      },
    })
      .then((res) => {
        fileList.onSuccess({ ...res.data });
      })
      .catch((err) => {
        fileList.onError(err, fileList);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return {
    fileList,
    setFileList,
    getFileList,
    customRequest,
    loading,
  };
};
