import React, { useState } from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { FiHeart } from "react-icons/fi";

const CardJob = ({
  job = {
    id: 1,
    title: "Trưởng Phòng Kinh Doanh - P.GĐS Bất Động Sản",
    company: "CÔNG TY CỔ PHẦN HANA HOME",
    logo: "https://via.placeholder.com/60",
    salary: "15 - 35 triệu",
    location: "Hồ Chí Minh",
    exp: "2 năm",
    deadline: "Còn 27 ngày",
    description: [
      "Tuyển dụng, quản lý và phát triển đội ngũ nhân viên kinh doanh BDS.",
      "Xây dựng chiến lược kinh doanh, đặt mục tiêu doanh thu & KPI cho phòng kinh doanh.",
      "Xây dựng kịch bản bán hàng tiêu chuẩn, đào tạo kiến thức và kỹ năng cho nhân viên.",
      "Đề xuất, phân tích số liệu kinh doanh báo cáo định kỳ.",
      "Đảm bảo nguồn lực cần thiết để đạt hiệu suất tối đa.",
      "Nghiên cứu thị trường, đề xuất chiến lược marketing & kinh doanh hiệu quả.",
    ],
  },
  onSave,
  onApply,
  onDetail,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className="shadow-sm border-0 h-100"
      onClick={() => setExpanded(!expanded)}
      style={{ cursor: "pointer" }}
    >
      <Card.Body>
        <div className="d-flex gap-2 align-items-start">
          <img
            src={job.logo}
            alt={job.company}
            width={56}
            height={56}
            style={{ borderRadius: 10, objectFit: "cover" }}
          />
          <div className="flex-grow-1">
            <div className="fw-semibold text-truncate">{job.title}</div>
            <div className="text-muted small">{job.company}</div>
            <div className="d-flex flex-wrap gap-2 mt-2">
              <Badge bg="light" text="dark" className="border">
                {job.salary}
              </Badge>
              <Badge bg="light" text="dark" className="border">
                {job.location}
              </Badge>
              {expanded && (
                <>
                  <Badge bg="light" text="dark" className="border">
                    {job.exp}
                  </Badge>
                  <Badge bg="light" text="dark" className="border">
                    {job.deadline}
                  </Badge>
                </>
              )}
            </div>
          </div>
          <Button
            variant="light"
            className="border rounded-circle p-2"
            onClick={(e) => {
              e.stopPropagation();
              onSave?.(job);
            }}
          >
            <FiHeart />
          </Button>
        </div>

        {expanded && (
          <div className="mt-3">
            <div className="fw-semibold mb-2">Mô tả công việc</div>
            <ul className="small text-muted ps-3">
              {job.description.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
            <div className="d-flex gap-2 mt-3">
              <Button
                variant="outline-success"
                onClick={(e) => {
                  e.stopPropagation();
                  onApply?.(job);
                }}
              >
                Ứng tuyển
              </Button>
              <Button
                variant="success"
                onClick={(e) => {
                  e.stopPropagation();
                  onDetail?.(job);
                }}
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CardJob;
