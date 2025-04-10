import ChangePasswordForm from "@/src/components/auth/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Đổi mật khẩu</h1>
        <ChangePasswordForm />
      </div>
    </div>
  );
}