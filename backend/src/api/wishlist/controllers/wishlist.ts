/**
 * wishlist controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::wishlist.wishlist', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to access the wishlist');
    }

    const wishlist = await strapi.db.query('api::wishlist.wishlist').findOne({
      where: { user: user.id },
      populate: ['products'],
    });

    return wishlist || { products: [] };
  },

  async update(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to update the wishlist');
    }

    const { products } = ctx.request.body;

    const wishlist = await strapi.db.query('api::wishlist.wishlist').findOne({
      where: { user: user.id },
    });

    if (wishlist) {
      await strapi.db.query('api::wishlist.wishlist').update({
        where: { id: wishlist.id },
        data: { products },
      });
    } else {
      await strapi.db.query('api::wishlist.wishlist').create({
        data: { user: user.id, products },
      });
    }

    return { message: 'Wishlist updated successfully' };
  },
}));
