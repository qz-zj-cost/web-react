import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import { RcFile } from "antd/es/upload";
import { UploadFile } from "antd/lib/upload/interface";
import { isArray } from "lodash";
import { useMemo, useState } from "react";
import { IUploadBaseProps } from "./types";
import { useUpload } from "./useUpload";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const UploadCards = <T extends any>({
  value,
  onChange,
  value2List,
  list2value,
  mode = "multiple",
  url,
  params,
  ...props
}: IUploadBaseProps<T>) => {
  const { customRequest, getFileList, setFileList, loading } = useUpload(
    url,
    value2List,
    params,
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );
  const handleChange = (list: UploadFile[]) => {
    setFileList(list.length > 0 ? list : void 0);
    if (list2value) {
      const __value = list2value(list);
      onChange?.(__value);
    }
  };
  const getDisabled = useMemo(() => {
    if (mode === "signle") {
      if (isArray(value)) {
        return value.length > 0 ? true : false;
      } else {
        return !!value || loading ? true : false;
      }
    } else {
      if (isArray(value) && props.maxCount && value.length >= props.maxCount)
        return true;
      return false;
    }
  }, [value, mode, props.maxCount, loading]);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  return (
    <>
      <Upload
        customRequest={customRequest}
        fileList={getFileList(value)}
        onChange={({ fileList }) => {
          handleChange(fileList);
        }}
        onPreview={handlePreview}
        listType="picture-card"
        {...props}
      >
        {getDisabled ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadCards;
