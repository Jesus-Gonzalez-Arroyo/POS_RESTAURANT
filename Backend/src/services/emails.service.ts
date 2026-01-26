import nodemailer from 'nodemailer';

interface CashRegisterOpeningData {
    openingAmount: number;
    openingDate: Date;
    openedBy: string;
    registerId?: string;
}

export const sendCashRegisterOpeningEmail = async (data: CashRegisterOpeningData): Promise<void> => {
    const { openingAmount, openingDate, openedBy, registerId } = data;
    
    const formattedDate = new Date(openingDate).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    const formattedTime = new Date(openingDate).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Apertura de Caja Registradora</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7fa;
                padding: 20px;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            .icon {
                width: 70px;
                height: 70px;
                background-color: rgba(255, 255, 255, 0.25);
                border-radius: 50%;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 35px;
            }
            .header h1 {
                font-size: 26px;
                margin-bottom: 8px;
                font-weight: 600;
            }
            .header p {
                font-size: 14px;
                opacity: 0.95;
            }
            .content {
                padding: 35px;
            }
            .status-badge {
                display: inline-block;
                background-color: #10b981;
                color: white;
                padding: 8px 20px;
                border-radius: 25px;
                font-size: 13px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 25px;
            }
            .amount-box {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
                margin: 25px 0;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }
            .amount-box .label {
                font-size: 14px;
                opacity: 0.9;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .amount-box .value {
                font-size: 42px;
                font-weight: bold;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .info-card {
                background-color: #f8f9fc;
                border-left: 4px solid #667eea;
                border-radius: 8px;
                padding: 25px;
                margin: 20px 0;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 0;
                border-bottom: 1px solid #e0e6ed;
            }
            .info-row:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }
            .info-label {
                font-size: 14px;
                color: #64748b;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .info-value {
                font-size: 16px;
                color: #1e293b;
                font-weight: 600;
            }
            .alert-box {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 18px;
                border-radius: 8px;
                margin-top: 25px;
            }
            .alert-box p {
                color: #92400e;
                font-size: 13px;
                line-height: 1.7;
            }
            .alert-box strong {
                display: block;
                margin-bottom: 5px;
            }
            .footer {
                background-color: #f8f9fc;
                padding: 25px;
                text-align: center;
                color: #64748b;
                font-size: 13px;
            }
            .footer p {
                margin: 5px 0;
            }
            .footer strong {
                color: #1e293b;
            }
            @media only screen and (max-width: 600px) {
                .content {
                    padding: 25px;
                }
                .amount-box .value {
                    font-size: 36px;
                }
                .info-row {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="icon">💰</div>
                <h1>Apertura de Caja Registradora</h1>
                <p>Notificación de apertura exitosa del sistema</p>
            </div>
            
            <div class="content">
                <div style="text-align: center;">
                    <span class="status-badge">✓ Caja Abierta</span>
                </div>

                <div class="amount-box">
                    <div class="label">Monto Inicial de Apertura</div>
                    <div class="value">$${openingAmount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>

                <div class="info-card">
                    <div class="info-row">
                        <span class="info-label">
                            📅 Fecha de Apertura
                        </span>
                        <span class="info-value">${formattedDate}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">
                            🕐 Hora de Apertura
                        </span>
                        <span class="info-value">${formattedTime}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">
                            👤 Responsable de Apertura
                        </span>
                        <span class="info-value">${openedBy}</span>
                    </div>
                    ${registerId ? `
                    <div class="info-row">
                        <span class="info-label">
                            🔢 ID de Registro
                        </span>
                        <span class="info-value">#${registerId}</span>
                    </div>
                    ` : ''}
                </div>
            </div>

            <div class="footer">
                <p><strong>Sistema POS Farmazul</strong></p>
                <p>Control de Caja Registradora</p>
                <p style="margin-top: 12px; font-size: 12px; color: #94a3b8;">
                    Este es un mensaje automático generado por el sistema. Por favor no responder.
                </p>
                <p style="margin-top: 8px; font-size: 12px;">
                    © ${new Date().getFullYear()} POS Farmazul - Todos los derechos reservados
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Configurar el transporte del correo
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.EMAILS,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Enviar el correo
    await transporter.sendMail({
        from: `"POS Restaurant - Sistema de Caja" <${process.env.EMAILS}>`,
        to: process.env.EMAIL_TO,
        subject: `✅ Caja Registradora Abierta - ${formattedDate} ${formattedTime}`,
        text: `Caja registradora abierta exitosamente.\n\nMonto Inicial: $${openingAmount.toLocaleString('es-ES')}\nFecha: ${formattedDate}\nHora: ${formattedTime}\nResponsable: ${openedBy}${registerId ? `\nID de Registro: #${registerId}` : ''}`,
        html: htmlTemplate
    });
}

interface CashRegisterClosingData {
    registerId?: string;
    openingDate: Date;
    closingDate: Date;
    openingAmount: number;
    closingAmount: number;
    expectedAmount: number;
    difference: number;
    totalSales: number;
    totalExpenses: number;
    salesByMethod: { [methodName: string]: number };
    cashAmount: number;
    openedBy: string;
    closedBy: string;
    notes?: string;
}

export const sendCashRegisterClosingEmail = async (data: CashRegisterClosingData): Promise<void> => {
    const { 
        registerId, 
        openingDate, 
        closingDate, 
        openingAmount, 
        closingAmount,
        expectedAmount,
        difference,
        totalSales,
        totalExpenses,
        salesByMethod,
        cashAmount,
        openedBy,
        closedBy,
        notes
    } = data;
    
    const formattedOpeningDate = new Date(openingDate).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    const formattedOpeningTime = new Date(openingDate).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const formattedClosingDate = new Date(closingDate).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    const formattedClosingTime = new Date(closingDate).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Calcular el total de otros métodos de pago (excluyendo efectivo)
    const totalOtherMethods = Object.entries(salesByMethod)
        .filter(([method]) => method.toLowerCase() !== 'efectivo')
        .reduce((sum, [, amount]) => sum + amount, 0);
    
    // Calcular el total general (efectivo + otros métodos)
    const totalAllMethods = cashAmount + totalOtherMethods;

    // Generar filas para cada método de pago (excluyendo efectivo)
    const paymentMethodsRows = Object.entries(salesByMethod)
        .filter(([method]) => method.toLowerCase() !== 'efectivo')
        .map(([method, amount]) => `
            <div class="info-row">
                <span class="info-label">${method}</span>
                <span class="info-value">$${amount.toLocaleString('es-ES')}</span>
            </div>
        `).join('');

    const differenceColor = difference >= 0 ? '#10b981' : '#ef4444';
    const differenceIcon = difference >= 0 ? '✓' : '⚠️';
    const differenceText = difference >= 0 ? 'Sobrante' : 'Faltante';

    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cierre de Caja Registradora</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7fa;
                padding: 20px;
                line-height: 1.6;
            }
            .container {
                max-width: 700px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }
            .icon {
                width: 70px;
                height: 70px;
                background-color: rgba(255, 255, 255, 0.25);
                border-radius: 50%;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 35px;
            }
            .header h1 {
                font-size: 26px;
                margin-bottom: 8px;
                font-weight: 600;
            }
            .header p {
                font-size: 14px;
                opacity: 0.95;
            }
            .content {
                padding: 35px;
            }
            .status-badge {
                display: inline-block;
                background-color: #dc2626;
                color: white;
                padding: 8px 20px;
                border-radius: 25px;
                font-size: 13px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 25px;
            }
            .summary-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin: 25px 0;
            }
            .summary-card {
                background: linear-gradient(135deg, #f8f9fc 0%, #e9ecef 100%);
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                border-left: 4px solid #667eea;
                margin-bottom: 15px;
            }
            .summary-card.highlight {
                background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
                color: white;
                border-left: 4px solid #7f1d1d;
            }
            .summary-card .label {
                font-size: 12px;
                opacity: 0.8;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .summary-card .value {
                font-size: 24px;
                font-weight: bold;
            }
            .difference-box {
                background-color: ${difference >= 0 ? '#d1fae5' : '#fee2e2'};
                border-left: 4px solid ${differenceColor};
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: center;
            }
            .difference-box .label {
                font-size: 14px;
                color: ${difference >= 0 ? '#065f46' : '#7f1d1d'};
                margin-bottom: 8px;
                font-weight: 600;
            }
            .difference-box .value {
                font-size: 32px;
                font-weight: bold;
                color: ${differenceColor};
            }
            .info-card {
                background-color: #f8f9fc;
                border-left: 4px solid #dc2626;
                border-radius: 8px;
                padding: 25px;
                margin: 20px 0;
            }
            .info-card h3 {
                color: #1e293b;
                font-size: 16px;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid #e0e6ed;
            }
            .info-row:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }
            .info-label {
                font-size: 14px;
                color: #64748b;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .info-value {
                font-size: 16px;
                color: #1e293b;
                font-weight: 600;
                margin-left: 10px;
            }
            .info-value.positive {
                color: #10b981;
            }
            .info-value.negative {
                color: #ef4444;
            }
            .notes-box {
                background-color: #fffbeb;
                border-left: 4px solid #f59e0b;
                padding: 18px;
                border-radius: 8px;
                margin-top: 20px;
            }
            .notes-box h4 {
                color: #92400e;
                font-size: 14px;
                margin-bottom: 8px;
            }
            .notes-box p {
                color: #78350f;
                font-size: 13px;
                line-height: 1.6;
            }
            .footer {
                background-color: #f8f9fc;
                padding: 25px;
                text-align: center;
                color: #64748b;
                font-size: 13px;
            }
            .footer p {
                margin: 5px 0;
            }
            .footer strong {
                color: #1e293b;
            }
            @media only screen and (max-width: 600px) {
                .content {
                    padding: 25px;
                }
                .summary-grid {
                    grid-template-columns: 1fr;
                }
                .info-row {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="icon"><div>🔒</div></div>
                <h1>Cierre de Caja Registradora</h1>
                <p>Reporte completo de cierre de caja</p>
            </div>
            
            <div class="content">
                <div style="text-align: center;">
                    <span class="status-badge">✓ Caja Cerrada</span>
                </div>

                <div class="summary-grid">
                    <div class="summary-card">
                        <div class="label">Monto Inicial</div>
                        <div class="value">$${openingAmount.toLocaleString('es-ES')}</div>
                    </div>
                    <div class="summary-card highlight">
                        <div class="label">Monto Final</div>
                        <div class="value">$${closingAmount.toLocaleString('es-ES')}</div>
                    </div>
                    <div class="summary-card">
                        <div class="label">Total Ventas</div>
                        <div class="value">$${totalSales.toLocaleString('es-ES')}</div>
                    </div>
                    <div class="summary-card">
                        <div class="label">Total Gastos</div>
                        <div class="value">$${totalExpenses.toLocaleString('es-ES')}</div>
                    </div>
                </div>

                <div class="difference-box">
                    <div class="label">${differenceIcon} ${differenceText}</div>
                    <div class="value">$${Math.abs(difference).toLocaleString('es-ES')}</div>
                    <div style="font-size: 12px; margin-top: 8px; opacity: 0.8;">
                        Esperado: $${expectedAmount.toLocaleString('es-ES')} | Real: $${closingAmount.toLocaleString('es-ES')}
                    </div>
                </div>

                <div class="info-card">
                    <h3>� Resumen de Ingresos Totales</h3>
                    <div class="info-row" style="background-color: #e0e7ff; padding: 15px; margin: -10px -15px 15px -25px; border-radius: 6px;">
                        <span class="info-label" style="font-weight: 700; color: #1e293b; font-size: 15px;">TOTAL GENERAL</span>
                        <span class="info-value" style="font-size: 20px; color: #4338ca;">$${totalAllMethods.toLocaleString('es-ES')}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Efectivo en Caja</span>
                        <span class="info-value" style="color: #10b981;">$${cashAmount.toLocaleString('es-ES')}</span>
                    </div>
                    ${totalOtherMethods > 0 ? `
                    <div class="info-row">
                        <span class="info-label">Otros Medios de Pago</span>
                        <span class="info-value" style="color: #3b82f6;">$${totalOtherMethods.toLocaleString('es-ES')}</span>
                    </div>
                    ` : ''}
                </div>

                ${paymentMethodsRows ? `
                <div class="info-card">
                    <h3>💳 Detalle de Otros Medios de Pago</h3>
                    ${paymentMethodsRows}
                </div>
                ` : ''}

                <div class="info-card">
                    <h3>📅 Información de Horarios</h3>
                    <div class="info-row">
                        <span class="info-label">Apertura</span>
                        <span class="info-value">${formattedOpeningDate} - ${formattedOpeningTime}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Cierre</span>
                        <span class="info-value">${formattedClosingDate} - ${formattedClosingTime}</span>
                    </div>
                </div>

                <div class="info-card">
                    <h3>👥 Responsables</h3>
                    <div class="info-row">
                        <span class="info-label">Abrió la caja</span>
                        <span class="info-value">${openedBy}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Cerró la caja</span>
                        <span class="info-value">${closedBy}</span>
                    </div>
                    ${registerId ? `
                    <div class="info-row">
                        <span class="info-label">ID de Registro</span>
                        <span class="info-value">#${registerId}</span>
                    </div>
                    ` : ''}
                </div>

                ${notes ? `
                <div class="notes-box">
                    <h4>📝 Notas del Cierre:</h4>
                    <p>${notes}</p>
                </div>
                ` : ''}
            </div>

            <div class="footer">
                <p><strong>Sistema POS Farmazul</strong></p>
                <p>Control de Caja Registradora</p>
                <p style="margin-top: 12px; font-size: 12px; color: #94a3b8;">
                    Este es un mensaje automático generado por el sistema. Por favor no responder.
                </p>
                <p style="margin-top: 8px; font-size: 12px;">
                    © ${new Date().getFullYear()} POS Farmazul - Todos los derechos reservados
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Configurar el transporte del correo
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.EMAILS,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Construir texto plano para el email
    let textContent = `CIERRE DE CAJA REGISTRADORA\n\n`;
    textContent += `Monto Inicial: $${openingAmount.toLocaleString('es-ES')}\n`;
    textContent += `Monto Final: $${closingAmount.toLocaleString('es-ES')}\n`;
    textContent += `Total Ventas: $${totalSales.toLocaleString('es-ES')}\n`;
    textContent += `Total Gastos: $${totalExpenses.toLocaleString('es-ES')}\n\n`;
    textContent += `RESUMEN DE INGRESOS:\n`;
    textContent += `Total General: $${totalAllMethods.toLocaleString('es-ES')}\n`;
    textContent += `Efectivo en Caja: $${cashAmount.toLocaleString('es-ES')}\n`;
    textContent += `Otros Medios de Pago: $${totalOtherMethods.toLocaleString('es-ES')}\n\n`;
    textContent += `${differenceText}: $${Math.abs(difference).toLocaleString('es-ES')}\n\n`;
    if (Object.keys(salesByMethod).length > 0) {
        textContent += `DETALLE DE OTROS MEDIOS DE PAGO:\n`;
        Object.entries(salesByMethod)
            .filter(([method]) => method.toLowerCase() !== 'efectivo')
            .forEach(([method, amount]) => {
                textContent += `${method}: $${amount.toLocaleString('es-ES')}\n`;
            });
        textContent += `\n`;
    }
    textContent += `Apertura: ${formattedOpeningDate} ${formattedOpeningTime} - ${openedBy}\n`;
    textContent += `Cierre: ${formattedClosingDate} ${formattedClosingTime} - ${closedBy}\n`;
    if (notes) textContent += `\nNotas: ${notes}`;

    // Enviar el correo
    await transporter.sendMail({
        from: `"POS Farmazul - Sistema de Caja" <${process.env.EMAILS}>`,
        to: process.env.EMAIL_TO,
        subject: `🔒 Caja Registradora Cerrada - ${formattedClosingDate} ${formattedClosingTime}`,
        text: textContent,
        html: htmlTemplate
    });
}
