[English](https://github.com/quypq147/gaming-gears-ecommerce/blob/main/README.md) [Vietnamese](https://github.com/quypq147/gaming-gears-ecommerce/blob/main/README-VN.md)

# Dự án E-commerce

Đây là một dự án e-commerce full-stack với backend sử dụng Strapi và frontend sử dụng Next.js.

## Bắt đầu

### Yêu cầu

Hãy đảm bảo rằng bạn đã cài đặt các công cụ sau trên máy của mình:

- **Node.js**: Yêu cầu để chạy frontend và backend.
- **npm, yarn, pnpm, hoặc bun**: Trình quản lý gói để cài đặt các phụ thuộc.

---

### Chạy Server Phát Triển

#### Backend

1. Điều hướng đến thư mục `backend` và cài đặt các phụ thuộc:

   ```bash
   cd backend
   npm install
   ```

2. Sau đó, chạy server phát triển:

   ```bash
   npm run develop
   ```
#### Frontend

1. Điều hướng đến thư mục `frontend` và cài đặt các phụ thuộc:

   ```bash
   cd frontend
   npm install
   ```

2. Sau đó, chạy server phát triển:

   ```bash
   npm run dev
   ```

   Mở [http://localhost:3000](http://localhost:3000) với trình duyệt của bạn để xem kết quả.

   Bạn có thể bắt đầu chỉnh sửa trang bằng cách sửa đổi `app/page.tsx`. Trang sẽ tự động cập nhật khi bạn chỉnh sửa tệp.


   

### Biến Môi Trường

Hãy đảm bảo cấu hình các biến môi trường của bạn. Bạn có thể sử dụng các tệp `.env.example` được cung cấp trong cả hai thư mục frontend và backend làm tham chiếu.

## Cấu Trúc Dự Án

### Frontend
- `src/`: Thư mục chứa dự án
- `app/`: Các trang và thành phần chính của ứng dụng
- `assets/`: Tài nguyên tĩnh như hình ảnh và kiểu dáng
- `components/`: Các thành phần UI có thể tái sử dụng
- `context/`: Các nhà cung cấp ngữ cảnh React

### Backend

- `app/`: Các tệp ứng dụng Strapi
- `config/`: Các tệp cấu hình cho Strapi
- `data/`: Dữ liệu hạt giống cho cơ sở dữ liệu
- `database/`: Cấu hình cơ sở dữ liệu và di chuyển
- `public/`: Tài nguyên công khai được phục vụ bởi Strapi
- `src/`: Mã nguồn cho các plugin và tiện ích mở rộng Strapi tùy chỉnh
- `types/`: Các loại TypeScript

## Tìm Hiểu Thêm

Để tìm hiểu thêm về các công nghệ được sử dụng trong dự án này, hãy xem các tài liệu sau:

- [Tài liệu Next.js](https://nextjs.org/docs) - tìm hiểu về các tính năng và API của Next.js.
- [Học Next.js](https://nextjs.org/learn) - một hướng dẫn tương tác về Next.js.
- [Tài liệu Strapi](https://strapi.io/documentation) - tìm hiểu về các tính năng và API của Strapi.

Bạn có thể xem [kho lưu trữ GitHub của Next.js](https://github.com/vercel/next.js) và [kho lưu trữ GitHub của Strapi](https://github.com/strapi/strapi) - phản hồi và đóng góp của bạn được hoan nghênh!

## Triển Khai trên Vercel

Cách dễ nhất để triển khai ứng dụng Next.js của bạn là sử dụng Nền tảng Vercel từ những người tạo ra Next.js.

Xem tài liệu [triển khai Next.js](https://nextjs.org/docs/deployment) của chúng tôi để biết thêm chi tiết.

## Triển Khai trên Heroku

Để triển khai backend Strapi trên Heroku, hãy làm theo [tài liệu triển khai Strapi](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/deployment.html#heroku).
