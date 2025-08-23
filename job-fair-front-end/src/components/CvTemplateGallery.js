import React, { useMemo, useState } from "react";
import { Row, Col, Card, Button, Badge, Form, Stack } from "react-bootstrap";

const PlaceholderPreview = ({ color = "#1d7ed8" }) => (
  <div
    className="border rounded bg-white"
    style={{ aspectRatio: "1 / 1.414", padding: 10, overflow: "hidden" }}
  >
    {/* header */}
    <div
      style={{
        height: 10,
        width: "60%",
        background: color,
        borderRadius: 4,
        marginTop: 6,
      }}
    />
    <div style={{ color: "#666", fontSize: 10, marginTop: 8 }}>CHỨC DANH</div>
    <hr className="my-2" />
    {/* body lines */}
    {[...Array(10)].map((_, i) => (
      <div
        key={i}
        style={{
          height: 8,
          borderRadius: 4,
          background: i % 3 === 0 ? "#e8eef9" : "#f1f3f5",
          width: `${70 + (i % 4) * 6}%`,
          marginBottom: 6,
        }}
      />
    ))}
  </div>
);

const TemplateCard = ({ t, onSelect, onPreview }) => (
  <Card className="h-100 shadow-sm">
    <div className="position-relative">
      {t.isNew && (
        <Badge bg="success" className="position-absolute top-0 start-0 m-2">
          Mới
        </Badge>
      )}
      <div className="p-2">
        {t.thumbUrl ? (
          <img
            src={t.thumbUrl}
            alt={t.name}
            style={{ width: "100%", borderRadius: 6, aspectRatio: "1 / 1.414", objectFit: "cover" }}
          />
        ) : (
          <PlaceholderPreview color={t.accent || "#1d7ed8"} />
        )}
      </div>
    </div>

    <Card.Body className="d-flex flex-column">
      <div className="fw-semibold mb-1">{t.name}</div>
      <div className="d-flex flex-wrap gap-1 mb-3">
        {(t.tags || []).map((tag) => (
          <Badge key={tag} bg="light" text="dark" style={{ border: "1px solid #e5e7eb" }}>
            {tag}
          </Badge>
        ))}
      </div>
      <div className="mt-auto d-flex gap-2">
        <Button variant="success" className="flex-fill" onClick={() => onSelect?.(t)}>
          Dùng mẫu
        </Button>
        <Button variant="outline-secondary" onClick={() => onPreview?.(t)}>
          Xem
        </Button>
      </div>
    </Card.Body>
  </Card>
);

/**
 * CvTemplateGallery
 * props:
 *  - templates: [{id, name, tags:[], thumbUrl?, accent?, isNew?}]
 *  - onSelect(template)
 *  - onPreview(template)
 */
const CvTemplateGallery = ({ templates = [], onSelect, onPreview }) => {
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState([]);

  const allTags = useMemo(
    () => Array.from(new Set(templates.flatMap((t) => t.tags || []))),
    [templates]
  );

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return templates.filter((t) => {
      const matchTerm =
        !term ||
        t.name.toLowerCase().includes(term) ||
        (t.tags || []).some((tg) => tg.toLowerCase().includes(term));
      const matchTags =
        activeTags.length === 0 ||
        activeTags.every((tg) => (t.tags || []).includes(tg));
      return matchTerm && matchTags;
    });
  }, [templates, search, activeTags]);

  const toggleTag = (tg) =>
    setActiveTags((cur) =>
      cur.includes(tg) ? cur.filter((x) => x !== tg) : [...cur, tg]
    );

  return (
    <div>
      {/* Controls */}
      <Stack
        direction="horizontal"
        gap={2}
        className="mb-3 flex-wrap align-items-center"
      >
        <Form.Control
          placeholder="Tìm template theo tên hoặc tag…"
          style={{ maxWidth: 380 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="d-flex flex-wrap gap-2 ms-auto">
          {allTags.map((tg) => (
            <Button
              key={tg}
              size="sm"
              variant={activeTags.includes(tg) ? "success" : "outline-secondary"}
              onClick={() => toggleTag(tg)}
            >
              {tg}
            </Button>
          ))}
          {activeTags.length > 0 && (
            <Button size="sm" variant="outline-danger" onClick={() => setActiveTags([])}>
              Xóa lọc
            </Button>
          )}
        </div>
      </Stack>

      {/* Grid */}
      <Row xs={1} sm={2} md={3} lg={3} className="g-3">
        {filtered.map((t) => (
          <Col key={t.id}>
            <TemplateCard t={t} onSelect={onSelect} onPreview={onPreview} />
          </Col>
        ))}
        {filtered.length === 0 && (
          <Col>
            <div className="text-muted">Không tìm thấy template phù hợp.</div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default CvTemplateGallery;
