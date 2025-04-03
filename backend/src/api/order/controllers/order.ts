import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user; // Lấy thông tin người dùng từ JWT (nếu có)
      const {
        products, // Mảng sản phẩm, mỗi sản phẩm có { id, quantity, price }
        totalAmount,
        customerName,
        address,
        paymentMethod,
        phone_number,
        orderCode,
      } = ctx.request.body;

      // Kiểm tra các trường bắt buộc
      if (
        !products ||
        !totalAmount ||
        !customerName ||
        !address ||
        !paymentMethod ||
        !phone_number
      ) {
        return ctx.badRequest("Missing required fields.");
      }

      try {
        // Tạo đơn hàng mới
        const newOrder = await strapi.db.query("api::order.order").create({
          data: {
            totalAmount,
            customerName,
            address,
            paymentMethod,
            phone_number,
            orderCode,
            state: "pending", // Đặt trạng thái mặc định là "pending"
            users_permissions_user: user ? user.id : null, // Liên kết người dùng nếu đã đăng nhập
          },
        });

        // Tạo chi tiết đơn hàng
        const orderDetails = await Promise.all(
          products.map(async (product) => {
            // Kiểm tra sự tồn tại của sản phẩm
            const productExists = await strapi.db.query("api::product.product").findOne({
              where: { id: product.id },
            });

            if (!productExists) {
              throw new Error(`Product with ID ${product.id} does not exist.`);
            }
            if (productExists.stock < product.quantity) {
              throw new Error(
                `Product with ID ${product.id} does not have enough stock.`
              );
            }
            await strapi.db.query("api::product.product").update({
              where: { id: product.id },
              data: {
                stock: productExists.stock - product.quantity, // Giảm tồn kho
              },
            });

            // Tạo chi tiết đơn hàng
            return strapi.db.query("api::orders-detail.orders-detail").create({
              data: {
                quantity: product.quantity,
                price: product.price,
                product: product.id,
                order: newOrder.id, // Liên kết với đơn hàng
              },
            });
          })
        );

        // Trả về thông tin đơn hàng và chi tiết đơn hàng
        return {
          order: newOrder,
          orderDetails,
        };
      } catch (error) {
        strapi.log.error("Error creating order:", error);
        return ctx.internalServerError(
          "An error occurred while creating the order."
        );
      }
    },
    async find(ctx) {
      const user = ctx.state.user; // Lấy thông tin người dùng từ JWT
      if (!user) {
        return ctx.unauthorized("You must be logged in to view your orders.");
      }

      try {
        // Lọc đơn hàng theo người dùng
        const orders = await strapi.db.query("api::order.order").findMany({
          where: { users_permissions_user: user.id }, // Lọc theo ID người dùng
          populate: {
            orders_details: {
              populate: {
                product: true, // Populate thông tin sản phẩm trong chi tiết đơn hàng
              },
            },
            users_permissions_user: true, // Populate thông tin người dùng
          },
        });

        return orders;
      } catch (error) {
        strapi.log.error("Error fetching orders:", error);
        return ctx.internalServerError("An error occurred while fetching orders.");
      }
    },
  })
);
