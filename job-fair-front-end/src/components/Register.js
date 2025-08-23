// src/pages/Register.jsx
import React, { useState } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints } from "../configs/Apis";   // <-- dùng instance đã cấu hình
import ENV from "../configs/env";
import axios from "axios"; // chỉ để upload Cloudinary (giữ nguyên)

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    avatar: "", // URL sau khi upload Cloudinary
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const handleAvatarUpload = async () => {
    const formData = new FormData();
    formData.append("file", avatarFile);
    formData.append("upload_preset", ENV.CLOUDINARY_UPLOAD_PRESET);

    const res = await axios.post(ENV.CLOUDINARY_API, formData);
    return res.data.secure_url;
  };

  const sendOTP = async () => {
    const otp = generateOTP();
    setGeneratedOTP(otp);

    await emailjs.send(
      "service_tlbdpyg",
      "template_xu1kqlo",
      {
        to_email: form.email,
        otp_code: otp,
      },
      "pMlJ1FSBKzh_30n19"
    );
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,25}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.userName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !avatarFile
    ) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc và chọn ảnh đại diện.");
      return;
    }

    if (!validatePassword(form.password)) {
      setError(
        "Mật khẩu phải từ 6 - 25 ký tự, bao gồm chữ hoa, chữ thường và ký tự đặc biệt."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không trùng khớp.");
      return;
    }

    try {
      setLoading(true);

      // 1) Upload avatar lên Cloudinary
      const avatarUrl = await handleAvatarUpload();
      setForm((prev) => ({ ...prev, avatar: avatarUrl }));

      // 2) Gửi OTP qua email
      await sendOTP();

      setStep(2);
      setSuccess("Mã OTP đã được gửi đến Gmail!");
    } catch (err) {
      console.error(err);
      setError(
        err?.message ||
          "Có lỗi xảy ra khi tải ảnh hoặc gửi OTP. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setSuccess("");

    if (form.otp !== generatedOTP) {
      setError("Mã OTP không chính xác!");
      return;
    }

    try {
      setLoading(true);

      // 3) OTP đúng -> gọi API đăng ký
      const payload = {
        username: form.userName, // map theo backend
        email: form.email,
        password: form.password,
        avatar: form.avatar, // URL Cloudinary
      };

      // Dùng instance Apis và endpoints đã cấu hình
      const res = await Apis.post(endpoints.register, payload);
      // Tuỳ backend: có thể trả user info / message
      setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
      // Điều hướng sang login
      navigate("/login");
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Đăng ký thất bại. Vui lòng thử lại.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: "500px", marginTop: "50px" }}>
      <h3 className="mb-4 text-center text-success">Đăng ký tài khoản</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {step === 1 ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Tên người dùng<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Email <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Mật khẩu <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Form.Text className="text-muted">
              Mật khẩu từ 6 - 25 ký tự, bao gồm chữ hoa, chữ thường và ký tự
              đặc biệt.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Xác nhận mật khẩu <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Ảnh đại diện <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              required
            />
          </Form.Group>

          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Gửi mã OTP"}
          </Button>
        </Form>
      ) : (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
        >
          <Form.Group className="mb-3">
            <Form.Label>Nhập mã OTP đã gửi tới Gmail</Form.Label>
            <Form.Control
              type="text"
              required
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
            />
          </Form.Group>
          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Xác nhận"}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default Register;
