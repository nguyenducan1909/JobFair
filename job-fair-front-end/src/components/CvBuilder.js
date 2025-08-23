import React, { useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CvTemplateGallery from "./CvTemplateGallery";
import CvEditor from "./CvEditor";
import { CV_TEMPLATES, toInitialData } from "./CvTemplates";

const CvBuilder = () => {
  const [initialData, setInitialData] = useState(null);

  const handleUseTemplate = (tpl) => {
    // nạp dữ liệu mẫu/preset theo template đã chọn
    setInitialData(toInitialData(tpl));
  };

  const handleBack = () => setInitialData(null);

  const currentTplName = useMemo(() => {
    if (!initialData) return "";
    const found = CV_TEMPLATES.find((t) => t.id === initialData.templateId);
    return found?.name || "";
  }, [initialData]);

  return (
    <div className="container py-4">
      {!initialData ? (
        <>
          <h4 className="mb-3">Chọn mẫu CV</h4>
          <CvTemplateGallery
            templates={CV_TEMPLATES}
            onSelect={handleUseTemplate}
            onPreview={(tpl) => alert(`Xem nhanh: ${tpl.name}`)}
          />
        </>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-outline-secondary" onClick={handleBack}>
              ← Quay lại danh sách mẫu
            </button>
            <div className="text-muted">
              Đang dùng mẫu: <strong>{currentTplName}</strong>
            </div>
          </div>

          {/* CvEditor nhận initialData và cho phép chỉnh sửa + xuất PDF */}
          <CvEditor
            initialData={initialData}
            onSave={(data) => {
              console.log("Lưu CV JSON:", data);
              // TODO: gọi API lưu CV tại đây
            }}
          />
        </>
      )}
    </div>
  );
};

export default CvBuilder;
