import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

const SearchBar = ({
  onSearch,
  categories = [
    "Tất cả ngành nghề",
    "Kinh doanh/ Bán hàng",
    "CNTT/ Lập trình",
    "Thiết kế/ Sáng tạo",
    "Kế toán/ Tài chính",
  ],
  locations = ["Toàn quốc", "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ"],
  // độ rộng tối đa của khối search ở giữa
  maxCol = { xs: 12, md: 10, lg: 8, xl: 7 },
}) => {
  const [category, setCategory] = useState(categories[0]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState(locations[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ category, keyword: keyword.trim(), location });
  };

  return (
    <Container className="my-4" >
      <Row className="justify-content-center">
        <Col xs={maxCol.xs} md={maxCol.md} lg={maxCol.lg} xl={maxCol.xl}>
          {/* ===== Mobile layout (xs–sm): xếp dọc) ===== */}
          <Form onSubmit={handleSubmit} className="d-md-none">
            <Form.Label className="fw-semibold">Tìm việc làm</Form.Label>

            <div className="mb-2">
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start">
                  {category}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  {categories.map((c) => (
                    <Dropdown.Item key={c} active={c === category} onClick={() => setCategory(c)}>
                      {c}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <Form.Control
              className="mb-2"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Vị trí tuyển dụng, tên công ty"
            />

            <div className="mb-3">
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start">
                  {location}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  {locations.map((l) => (
                    <Dropdown.Item key={l} active={l === location} onClick={() => setLocation(l)}>
                      {l}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <Button type="submit" variant="success" className="w-100">
              Tìm kiếm
            </Button>

            <div className="text-secondary small mt-2 d-flex flex-wrap gap-3">
              <span>Ngành: <strong className="text-dark">{category}</strong></span>
              <span>Địa điểm: <strong className="text-dark">{location}</strong></span>
            </div>
          </Form>

          {/* ===== Desktop layout (≥ md): thanh pill gọn giữa) ===== */}
          <Form onSubmit={handleSubmit} role="search" aria-label="Tìm kiếm việc làm" className="d-none d-md-block">
            <InputGroup className="shadow-sm border rounded-pill overflow-hidden bg-white">
              {/* Category */}
              <Dropdown>
                <Dropdown.Toggle
                  id="dropdown-category"
                  variant="light"
                  className="border-0 rounded-0 px-3 d-flex align-items-center text-truncate"
                  style={{ background: "transparent", maxWidth: 260 }}
                  aria-label="Chọn ngành nghề"
                >
                  <span className="me-2">☰</span>
                  <span className="text-truncate">{category}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {categories.map((c) => (
                    <Dropdown.Item key={c} active={c === category} onClick={() => setCategory(c)}>
                      {c}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <span className="vr my-2" />

              {/* Keyword */}
              <Form.Control
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Vị trí tuyển dụng, tên công ty"
                aria-label="Từ khóa"
                className="border-0 px-3"
              />

              <span className="vr my-2" />

              {/* Location */}
              <DropdownButton
                align="end"
                id="dropdown-location"
                variant="light"
                title={
                  <span className="d-flex align-items-center text-truncate" style={{ maxWidth: 180 }}>
                    {location}
                  </span>
                }
              >
                {locations.map((l) => (
                  <Dropdown.Item key={l} active={l === location} onClick={() => setLocation(l)}>
                    {l}
                  </Dropdown.Item>
                ))}
              </DropdownButton>

              {/* Submit */}
              <Button
                type="submit"
                variant="success"
                className="rounded-pill ms-2 my-2 me-2 px-4 d-inline-flex align-items-center"
              >
                Tìm kiếm
              </Button>
            </InputGroup>

            <div className="text-secondary small mt-2 d-flex flex-wrap gap-3">
              <span>Ngành: <strong className="text-dark">{category}</strong></span>
              <span>Địa điểm: <strong className="text-dark">{location}</strong></span>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchBar;
