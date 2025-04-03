"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import Header from "@/src/components/header";
import { useUserStore } from "@/src/store/userStore";
import { Input } from "@/src/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function UserPage() {
  const user = useUserStore((state) => state.user);
  console.log("User state" , user);

  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [birthdate, setBirthdate] = useState(user?.brithdate || "");
  const [gender, setGender] = useState(user?.gender || "male");

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white shadow-md p-4">
          <div className="flex flex-col items-center">
            
            <h2 className="mt-2 text-lg font-semibold">{user?.username || "User"}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <nav className="mt-6 space-y-2">
            <Link href={`/user/${user?.id}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Hồ sơ
            </Link>
            <Link href={`/user/${user?.id}/orderHistory`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Đơn hàng
            </Link> 
            <Link href={`/user/${user?.id}/changePassword`} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Đổi mật khẩu
            </Link>
            <Button variant="ghost" className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Đăng xuất
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-6">
          <h1 className="text-2xl font-bold mb-6">Thông tin người dùng</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
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
            <Button className="mt-6">Cập nhật thông tin</Button>
          </div>
        </main>
      </div>
    </>
  );
}
