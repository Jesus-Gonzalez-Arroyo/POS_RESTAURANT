import { Sale } from '../../core/services/sales/sales';
import { formatPriceCustom } from './formatPrice';

/**
 * Genera el contenido HTML para imprimir una factura en formato de ticket
 * optimizado para impresoras térmicas de 80mm
 */
export function generateSaleReceipt(sale: Sale): string {
  const saleId = new Date(sale.time).getTime();
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Factura #${saleId}</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 0;
          }
          
          @media print {
            body { 
              margin: 0; 
              padding: 0;
            }
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: 'Courier New', monospace;
            font-size: 11px;
            line-height: 1.3;
            width: 80mm;
            padding: 5mm;
          }
          
          .ticket-header { 
            text-align: center;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px dashed #000;
          }
          
          .ticket-header h1 {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 4px;
          }
          
          .ticket-header p {
            font-size: 10px;
            margin: 2px 0;
          }
          
          .info-section {
            margin: 8px 0;
            padding: 4px 0;
          }
          
          .info-row {
            display: flex;
            justify-content: space-between;
            margin: 2px 0;
            font-size: 10px;
          }
          
          .info-label {
            font-weight: bold;
          }
          
          .products-section {
            margin: 8px 0;
            padding: 8px 0;
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
          }
          
          .products-title {
            font-weight: bold;
            text-align: center;
            margin-bottom: 6px;
            font-size: 11px;
          }
          
          .product-item {
            margin: 4px 0;
          }
          
          .product-line {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
          }
          
          .product-name {
            flex: 1;
            padding-right: 8px;
          }
          
          .totals-section {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed #000;
          }
          
          .total-line {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
            font-size: 11px;
          }
          
          .total-line.grand-total {
            font-weight: bold;
            font-size: 13px;
            margin-top: 6px;
            padding-top: 6px;
            border-top: 1px solid #000;
          }
          
          .total-line.profit {
            font-size: 10px;
            font-style: italic;
          }
          
          .footer {
            text-align: center;
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px dashed #000;
            font-size: 9px;
          }
        </style>
      </head>
      <body>
        <div class="ticket-header">
          <h1>FACTURA</h1>
          <p>No. ${saleId}</p>
        </div>
        
        <div class="info-section">
          <div class="info-row">
            <span class="info-label">Cliente:</span>
            <span>${sale.customer}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Fecha:</span>
            <span>${new Date(sale.time).toLocaleString('es-ES', { 
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit', 
              minute: '2-digit'
            })}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Pago:</span>
            <span>${sale.paymentmethod.charAt(0).toUpperCase() + sale.paymentmethod.slice(1)}</span>
          </div>
        </div>
        
        <div class="products-section">
          <div class="products-title">PRODUCTOS</div>
          ${sale.products.map(p => `
            <div class="product-item">
              <div class="product-line">
                <span class="product-name">${p.quantity}x ${p.name}</span>
                <span>$${formatPriceCustom(p.price * p.quantity)}</span>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="totals-section">
          <div class="total-line grand-total">
            <span>TOTAL:</span>
            <span>$${formatPriceCustom(parseInt(sale.total))}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Gracias por su compra</p>
          <p>¡Vuelva pronto!</p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Imprime un documento HTML utilizando un iframe oculto
 * Útil para evitar abrir nuevas ventanas y para impresoras térmicas
 */
export function printDocument(htmlContent: string): void {
  // Crear un iframe oculto para la impresión
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  
  // Agregar el iframe al documento
  document.body.appendChild(iframe);
  
  // Escribir el contenido en el iframe
  const iframeDoc = iframe.contentWindow?.document;
  if (iframeDoc) {
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();
    
    // Esperar a que cargue y luego imprimir
    iframe.contentWindow?.addEventListener('load', () => {
      setTimeout(() => {
        iframe.contentWindow?.print();
        // Remover el iframe después de imprimir
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 100);
      }, 250);
    });
  }
}
