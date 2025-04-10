"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import Header from "@/src/components/header";
import { useUserStore } from "@/src/store/userStore";
import { Input } from "@/src/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LogoutButton from "@/src/components/auth/LogoutButton";
import { motion } from "framer-motion";
import { updateUser } from "@/src/api/user";
import { toast } from "react-hot-toast"; // Import thư viện react-hot-toast

export default function UserPage() {
  const user = useUserStore((state) => state.user);
  console.log("User in store:", user);
  const setUser = useUserStore((state) => state.setUser);

  const [fullName, setFullName] = useState(user?.fullName
    || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [birthdate, setBirthdate] = useState(user?.birthdate || "");
  const [gender, setGender] = useState(user?.gender || "male");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const updatedUser = await updateUser(user.id, {
        fullName, // Sửa lại từ "name" thành "fullName"
  email,
  phoneNumber, // Sửa lại từ "phone" thành "phoneNumber"
  birthdate,
  gender,
      });
      
      console.log("Updated user:", updatedUser);
      setUser(updatedUser); // Cập nhật thông tin người dùng trong store
      toast.success("Cập nhật thông tin thành công!"); // Hiển thị thông báo thành công
    } catch (err: any) {
      toast.error(err.message || "Cập nhật thông tin thất bại"); // Hiển thị thông báo lỗi
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-1/4 bg-white shadow-md p-4"
        >
          <div className="flex flex-col items-center">
            <motion.img
              src="/default-avatar.png"
              alt="User Avatar"
              className="w-20 h-20 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <h2 className="mt-2 text-lg font-semibold">{user?.username || "User"}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <nav className="mt-6 space-y-2">
            <Link
              href={`/user/${user?.id}`}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Hồ sơ
            </Link>
            <Link
              href={`/user/${user?.id}/orderHistory`}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Đơn hàng
            </Link>
            <Link
              href={`/user/${user?.id}/changePassword`}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Đổi mật khẩu
            </Link>
            <LogoutButton />
          </nav>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 bg-gray-50 p-6"
        >
          <h1 className="text-2xl font-bold mb-6">Thông tin người dùng</h1>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <Input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                <Input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                <RadioGroup
                  value={gender}
                  onValueChange={(value) => setGender(value)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center">
                    <RadioGroupItem value="male" id="male" />
                    <label htmlFor="male" className="ml-2 text-sm text-gray-700">
                      Nam
                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="female" id="female" />
                    <label htmlFor="female" className="ml-2 text-sm text-gray-700">
                      Nữ
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <Button
              className="mt-6"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
            </Button>
          </motion.div>
        </motion.main>
      </div>
    </>
  );
}
