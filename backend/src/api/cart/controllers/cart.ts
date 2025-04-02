/**
 * cart controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::cart.cart', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to access the cart');
    }

    const cart = await strapi.db.query('api::cart.cart').findOne({
      where: { user: user.id },
      populate: ['products'],
    });

    return cart || { products: [] };
  },

  async update(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to update the cart');
    }

    const { products } = ctx.request.body;

    const cart = await strapi.db.query('api::cart.cart').findOne({
      where: { user: user.id },
    });

    if (cart) {
      await strapi.db.query('api::cart.cart').update({
        where: { id: cart.id },
        data: { products },
      });
    } else {
      await strapi.db.query('api::cart.cart').create({
        data: { user: user.id, products },
      });
    }

    return { message: 'Cart updated successfully' };
  },
}));
