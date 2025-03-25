import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DefaultAva from "@/assets/defaultAva.png";
import Header from "@/components/header";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function UserProfile({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/sign-in");
  if (!params.id) return notFound();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/${params.id}`,
      {
        headers: { Authorization: `Bearer ${session.user.jwt}` },
      }
    );

    if (!res.ok) {
      if (res.status === 404) return notFound();
      throw new Error("Failed to fetch user data");
    }

    const user = await res.json();
    const isCurrentUser = session.user.id === user.id;

    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
          <Card className="w-full max-w-2xl p-6 bg-gray-800 text-white shadow-lg rounded-xl">
            <CardHeader className="flex flex-col items-center">
              <Image
                src={user.avatar || DefaultAva}
                alt="User Avatar"
                width={80}
                height={80}
                className="rounded-full border border-gray-700"
              />
              <CardTitle className="mt-4 text-lg font-semibold">
                {user.username}
              </CardTitle>
            </CardHeader>

            <CardContent className="text-gray-300">
              <Tabs defaultValue="profile">
                <TabsList className="flex justify-center mb-4">
                  <TabsTrigger value="profile">Thông tin người dùng</TabsTrigger>
                  <TabsTrigger value="orders">Lịch sử đơn hàng</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <p className="mb-2">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="mb-2">
                    <strong>Tạo vào ngày:</strong>{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mb-2">
                    <strong>Vai trò:</strong> {user.role || "User"}
                  </p>

                  {isCurrentUser && (
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        Chỉnh thông tin người dùng
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="orders">
                  <p className="mb-2">
                    <strong>Lịch sử đơn hàng:</strong>
                  </p>
                  {/* Thêm mã để hiển thị lịch sử đơn hàng của người dùng */}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return <p className="text-red-500 text-center">Lỗi khi load dữ liệu người dùng.</p>;
  }
}
