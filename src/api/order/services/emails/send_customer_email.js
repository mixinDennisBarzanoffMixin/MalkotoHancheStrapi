async function sendCustomerEmail(order) {
    await strapi.plugins['email'].services.email.send({
      to: order.customerEmail,
      from: process.env.AWS_SES_FROM,
      subject: `Поръчка номер ${order.orderNumber} е потвърдена`,
      text: `Благодарим ви за вашата поръчка!\n\nПоръчка номер: ${order.orderNumber}\nОбща сума: ${order.totalAmount}лв`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f9fafb; margin: 0; padding: 20px;">
          <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%); color: #ffffff; padding: 40px 30px; text-align: center;">
              <div style="font-size: 32px; margin-bottom: 10px;">🛒</div>
              <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">Онлайн Супермаркет</h1>
              <p style="margin: 0; font-size: 16px; opacity: 0.95;">Благодарим ви за вашата поръчка!</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <p style="font-size: 18px; color: #1f2937; margin-bottom: 25px; font-weight: 500;">
                Здравейте${order.customerName ? `, ${order.customerName}` : ''}! 👋
              </p>

              <!-- Order Confirmation -->
              <div style="background-color: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 25px; margin-bottom: 30px; text-align: center;">
                <span style="font-size: 48px; margin-bottom: 15px; display: block;">✅</span>
                <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 700; color: #15803d;">Поръчката е потвърдена!</h2>
                <p style="margin: 0; font-size: 16px; color: #166534;">
                  Вашата поръчка #${order.orderNumber} е получена и обработва се.
                </p>
              </div>

              <!-- Order Information -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 25px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #1e293b;">📋 Детайли за поръчката</h2>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <span style="font-weight: 500; color: #64748b;">Номер на поръчка:</span>
                  <span style="font-weight: 600; color: #1e293b;">#${order.orderNumber}</span>
                </div>
                
                ${order.createdAt ? `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <span style="font-weight: 500; color: #64748b;">Дата на поръчка:</span>
                  <span style="font-weight: 600; color: #1e293b;">${new Date(order.createdAt).toLocaleDateString('bg-BG')}</span>
                </div>
                ` : ''}
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <span style="font-weight: 500; color: #64748b;">Обща сума:</span>
                  <span style="font-weight: 600; color: #1e293b;">${order.totalAmount.toFixed(2)}лв</span>
                </div>
                
                ${order.paymentMethod ? `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <span style="font-weight: 500; color: #64748b;">Начин на плащане:</span>
                  <span style="font-weight: 600; color: #1e293b;">${order.paymentMethod}</span>
                </div>
                ` : ''}
              </div>

              <!-- Products -->
              <h2 style="margin: 35px 0 20px 0; font-size: 20px; font-weight: 600; color: #1e293b; border-bottom: 2px solid #b91c1c; padding-bottom: 8px;">
                🛍️ Вашите продукти (${order.items.length})
              </h2>
              
              ${order.items.map(item => {
                const product = item.product;
                const regularPrice = product.price;
                const hasDiscount = product.discountPrice && product.discountPrice < regularPrice;
                const currentPrice = hasDiscount ? product.discountPrice : regularPrice;
                const itemTotal = currentPrice * item.quantity;
                const savings = hasDiscount ? (regularPrice - product.discountPrice) * item.quantity : 0;

                return `
                  <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 15px; background-color: #ffffff;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                      ${product.image?.formats?.thumbnail ? `
                        <img src="https://unwavering-hug-c09b1ff94a.strapiapp.com${product.image.formats.thumbnail.url}" 
                             alt="${product.name}" 
                             style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px; margin-right: 15px;"
                        />
                      ` : ''}
                      <div style="flex: 1;">
                        <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin: 0;">${product.name}</h3>
                        ${hasDiscount ? `
                          <div style="background-color: #dc2626; color: #ffffff; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-top: 5px; display: inline-block;">
                            НАМАЛЕНИЕ -${Math.round(((regularPrice - product.discountPrice) / regularPrice) * 100)}%
                          </div>
                        ` : ''}
                      </div>
                      <div style="text-align: right;">
                        ${hasDiscount ? `
                          <div>
                            <span style="font-size: 14px; color: #9ca3af; text-decoration: line-through; margin-right: 8px;">${regularPrice.toFixed(2)}лв</span>
                            <span style="font-size: 18px; font-weight: 700; color: #dc2626;">${currentPrice.toFixed(2)}лв</span>
                          </div>
                        ` : `
                          <span style="font-size: 18px; font-weight: 700; color: #1e293b;">${currentPrice.toFixed(2)}лв</span>
                        `}
                      </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; background-color: #f8fafc; padding: 12px 16px; border-radius: 8px;">
                      <span style="font-size: 16px; color: #64748b;">Количество: ${item.quantity} бр.</span>
                      <span style="font-size: 16px; font-weight: 600; color: #1e293b;">Сума: ${itemTotal.toFixed(2)}лв</span>
                      ${savings > 0 ? `
                        <span style="color: #16a34a; font-weight: 600;">
                          Спестени: ${savings.toFixed(2)}лв
                        </span>
                      ` : ''}
                    </div>
                  </div>
                `;
              }).join('')}

              <!-- Order Summary -->
              <div style="background-color: #1e293b; color: #ffffff; padding: 30px; border-radius: 12px; margin-top: 30px;">
                <h2 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 700; text-align: center;">💰 Обобщение на поръчката</h2>
                
                ${order.items.map(item => {
                  const currentPrice = item.product.discountPrice && item.product.discountPrice < item.product.price 
                    ? item.product.discountPrice 
                    : item.product.price;
                  const itemTotal = currentPrice * item.quantity;
                  
                  return `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 16px;">
                      <span>${item.product.name} x${item.quantity}</span>
                      <span>${itemTotal.toFixed(2)}лв</span>
                    </div>
                  `;
                }).join('')}
                
                <div style="border-top: 2px solid rgba(255, 255, 255, 0.2); margin: 15px 0; padding-top: 15px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 16px;">
                    <span>Междинна сума:</span>
                    <span>${(order.totalAmount - order.shippingCost).toFixed(2)}лв</span>
                  </div>
                  
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 16px;">
                    <span>Доставка:</span>
                    <span>${order.shippingCost.toFixed(2)}лв</span>
                  </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-top: 20px; padding-top: 20px; border-top: 2px solid rgba(255, 255, 255, 0.2); font-size: 24px; font-weight: 700;">
                  <span>ОБЩО ЗА ПЛАЩАНЕ:</span>
                  <span>${order.totalAmount.toFixed(2)}лв</span>
                </div>
              </div>

              <!-- Delivery Information -->
              <div style="background-color: #eff6ff; border: 1px solid #3b82f6; border-radius: 10px; padding: 20px; margin-top: 30px;">
                <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #1d4ed8;">
                  🚚 Информация за доставка
                </h3>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <span style="font-weight: 500; color: #64748b;">Адрес за доставка:</span>
                  <span style="font-weight: 600; color: #1e293b;">
                    ${order.shippingAddress.streetAddress}
                    ${order.shippingAddress.city ? `, ${order.shippingAddress.city}` : ''}
                    ${order.shippingAddress.postalCode ? ` ${order.shippingAddress.postalCode}` : ''}
                  </span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <span style="font-weight: 500; color: #64748b;">Телефон за контакт:</span>
                  <span style="font-weight: 600; color: #1e293b;">${order.phoneNumber}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <span style="font-weight: 500; color: #64748b;">Цена за доставка:</span>
                  <span style="font-weight: 600; color: #1e293b;">${order.shippingCost.toFixed(2)}лв</span>
                </div>
                ${order.estimatedDelivery ? `
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="font-weight: 500; color: #64748b;">Очаквана доставка:</span>
                    <span style="font-weight: 600; color: #1e293b;">${order.estimatedDelivery}</span>
                  </div>
                ` : ''}
                ${order.deliveryNotes ? `
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 500; color: #64748b;">Забележки:</span>
                    <span style="font-weight: 600; color: #1e293b;">${order.deliveryNotes}</span>
                  </div>
                ` : ''}
              </div>

              <!-- Support Information -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 25px; margin-top: 30px; text-align: center;">
                <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #1e293b;">Нужна ви е помощ?</h3>
                <p style="margin: 0 0 15px 0; color: #64748b;">
                  Екипът ни за поддръжка на клиенти е готов да ви помогне!
                </p>
                <div style="margin: 8px 0; color: #64748b;">
                  <strong>📧 Имейл:</strong> support@supermarket.bg
                </div>
                <div style="margin: 8px 0; color: #64748b;">
                  <strong>📞 Телефон:</strong> +359 2 123 4567
                </div>
                <div style="margin: 8px 0; color: #64748b;">
                  <strong>🕒 Работно време:</strong> Понеделник - Неделя, 8:00 - 22:00
                </div>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://supermarket.bg" style="display: inline-block; background-color: #b91c1c; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                  🛒 Продължи пазаруването
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f1f5f9; padding: 25px 30px; text-align: center; color: #64748b; font-size: 14px;">
              <p style="margin: 0 0 10px 0;">
                Благодарим ви, че избрахте Онлайн Супермаркет! 🙏
              </p>
              <p style="margin: 0 0 15px 0;">
                Това е автоматично генерирано съобщение. Моля, не отговаряйте директно на този имейл.
              </p>
              
              <div style="margin-top: 15px;">
                <a href="#" style="display: inline-block; margin: 0 10px; font-size: 20px; color: #64748b; text-decoration: none;">📘</a>
                <a href="#" style="display: inline-block; margin: 0 10px; font-size: 20px; color: #64748b; text-decoration: none;">📷</a>
                <a href="#" style="display: inline-block; margin: 0 10px; font-size: 20px; color: #64748b; text-decoration: none;">🐦</a>
              </div>
              
              <p style="margin: 10px 0 0 0; font-size: 12px;">
                © 2024 Онлайн Супермаркет. Всички права запазени.
              </p>
            </div>
          </div>
        </div>
      `
    });
} 

module.exports = sendCustomerEmail;