import React, { useMemo, useRef, useState } from "react";
import {
  Container, Row, Col, Card, Form, Button, Stack, Badge, InputGroup
} from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/** =======================
 *  CV EDITOR + PDF + TEMPLATES
 * ======================== */
const CvEditor = ({ initialData = {}, onSave = () => {} }) => {
  const defaults = {
    themeColor: "#1d7ed8",
    fontFamily: "Roboto, Arial, sans-serif",
    template: "classic", // 'classic' | 'timeline'
    name: "AN NGUYEN DUC",
    title: "NHÂN VIÊN KINH DOANH",
    birthDate: "19/05/1992",
    email: "email@domain.com",
    phone: "0123 456 789",
    website: "https://fb.com/topcv.vn",
    address: "Số 10, đường 10, TopCV",
    summary:
      "Áp dụng kinh nghiệm và kỹ năng bán hàng để mang lại giá trị cho khách hàng.",
    skills: ["Tin học văn phòng", "Tiếng Anh", "Kỹ năng giao tiếp"],
    experience: [
      {
        company: "Công ty ABC",
        role: "Nhân viên Kinh doanh",
        start: "2019",
        end: "2023",
        description:
          "- Tư vấn cho 200+ khách hàng doanh nghiệp\n- Đạt 125% KPI trung bình 4 quý",
      },
    ],
    education: [
      {
        school: "Đại học TOPCV",
        degree: "Cử nhân Quản trị Kinh doanh",
        start: "2010",
        end: "2014",
        description: "Tốt nghiệp loại Giỏi, GPA 8.0",
      },
    ],
    awards: [{ year: "2021", title: "Nhân viên xuất sắc", description: "" }],
    avatarDataUrl: "",
  };

  const [cv, setCv] = useState({ ...defaults, ...initialData });
  const [skillInput, setSkillInput] = useState("");
  const previewRef = useRef(null);

  // helpers
  const update = (k, v) => setCv((p) => ({ ...p, [k]: v }));
  const updateInArray = (key, idx, patch) =>
    setCv((p) => {
      const clone = [...p[key]];
      clone[idx] = { ...clone[idx], ...patch };
      return { ...p, [key]: clone };
    });
  const addToArray = (key, item) => setCv((p) => ({ ...p, [key]: [...p[key], item] }));
  const removeFromArray = (key, idx) =>
    setCv((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));

  const sectionStyle = useMemo(
    () => ({
      color: cv.themeColor,
      fontWeight: 700,
      borderBottom: `3px solid ${cv.themeColor}`,
      paddingBottom: 4,
      marginTop: 20,
      marginBottom: 10,
      textTransform: "uppercase",
      letterSpacing: ".5px",
    }),
    [cv.themeColor]
  );

  const handleImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => update("avatarDataUrl", e.target.result);
    reader.readAsDataURL(file);
  };

  // ===== Export PDF (đa trang, nét) =====
  const exportPDF = async () => {
    const node = previewRef.current;
    if (!node) return;

    // đảm bảo nền trắng & đủ rộng chuẩn A4 (~794px ở 96dpi)
    const canvas = await html2canvas(node, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      windowWidth: 900,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth();   // 210
    const pageH = pdf.internal.pageSize.getHeight();  // 297

    const imgWpx = canvas.width;
    const imgHpx = canvas.height;
    const pxPerMm = imgWpx / pageW;
    const pageHpx = pageH * pxPerMm;

    let y = 0;
    while (y < imgHpx) {
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = imgWpx;
      pageCanvas.height = Math.min(pageHpx, imgHpx - y);
      const ctx = pageCanvas.getContext("2d");
      ctx.drawImage(
        canvas,
        0, y, imgWpx, pageCanvas.height,     // src
        0, 0, imgWpx, pageCanvas.height      // dest
      );
      const img = pageCanvas.toDataURL("image/png");
      const hMm = pageCanvas.height / pxPerMm;
      pdf.addImage(img, "PNG", 0, 0, pageW, hMm, undefined, "FAST");
      y += pageCanvas.height;
      if (y < imgHpx) pdf.addPage();
    }

    pdf.save("CV.pdf");
  };

  // ===== Templates =====
  const ClassicTemplate = () => (
    <div style={{ fontFamily: cv.fontFamily }}>
      {/* Header */}
      <Row className="align-items-center">
        <Col md={8}>
          <div style={{ color: cv.themeColor, fontWeight: 800, fontSize: 28 }}>
            {cv.name}
          </div>
          <div className="text-uppercase fw-semibold" style={{ color: "#666" }}>
            {cv.title}
          </div>

          <Row className="mt-3">
            {[
              ["Ngày sinh", cv.birthDate],
              ["Điện thoại", cv.phone],
              ["Email", cv.email],
              ["Địa chỉ", cv.address],
              ["Website", cv.website],
            ].map(([label, value]) => (
              <Col xs={6} className="mb-2" key={label}>
                <div className="fw-semibold" style={{ color: cv.themeColor }}>
                  {label}
                </div>
                <div>{value}</div>
              </Col>
            ))}
          </Row>
        </Col>

        <Col md={4} className="text-center">
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              border: `4px solid ${cv.themeColor}`,
              overflow: "hidden",
              margin: "0 auto",
              display: "grid",
              placeItems: "center",
              color: "#888",
              background: "#f6f6f6",
            }}
          >
            {cv.avatarDataUrl ? (
              <img
                src={cv.avatarDataUrl}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className="small">Chưa có ảnh</div>
            )}
          </div>
        </Col>
      </Row>

      <div style={sectionStyle}>Mục tiêu nghề nghiệp</div>
      <div>{cv.summary}</div>

      <Row>
        <Col md={6}>
          <div style={sectionStyle}>Các kỹ năng</div>
          <ul className="mb-0">{cv.skills.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </Col>
        <Col md={6}>
          <div style={sectionStyle}>Danh hiệu & Giải thưởng</div>
          <ul className="mb-0">
            {cv.awards.map((a, i) => (
              <li key={i}>
                <strong>{a.year}:</strong> {a.title}
                {a.description ? ` – ${a.description}` : ""}
              </li>
            ))}
          </ul>
        </Col>
      </Row>

      <div style={sectionStyle}>Học vấn</div>
      {cv.education.map((e, i) => (
        <div key={i} className="mb-2">
          <div className="fw-semibold">{e.school}</div>
          <div className="text-muted">
            {e.degree} • {e.start} - {e.end}
          </div>
          {e.description && <div>{e.description}</div>}
        </div>
      ))}

      <div style={sectionStyle}>Kinh nghiệm làm việc</div>
      {cv.experience.map((ex, i) => (
        <div key={i} className="mb-2">
          <div className="fw-semibold">{ex.company}</div>
          <div className="text-muted">
            {ex.role} • {ex.start} - {ex.end}
          </div>
          {ex.description &&
            ex.description.split("\n").map((line, k) => <div key={k}>• {line}</div>)}
        </div>
      ))}
    </div>
  );

  const TimelineTemplate = () => (
    <div style={{ fontFamily: cv.fontFamily }}>
      {/* Header block */}
      <div
        style={{
          background: cv.themeColor,
          color: "white",
          padding: "16px 20px",
          borderRadius: 10,
          marginBottom: 14,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 26 }}>{cv.name}</div>
        <div className="text-uppercase">{cv.title}</div>
      </div>

      <Row className="g-3">
        <Col md={4}>
          <Card className="border-0">
            <Card.Body className="p-0">
              <div className="fw-semibold mb-2" style={{ color: cv.themeColor }}>
                Thông tin
              </div>
              <div className="small">
                <div><strong>Ngày sinh:</strong> {cv.birthDate}</div>
                <div><strong>Điện thoại:</strong> {cv.phone}</div>
                <div><strong>Email:</strong> {cv.email}</div>
                <div><strong>Địa chỉ:</strong> {cv.address}</div>
                <div><strong>Website:</strong> {cv.website}</div>
              </div>

              <div className="fw-semibold mt-3 mb-2" style={{ color: cv.themeColor }}>
                Kỹ năng
              </div>
              <ul className="mb-0">{cv.skills.map((s, i) => <li key={i}>{s}</li>)}</ul>

              <div className="fw-semibold mt-3 mb-2" style={{ color: cv.themeColor }}>
                Danh hiệu
              </div>
              <ul className="mb-0">
                {cv.awards.map((a, i) => (
                  <li key={i}><strong>{a.year}:</strong> {a.title}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <div className="fw-semibold mb-2" style={{ color: cv.themeColor }}>
            Mục tiêu nghề nghiệp
          </div>
          <div className="mb-3">{cv.summary}</div>

          {/* Timeline */}
          <div className="fw-semibold mb-2" style={{ color: cv.themeColor }}>
            Kinh nghiệm
          </div>
          <div style={{ position: "relative", paddingLeft: 18 }}>
            <div
              style={{
                position: "absolute", left: 6, top: 0, bottom: 0,
                width: 2, background: "#e5e7eb",
              }}
            />
            {cv.experience.map((ex, i) => (
              <div key={i} style={{ position: "relative", marginBottom: 14 }}>
                <div
                  style={{
                    position: "absolute", left: 0, top: 6,
                    width: 14, height: 14, borderRadius: "50%",
                    background: cv.themeColor,
                  }}
                />
                <div className="ms-4">
                  <div className="fw-semibold">{ex.company}</div>
                  <div className="text-muted">
                    {ex.role} • {ex.start} - {ex.end}
                  </div>
                  {ex.description &&
                    ex.description.split("\n").map((line, k) => (
                      <div key={k}>• {line}</div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="fw-semibold mt-3 mb-2" style={{ color: cv.themeColor }}>
            Học vấn
          </div>
          {cv.education.map((e, i) => (
            <div key={i} className="mb-2">
              <div className="fw-semibold">{e.school}</div>
              <div className="text-muted">
                {e.degree} • {e.start} - {e.end}
              </div>
              {e.description && <div>{e.description}</div>}
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );

  const Template = cv.template === "timeline" ? TimelineTemplate : ClassicTemplate;

  return (
    <Container fluid className="py-3">
      <Row className="g-3">
        {/* ===== Left: Form editor ===== */}
        <Col md={5} lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <Stack direction="horizontal" gap={2}>
                <div className="fw-semibold">Tùy chỉnh</div>
                <div className="ms-auto d-flex align-items-center gap-2">
                  <Form.Label className="mb-0 small">Tông màu</Form.Label>
                  {["#1d7ed8", "#0db68b", "#ff7a00", "#e53935"].map((c) => (
                    <Button
                      key={c}
                      variant="light"
                      onClick={() => update("themeColor", c)}
                      style={{
                        height: 18, width: 18, padding: 0, borderRadius: "50%",
                        background: c, outline: cv.themeColor === c ? "2px solid #000" : "none",
                      }}
                      title={c}
                    />
                  ))}
                </div>
              </Stack>
            </Card.Header>

            <Card.Body>
              <Stack gap={2} className="mb-3">
                <InputGroup>
                  <InputGroup.Text>Font</InputGroup.Text>
                  <Form.Select
                    value={cv.fontFamily}
                    onChange={(e) => update("fontFamily", e.target.value)}
                  >
                    <option value="Roboto, Arial, sans-serif">Roboto</option>
                    <option value="Arial, Helvetica, sans-serif">Arial</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">
                      Segoe UI
                    </option>
                  </Form.Select>
                </InputGroup>

                <InputGroup>
                  <InputGroup.Text>Mẫu</InputGroup.Text>
                  <Form.Select
                    value={cv.template}
                    onChange={(e) => update("template", e.target.value)}
                  >
                    <option value="classic">Classic (cột song song)</option>
                    <option value="timeline">Timeline (2 cột + dòng thời gian)</option>
                  </Form.Select>
                </InputGroup>

                <Stack direction="horizontal" gap={2}>
                  <Button variant="success" onClick={() => onSave(cv)}>
                    Lưu CV
                  </Button>
                  <Button variant="outline-secondary" onClick={exportPDF}>
                    Xuất PDF
                  </Button>
                </Stack>
              </Stack>

              {/* ==== FORM THÔNG TIN ==== */}
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control value={cv.name} onChange={(e) => update("name", e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Chức danh</Form.Label>
                  <Form.Control value={cv.title} onChange={(e) => update("title", e.target.value)} />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Ngày sinh</Form.Label>
                      <Form.Control value={cv.birthDate} onChange={(e) => update("birthDate", e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Điện thoại</Form.Label>
                      <Form.Control value={cv.phone} onChange={(e) => update("phone", e.target.value)} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" value={cv.email} onChange={(e) => update("email", e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Website</Form.Label>
                      <Form.Control value={cv.website} onChange={(e) => update("website", e.target.value)} />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-2">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control value={cv.address} onChange={(e) => update("address", e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mục tiêu nghề nghiệp</Form.Label>
                  <Form.Control as="textarea" rows={3} style={{ resize: "none", overflowY: "auto" }} value={cv.summary} onChange={(e) => update("summary", e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Ảnh đại diện</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} />
                </Form.Group>

                {/* Skills */}
                <div className="mb-2 fw-semibold">Kỹ năng</div>
                <Stack direction="horizontal" gap={2} className="mb-2">
                  <Form.Control
                    placeholder="Nhập kỹ năng rồi nhấn Thêm"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (skillInput.trim()) addToArray("skills", skillInput.trim());
                        setSkillInput("");
                      }
                    }}
                  />
                  <Button onClick={() => { if (skillInput.trim()) addToArray("skills", skillInput.trim()); setSkillInput(""); }}>
                    Thêm
                  </Button>
                </Stack>
                <div className="mb-3 d-flex flex-wrap gap-2">
                  {cv.skills.map((s, i) => (
                    <Badge
                      bg="light" text="dark" key={`${s}-${i}`}
                      style={{ border: "1px solid #ddd", cursor: "pointer" }}
                      onClick={() => removeFromArray("skills", i)} title="Nhấn để xóa"
                    >
                      {s} ✕
                    </Badge>
                  ))}
                </div>

                {/* Experience */}
                <div className="fw-semibold mb-2">Kinh nghiệm làm việc</div>
                {cv.experience.map((exp, i) => (
                  <Card key={i} className="mb-2">
                    <Card.Body>
                      <Row className="g-2">
                        <Col md={6}>
                          <Form.Control placeholder="Công ty" value={exp.company}
                            onChange={(e) => updateInArray("experience", i, { company: e.target.value })} />
                        </Col>
                        <Col md={6}>
                          <Form.Control placeholder="Vị trí" value={exp.role}
                            onChange={(e) => updateInArray("experience", i, { role: e.target.value })} />
                        </Col>
                        <Col md={3}>
                          <Form.Control placeholder="Bắt đầu" value={exp.start}
                            onChange={(e) => updateInArray("experience", i, { start: e.target.value })} />
                        </Col>
                        <Col md={3}>
                          <Form.Control placeholder="Kết thúc" value={exp.end}
                            onChange={(e) => updateInArray("experience", i, { end: e.target.value })} />
                        </Col>
                        <Col md={12}>
                          <Form.Control as="textarea" rows={2} placeholder="Mô tả" value={exp.description} style={{ resize: "none", overflowY: "auto" }}
                            onChange={(e) => updateInArray("experience", i, { description: e.target.value })} />
                        </Col>
                      </Row>
                      <div className="text-end mt-2">
                        <Button size="sm" variant="outline-danger" onClick={() => removeFromArray("experience", i)}>Xóa</Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
                <Button className="mb-3" size="sm" variant="outline-primary"
                  onClick={() => addToArray("experience", { company: "", role: "", start: "", end: "", description: "" })}>
                  + Thêm kinh nghiệm
                </Button>

                {/* Education */}
                <div className="fw-semibold mb-2">Học vấn</div>
                {cv.education.map((ed, i) => (
                  <Card key={i} className="mb-2">
                    <Card.Body>
                      <Row className="g-2">
                        <Col md={6}>
                          <Form.Control placeholder="Trường" value={ed.school}
                            onChange={(e) => updateInArray("education", i, { school: e.target.value })} />
                        </Col>
                        <Col md={6}>
                          <Form.Control placeholder="Bằng cấp/Chuyên ngành" value={ed.degree}
                            onChange={(e) => updateInArray("education", i, { degree: e.target.value })} />
                        </Col>
                        <Col md={3}>
                          <Form.Control placeholder="Bắt đầu" value={ed.start}
                            onChange={(e) => updateInArray("education", i, { start: e.target.value })} />
                        </Col>
                        <Col md={3}>
                          <Form.Control placeholder="Kết thúc" value={ed.end}
                            onChange={(e) => updateInArray("education", i, { end: e.target.value })} />
                        </Col>
                        <Col md={12}>
                          <Form.Control as="textarea" rows={2} placeholder="Mô tả" value={ed.description} style={{ resize: "none", overflowY: "auto" }}
                            onChange={(e) => updateInArray("education", i, { description: e.target.value })} />
                        </Col>
                      </Row>
                      <div className="text-end mt-2">
                        <Button size="sm" variant="outline-danger" onClick={() => removeFromArray("education", i)}>Xóa</Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
                <Button size="sm" variant="outline-primary"
                  onClick={() => addToArray("education", { school: "", degree: "", start: "", end: "", description: "" })}>
                  + Thêm học vấn
                </Button>

                {/* Awards */}
                <div className="fw-semibold mb-2">Danh hiệu & Giải thưởng</div>
                {cv.awards.map((aw, i) => (
                  <Card key={i} className="mb-2">
                    <Card.Body>
                      <Row className="g-2">
                        <Col md={3}>
                          <Form.Control placeholder="Năm" value={aw.year}
                            onChange={(e) => updateInArray("awards", i, { year: e.target.value })} />
                        </Col>
                        <Col md={9}>
                          <Form.Control placeholder="Tiêu đề" value={aw.title}
                            onChange={(e) => updateInArray("awards", i, { title: e.target.value })} />
                        </Col>
                        <Col md={12}>
                          <Form.Control as="textarea" rows={2} placeholder="Mô tả" value={aw.description} style={{ resize: "none", overflowY: "auto" }}
                            onChange={(e) => updateInArray("awards", i, { description: e.target.value })} />
                        </Col>
                      </Row>
                      <div className="text-end mt-2">
                        <Button size="sm" variant="outline-danger" onClick={() => removeFromArray("awards", i)}>Xóa</Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
                <Button size="sm" variant="outline-primary"
                  onClick={() => addToArray("awards", { year: "", title: "", description: "" })}>
                  + Thêm giải thưởng
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* ===== Right: Preview (A4 width) ===== */}
        <Col md={7} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white text-center fw-semibold">Xem trước CV</Card.Header>
            <Card.Body style={{ background: "#f7f7f7" }}>
              <div
                ref={previewRef}
                style={{
                  width: 794,               // ~ A4 @96dpi
                  margin: "0 auto",
                  background: "white",
                  padding: 24,
                  boxShadow: "0 0 0 1px #eee",
                }}
              >
                <Template />
              </div>
            </Card.Body>
            <Card.Footer className="bg-white text-end">
              <Button variant="outline-secondary" onClick={exportPDF}>Xuất PDF</Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CvEditor;
