async function sendOwnerEmail(order, ownerEmail) {
    await strapi.plugins['email'].services.email.send({
      to: ownerEmail,
      from: process.env.AWS_SES_FROM,
      subject: `Поръчка номер ${order.orderNumber}`,
      text: `Преглед на вашата поръчка!\n\nПоръчка номер: ${order.orderNumber}\nОбща сума: ${order.totalAmount}€`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f9fafb; margin: 0; padding: 20px;">
          <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background-color: #b91c1c; color: #ffffff; padding: 30px; text-align: center;">
              <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">🔔 НОВА ПОРЪЧКА</h1>
              <p style="margin: 0; font-size: 16px; opacity: 0.9;">Административно известие за поръчка #${order.orderNumber}</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <div style="background-color: #dc2626; color: #ffffff; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; margin-bottom: 20px;">ИЗИСКВА ВНИМАНИЕ</div>

              <!-- Order Information -->
              <div style="background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #1f2937;">📋 Информация за поръчката</h2>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap;">
                  <span style="font-weight: 500; color: #6b7280; min-width: 120px;">Номер на поръчка:</span>
                  <span style="font-weight: 600; color: #1f2937;">#${order.orderNumber}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap;">
                  <span style="font-weight: 500; color: #6b7280; min-width: 120px;">Обща сума:</span>
                  <span style="font-weight: 600; color: #1f2937;">${order.totalAmount.toFixed(2)}лв</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap;">
                  <span style="font-weight: 500; color: #6b7280; min-width: 120px;">Телефон:</span>
                  <span style="font-weight: 600; color: #1f2937;">${order.phoneNumber}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap;">
                  <span style="font-weight: 500; color: #6b7280; min-width: 120px;">Адрес:</span>
                  <span style="font-weight: 600; color: #1f2937;">${order.shippingAddress.streetAddress}${
                    order.shippingAddress.city ? `, ${order.shippingAddress.city}` : ''
                  }${
                    order.shippingAddress.postalCode ? ` ${order.shippingAddress.postalCode}` : ''
                  }</span>
                </div>
                
                ${order.deliveryNotes ? `
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap;">
                    <span style="font-weight: 500; color: #6b7280; min-width: 120px;">Забележки:</span>
                    <span style="font-weight: 600; color: #1f2937;">${order.deliveryNotes}</span>
                  </div>
                ` : ''}
              </div>

              <!-- Products -->
              <h2 style="margin: 30px 0 20px 0; font-size: 20px; font-weight: 600; color: #1f2937; border-bottom: 2px solid #b91c1c; padding-bottom: 8px;">
                🛍️ Поръчани продукти (${order.items.length})
              </h2>
              
              ${order.items.map(item => {
                const product = item.product;
                const regularPrice = product.price;
                const hasDiscount = product.oldPrice && product.oldPrice > regularPrice;
                const currentPrice = regularPrice;
                const itemTotal = currentPrice * item.quantity;

                return `
                  <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 15px; background-color: #ffffff;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                      ${product.image?.formats?.thumbnail ? `
                        <img src="https://unwavering-hug-c09b1ff94a.strapiapp.com${product.image.formats.thumbnail.url}" 
                             alt="${product.name}" 
                             style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px; margin-right: 15px;"
                        />
                      ` : ''}
                      <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0; flex: 1; min-width: 200px;">${product.name}</h3>
                      <div style="text-align: right;">
                        ${hasDiscount ? `
                          <span style="font-size: 14px; color: #9ca3af; text-decoration: line-through; margin-right: 8px;">${regularPrice.toFixed(2)}лв</span>
                          <span style="font-size: 18px; font-weight: 700; color: #059669;">${product.oldPrice.toFixed(2)}лв</span>
                        ` : `
                          <span style="font-size: 18px; font-weight: 700; color: #1f2937;">${regularPrice.toFixed(2)}лв</span>
                        `}
                      </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 15px;">
                      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                        <span style="font-weight: 500; color: #6b7280;">Количество:</span>
                        <span style="font-weight: 600; color: #1f2937;">${item.quantity} бр.</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                        <span style="font-weight: 500; color: #6b7280;">Сума за ред:</span>
                        <span style="font-weight: 600; color: #1f2937;">${itemTotal.toFixed(2)}лв</span>
                      </div>
                      ${product.id ? `
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                          <span style="font-weight: 500; color: #6b7280;">№:</span>
                          <span style="font-weight: 600; color: #1f2937;">${product.id}</span>
                        </div>
                      ` : ''}
                    </div>

                    <a href="https://unwavering-hug-c09b1ff94a.strapiapp.com/admin/content-manager/collectionType/api::product.product/${product.documentId}"
                       style="display: inline-block; background-color: #1d4ed8; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 500;"
                       target="_blank">
                      📝 Отвори в админ панела
                    </a>
                  </div>
                `;
              }).join('')}

              <!-- Delivery Information -->
              <div style="background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin-top: 30px;">
                <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #1e293b;">🚚 Информация за доставка</h2>
                
                <div style="display: grid; gap: 12px;">
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-weight: 500; color: #6b7280;">Град:</span>
                    <span style="font-weight: 600; color: #1f2937;">${order.shippingAddress.city}</span>
                  </div>

                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-weight: 500; color: #6b7280;">Адрес:</span>
                    <span style="font-weight: 600; color: #1f2937;">${order.shippingAddress.streetAddress}</span>
                  </div>

                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-weight: 500; color: #6b7280;">Телефон:</span>
                    <span style="font-weight: 600; color: #1f2937;">${order.phoneNumber}</span>
                  </div>

                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="font-weight: 500; color: #6b7280;">Цена за доставка:</span>
                    <span style="font-weight: 600; color: #1f2937;">${order.shippingCost.toFixed(2)}лв</span>
                  </div>

                  ${order.deliveryNotes ? `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                      <span style="font-weight: 500; color: #6b7280;">Бележки за доставка:</span>
                      <span style="font-weight: 600; color: #1f2937;">${order.deliveryNotes}</span>
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- Order Summary -->
              <div style="background-color: #b91c1c; color: #ffffff; padding: 25px; border-radius: 8px; margin-top: 30px;">
                <h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 700;">💰 Обобщение на поръчката</h2>
                
                ${order.items.map(item => {
                  const currentPrice = item.product.oldPrice && item.product.oldPrice > item.product.price 
                    ? item.product.price 
                    : item.product.oldPrice;
                  const itemTotal = currentPrice * item.quantity;
                  
                  return `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 16px;">
                      <span>${item.product.name} x${item.quantity}</span>
                      <span>${itemTotal.toFixed(2)}лв</span>
                    </div>
                  `;
                }).join('')}
                
                <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px solid rgba(255, 255, 255, 0.3); font-size: 20px; font-weight: 700;">
                  <span>ОБЩО:</span>
                  <span>${order.totalAmount.toFixed(2)}лв</span>
                </div>
              </div>

              <!-- Action Links -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://unwavering-hug-c09b1ff94a.strapiapp.com/admin/content-manager/collectionType/api::order.order"
                   style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; font-weight: 500; margin-right: 15px;"
                   target="_blank">
                  📊 Виж всички поръчки
                </a>
                
                <a href="https://unwavering-hug-c09b1ff94a.strapiapp.com/admin/content-manager/collection-types/api::product.product"
                   style="display: inline-block; background-color: #7c3aed; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; font-weight: 500;"
                   target="_blank">
                  🛍️ Управление на продукти
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f3f4f6; padding: 20px 30px; text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0 0 5px 0;">
                Това е автоматично генерирано съобщение от системата за управление на поръчки.
              </p>
              <p style="margin: 0;">
                За въпроси или проблеми, моля свържете се с техническата поддръжка.
              </p>
            </div>
          </div>
        </div>
      `
    });
}

module.exports = sendOwnerEmail;