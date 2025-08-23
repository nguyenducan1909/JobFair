import React, { useState } from "react";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import { FiFilter } from "react-icons/fi";

const FilterLocation = ({
  label = "Lọc theo:",
  defaultText = "Địa điểm",
  locations = ["Toàn quốc", "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Bắc Ninh", "Hải Phòng"],
  onChange,
}) => {
  const [selected, setSelected] = useState(defaultText);

  const handleSelect = (loc) => {
    setSelected(loc);
    onChange?.(loc);
  };

  return (
    <Dropdown as={ButtonGroup}>
      <Dropdown.Toggle
        variant="light"
        id="dropdown-location-filter"
        className="shadow-sm border rounded px-3 d-flex align-items-center bg-white"
      >
        <FiFilter className="me-2 text-secondary" />
        <span className="text-muted me-1">{label}</span>
        <span className="fw-semibold text-dark">{selected}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {locations.map((loc) => (
          <Dropdown.Item
            key={loc}
            active={loc === selected}
            onClick={() => handleSelect(loc)}
          >
            {loc}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FilterLocation;
