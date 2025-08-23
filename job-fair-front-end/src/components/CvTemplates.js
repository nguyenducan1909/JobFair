// Mỗi template có: id, name, tags, layout, accent, font, thumbUrl?, isNew?, initial (PREFILL)

export const CV_TEMPLATES = [
  {
    id: "std",
    name: "Tiêu chuẩn",
    tags: ["Đơn giản", "ATS"],
    layout: "classic",
    accent: "#1d7ed8",
    font: "Roboto, Arial, sans-serif",
    isNew: false,
    initial: {
      name: "Lê Quang Dũng",
      title: "Sales Executive",
      birthDate: "19/05/1992",
      email: "dung.le@example.com",
      phone: "0901 234 567",
      website: "linkedin.com/in/dungle",
      address: "Quận 1, TP.HCM",
      summary:
        "Nhân viên kinh doanh 3+ năm kinh nghiệm B2B. Thế mạnh: tìm kiếm khách hàng mới, tư vấn giải pháp và chốt deal. KPI trung bình 120%/năm.",
      skills: ["Giao tiếp", "Đàm phán", "CRM (HubSpot)", "Tin học văn phòng"],
      experience: [
        {
          company: "Công ty ABC",
          role: "Sales Executive",
          start: "2021",
          end: "Hiện tại",
          description:
            "- Quản lý 80+ tài khoản khách hàng doanh nghiệp\n- Chốt 40+ hợp đồng/năm, doanh thu 8 tỷ",
        },
        {
          company: "Startup XYZ",
          role: "Sales Associate",
          start: "2019",
          end: "2021",
          description: "- Telesales và demo sản phẩm SaaS\n- Hỗ trợ triển khai sau bán",
        },
      ],
      education: [
        {
          school: "ĐH Kinh tế TP.HCM",
          degree: "Cử nhân Quản trị Kinh doanh",
          start: "2015",
          end: "2019",
          description: "GPA 3.3/4.0 • CLB Marketing",
        },
      ],
      awards: [{ year: "2023", title: "Top 5 Sales", description: "Công ty ABC" }],
      avatarDataUrl: "",
    },
  },
  {
    id: "elegant",
    name: "Thanh lịch",
    tags: ["Đơn giản", "Hiện đại", "ATS"],
    layout: "classic",
    accent: "#b91c1c",
    font: "'Times New Roman', serif",
    isNew: true,
    initial: {
      name: "Nguyễn Quỳnh Như",
      title: "Quản lý nhà hàng",
      birthDate: "12/10/1995",
      email: "nhu.nguyen@example.com",
      phone: "0902 111 222",
      website: "fb.com/nhu.nguyen",
      address: "Q. Phú Nhuận, TP.HCM",
      summary:
        "5 năm kinh nghiệm quản lý vận hành F&B. Tối ưu chi phí 12% và nâng điểm hài lòng khách hàng từ 4.2→4.7/5.",
      skills: ["Quản lý ca", "Đào tạo nhân sự", "Kiểm soát chi phí", "Excel"],
      experience: [
        {
          company: "Chuỗi Nhà hàng Mộc",
          role: "Restaurant Manager",
          start: "2020",
          end: "Hiện tại",
          description:
            "- Quản lý 30 nhân sự • Lập lịch ca • Kiểm soát kho\n- Xây quy trình phục vụ chuẩn hóa toàn hệ thống",
        },
        {
          company: "Nhà hàng Biển Xanh",
          role: "Supervisor",
          start: "2018",
          end: "2020",
          description: "- Giám sát dịch vụ • Xử lý khiếu nại • Training",
        },
      ],
      education: [
        {
          school: "CĐ Du lịch Sài Gòn",
          degree: "Quản trị Nhà hàng – Khách sạn",
          start: "2015",
          end: "2018",
          description: "",
        },
      ],
      awards: [{ year: "2022", title: "Quản lý xuất sắc quý 4", description: "" }],
      avatarDataUrl: "",
    },
  },
  {
    id: "senior",
    name: "Senior",
    tags: ["Đơn giản", "ATS"],
    layout: "timeline",
    accent: "#111827",
    font: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    isNew: false,
    initial: {
      name: "Đặng Ngọc Linh",
      title: "Software Engineer (Backend)",
      birthDate: "03/03/1990",
      email: "linh.dang@example.com",
      phone: "0987 555 444",
      website: "github.com/linhdang",
      address: "Hà Nội",
      summary:
        "Kỹ sư backend 8+ năm với Go/Python. Thiết kế hệ thống microservices, tối ưu throughput 2.5×, latency P95 < 120ms.",
      skills: [
        "Golang",
        "Python",
        "PostgreSQL",
        "Redis",
        "Kafka",
        "Docker/K8s",
        "CI/CD",
        "AWS",
      ],
      experience: [
        {
          company: "Fintech Z",
          role: "Senior Backend Engineer",
          start: "2021",
          end: "Hiện tại",
          description:
            "- Thiết kế dịch vụ thanh toán (TPS 3k)\n- Áp dụng CQRS/Event Sourcing, giám sát Prometheus/Grafana",
        },
        {
          company: "E-commerce Y",
          role: "Backend Engineer",
          start: "2017",
          end: "2021",
          description: "- Xây dựng module giỏ hàng & voucher\n- Viết test >85% coverage",
        },
      ],
      education: [
        {
          school: "ĐH Bách Khoa HN",
          degree: "Khoa học Máy tính",
          start: "2008",
          end: "2013",
          description: "",
        },
      ],
      awards: [{ year: "2023", title: "Best Engineer", description: "Fintech Z" }],
      avatarDataUrl: "",
    },
  },
  {
    id: "modern1",
    name: "Hiện Đại 1",
    tags: ["Đơn giản", "ATS"],
    layout: "classic",
    accent: "#0db68b",
    font: "Roboto, Arial, sans-serif",
    isNew: false,
    initial: {
      name: "Đỗ Quỳnh Mai",
      title: "Content Marketing",
      birthDate: "",
      email: "mai.do@example.com",
      phone: "0933 777 999",
      website: "behance.net/maido",
      address: "TP.Thủ Đức",
      summary:
        "Content creator đa nền tảng. Tăng 250% reach tự nhiên sau 6 tháng. Thành thạo SEO on-page.",
      skills: ["SEO", "Copywriting", "Social Media", "Canva", "Google Analytics"],
      experience: [
        {
          company: "Agency V",
          role: "Content Executive",
          start: "2022",
          end: "Hiện tại",
          description:
            "- Lập kế hoạch nội dung cho 6 brand\n- Viết 80+ bài SEO, 20+ kịch bản video",
        },
      ],
      education: [
        { school: "ĐH KHXH&NV", degree: "Truyền thông", start: "2018", end: "2022" },
      ],
      awards: [],
      avatarDataUrl: "",
    },
  },
  {
    id: "expert",
    name: "Chuyên gia",
    tags: ["Đơn giản", "ATS"],
    layout: "timeline",
    accent: "#0f172a",
    font: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    isNew: false,
    initial: {
      name: "Nguyễn Tùng Dương",
      title: "Product Manager",
      email: "duong.nguyen@example.com",
      phone: "0968 888 222",
      website: "duongnguyen.me",
      address: "Hà Nội",
      summary:
        "PM 6+ năm. Dẫn dắt squad 10 người, triển khai A/B testing tăng CR +18%. Thành thạo discovery & prioritization.",
      skills: ["Product Discovery", "A/B Testing", "SQL", "Jira", "Roadmap"],
      experience: [
        {
          company: "Tech Platform P",
          role: "Senior PM",
          start: "2021",
          end: "Hiện tại",
          description:
            "- Quản lý funnel tìm kiếm → nộp đơn, CR +18%\n- Xây OKR & phối hợp đa phòng ban",
        },
        {
          company: "Startup Q",
          role: "Product Owner",
          start: "2019",
          end: "2021",
          description: "- Xây backlog & user story map\n- Làm việc sát với nhóm data",
        },
      ],
      education: [
        { school: "NEU", degree: "Kinh tế", start: "2013", end: "2017", description: "" },
      ],
      awards: [],
      avatarDataUrl: "",
    },
  },
];

// Helper: tạo initialData đúng định dạng mà CvEditor cần
export const toInitialData = (tpl) => ({
  templateId: tpl.id,
  themeColor: tpl.accent,
  fontFamily: tpl.font,
  template: tpl.layout, // 'classic' | 'timeline'
  ...tpl.initial,
});

