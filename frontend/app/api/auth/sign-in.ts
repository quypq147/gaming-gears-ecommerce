export async function POST(req: Request) {
    const { identifier, password } = await req.json();
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Sai tài khoản hoặc mật khẩu" }), { status: 400 });
    }
  
    // Lưu Token và Role vào localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("role", data.user.role.name);
    }
  
    return new Response(JSON.stringify({ message: "Đăng nhập thành công" }), { status: 200 });
  }
  