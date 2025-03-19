"use client";

import { useUser } from "@clerk/nextjs"; // Lấy thông tin từ Clerk
import { useEffect, useState } from "react";
import updateUser from "../api/updateUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function UserProfile() {
    const { user } = useUser();
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.fullName || "");
            setAvatar(user.imageUrl || "");
        }
    }, [user]);

    const handleUpdate = async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            await updateUser(user.id, { name, avatar });
            toast.success("Thông tin đã được cập nhật!");
        } catch (error) {
            toast.error("Cập nhật thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-4">Hồ sơ của bạn</h1>
                
                <div className="flex flex-col items-center">
                    <Image src={avatar} alt="Avatar" className="w-24 h-24 rounded-full mb-4" />
                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-4" />
                </div>

                <Button onClick={handleUpdate} disabled={isLoading} className="w-full">
                    {isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                </Button>
            </div>
        </div>
    );
}
