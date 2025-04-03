"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { IoIosReturnLeft } from "react-icons/io";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import { Checkbox } from "@/src/components/ui/checkbox";
import { motion } from "framer-motion";
import { signUp } from "@/src/api/user";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Kiểm tra các điều kiện trước khi gửi form
    if (!termsAccepted) {
      toast.error("Bạn phải chấp nhận các điều khoản và điều kiện.");
      setLoading(false);
      return;
    }

    if (!recaptchaToken) {
      toast.error("Vui lòng hoàn thành reCAPTCHA.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp.");
      setLoading(false);
      return;
    }

    try {
      // Gọi API đăng ký
      const response = await signUp(name, email, password);

      toast.success("Tạo tài khoản thành công! Đang chuyển hướng...");

      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800"
    >
      <Toaster position="top-right" reverseOrder={false} />

      {/* Quay lại trang chủ */}
      <motion.div initial={{ x: -50 }} animate={{ x: 0 }}>
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition"
        >
          <IoIosReturnLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại trang chủ</span>
        </Link>
      </motion.div>

      {/* Form đăng ký */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-md bg-opacity-10 backdrop-blur-lg border border-gray-700 shadow-xl rounded-xl text-white">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">Tạo tài khoản</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.form
              onSubmit={handleSignUp}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Input
                type="text"
                placeholder="Tên người dùng"
                className="bg-gray-800 border-gray-600 focus:ring-2 focus:ring-blue-500 text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                className="bg-gray-800 border-gray-600 focus:ring-2 focus:ring-blue-500 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="relative">
                <Input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Mật khẩu (tối thiểu 8 ký tự)"
                  className="bg-gray-800 border-gray-600 focus:ring-2 focus:ring-blue-500 text-white pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="relative">
                <Input
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  className={`bg-gray-800 border-gray-600 focus:ring-2 focus:ring-blue-500 text-white pr-10 ${
                    confirmPassword && confirmPassword !== password ? "border-red-500" : ""
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                >
                  {confirmPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  Tôi chấp nhận{" "}
                  <Link
                    href="/terms"
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Điều khoản & Điều kiện
                  </Link>
                </label>
              </div>
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={(token) => setRecaptchaToken(token)}
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 transition"
                disabled={loading}
              >
                {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
              </Button>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}