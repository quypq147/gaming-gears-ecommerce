/**
 * review controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::review.review', ({ strapi }) => ({
  // Ghi đè hàm create để tự động gán người dùng hiện tại
  async create(ctx) {
    console.log("Headers:", ctx.request.headers);
    console.log("User in ctx.state:", ctx.state.user);
    const user = ctx.state.user; // Lấy thông tin người dùng từ JWT token
    if (!user) {
      return ctx.unauthorized("You must be logged in to submit a review");
    } // Lấy ID người dùng từ JWT token
    const { data } = ctx.request.body;

    // Gán người dùng hiện tại vào trường users_permissions_user
    data.users_permissions_user = user.id;

    // Gọi service để tạo đánh giá
    const response = await strapi.service('api::review.review').create({ data });
    return response;
  },

  // Ghi đè hàm find để populate thông tin người dùng và sản phẩm
  async find(ctx) {
    const response = await strapi.service('api::review.review').find({
      ...ctx.query,
      populate: ['users_permissions_user', 'product'], // Populate thông tin người dùng và sản phẩm
    });
    return response;
  },

  // Ghi đè hàm findOne để populate thông tin người dùng và sản phẩm
  async findOne(ctx) {
    const { id } = ctx.params;

    const response = await strapi.service('api::review.review').findOne(id, {
      populate: ['users_permissions_user', 'product'], // Populate thông tin người dùng và sản phẩm
    });
    return response;
  },
}));
