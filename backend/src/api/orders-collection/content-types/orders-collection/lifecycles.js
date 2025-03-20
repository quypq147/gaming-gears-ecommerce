module.exports = {
    async beforeCreate(event) {
      const { data } = event.params;
  
      const generateOrderCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 8; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
      };
  
      let orderCode;
      let isUnique = false;
      while (!isUnique) {
        orderCode = generateOrderCode();
        const existingOrder = await strapi.entityService.findMany("api::order.order", {
          filters: { orderCode },
        });
        if (existingOrder.length === 0) {
          isUnique = true;
        }
      }
  
      data.orderCode = orderCode;
    },
  };
  