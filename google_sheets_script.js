/**
 * =========================================================================
 * MADAME GOWN - GOOGLE APPS SCRIPT FOR ORDER MANAGEMENT & SLIP STORAGE
 * =========================================================================
 * 
 * วิธีนำไปใช้งาน:
 * 1. เปิด Google Sheets เปล่า (https://sheets.new)
 * 2. ไปที่เมนู "ส่วนขยาย" (Extensions) > "Apps Script"
 * 3. ลบโค้ดเดิมทั้งหมดในหน้าต่าง แล้วคัดลอกโค้ดทั้งหมดในไฟล์นี้ไปวาง
 * 4. กดปุ่ม "บันทึก" (รูปแผ่นดิสก์ หรือ Ctrl + S)
 * 5. กดปุ่มสีน้ำเงินมุมขวาบน "ทำให้ใช้งานได้" (Deploy) > "การปรับใช้รายการใหม่" (New deployment)
 * 6. เลือกประเภทเป็น "เว็บแอป" (Web app)
 *    - คำอธิบาย: Madame Gown Orders
 *    - ดำเนินการในฐานะ (Execute as): "ฉัน" (Me)
 *    - ผู้มีสิทธิ์เข้าถึง (Who has access): "ทุกคน" (Anyone) ***สำคัญมาก***
 * 7. กด "ทำให้ใช้งานได้" (Deploy) และอนุญาตสิทธิ์เข้าถึง (Authorize Access)
 * 8. คัดลอก "URL เว็บแอป" (Web app URL) ที่ได้ มาใส่ใน main.js ที่ตัวแปร GOOGLE_SCRIPT_URL
 * =========================================================================
 */

// กำหนดอีเมลสำหรับรับแจ้งเตือนออเดอร์
const NOTIFICATION_EMAIL = 'jtpaae@gmail.com';
const GOOGLE_DRIVE_FOLDER_NAME = 'Madame Gown Slips';

function doPost(e) {
  try {
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    const orderRef     = data.orderRef || 'N/A';
    const customerName = data.customerName || data.nameVal || '-';
    const customerEmail= data.customerEmail || data.emailVal || data.email || '-';
    const phone        = data.phone || data.phoneVal || '-';
    const lineId       = data.lineId || data.lineVal || '-';
    const size         = data.size || data.lengthVal || '-';
    const height       = data.height ? `${data.height} ซม.` : (data.heightVal ? `${data.heightVal} ซม.` : '-');
    const weight       = data.weight ? `${data.weight} กก.` : (data.weightVal ? `${data.weightVal} กก.` : '-');
    const garment      = data.garment || data.garmentText || '-';
    const service      = data.service || data.serviceVal || '-';
    const rentFee      = data.rentFee || '-';
    const depositFee   = data.depositFee || '-';
    const discountFee  = data.discountFee || data.discount || '-';
    const degree       = data.degree ? `ฮูดระดับ ${data.degree}` : (data.degreeVal ? `ฮูดระดับ ${data.degreeVal}` : '-');
    const color        = data.color ? `สี${data.color}` : (data.colorVal ? `สี${data.colorVal}` : '-');
    const totalAmount  = data.totalAmount || (data.total ? `฿${Number(data.total).toLocaleString()} บาท` : '-');
    const gradDate     = data.gradDate || data.gradDateVal || '-';
    const notes        = data.notes || data.notesVal || '-';
    const slipBase64   = data.slipBase64 || '';
    const slipFileName = data.slipFileName || `${orderRef}_slip.jpg`;

    // 1. จัดการโฟลเดอร์ใน Google Drive สำหรับเก็บสลิป
    let slipUrl = 'ไม่มีการแนบสลิป';
    let slipBlob = null;

    if (slipBase64) {
      try {
        let folder;
        const folders = DriveApp.getFoldersByName(GOOGLE_DRIVE_FOLDER_NAME);
        if (folders.hasNext()) {
          folder = folders.next();
        } else {
          folder = DriveApp.createFolder(GOOGLE_DRIVE_FOLDER_NAME);
        }

        // ถอดรหัส Base64 ของรูปสลิป
        let contentType = 'image/jpeg';
        let base64Data = slipBase64;
        if (slipBase64.indexOf(';base64,') !== -1) {
          const parts = slipBase64.split(';base64,');
          contentType = parts[0].replace('data:', '');
          base64Data = parts[1];
        }

        const decodedBytes = Utilities.base64Decode(base64Data);
        slipBlob = Utilities.newBlob(decodedBytes, contentType, `${orderRef}_${slipFileName}`);
        const driveFile = folder.createFile(slipBlob);
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        slipUrl = driveFile.getUrl();
      } catch (driveErr) {
        slipUrl = `บันทึกรูปไม่สำเร็จ: ${driveErr.toString()}`;
      }
    }

    // 2. บันทึกข้อมูลลงใน Google Sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // หากเพิ่งสร้างชีตใหม่ ยังไม่มีหัวตาราง ให้สร้างหัวตารางอัตโนมัติ
    if (sheet.getLastRow() === 0) {
      const headers = [
        'วัน-เวลาสั่งซื้อ',
        'หมายเลขคำสั่งซื้อ',
        'ชื่อลูกค้า',
        'อีเมลลูกค้า',
        'เบอร์โทรศัพท์',
        'LINE ID',
        'ไซส์ความยาวชุด',
        'ส่วนสูง',
        'น้ำหนัก',
        'ประเภทสินค้า',
        'รูปแบบบริการ',
        'ค่าเช่าหรือตัดเย็บ',
        'เงินประกันมัดจำ',
        'ส่วนลดคูปอง',
        'ฮูดวิทยฐานะ',
        'แถบสีวิทยฐานะ',
        'ยอดชำระทั้งสิ้น',
        'กำหนดการใช้งาน',
        'ลิงก์สลิปโอนเงิน (Google Drive)',
        'หมายเหตุเพิ่มเติม'
      ];
      sheet.appendRow(headers);
      
      // ตกแต่งหัวตารางให้สวยงาม
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#1e293b'); // สีกรมเข้มเรียบหรู
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
    }

    // เพิ่มแถวข้อมูลคำสั่งซื้อใหม่
    const timestamp = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss');
    sheet.appendRow([
      timestamp,
      orderRef,
      customerName,
      customerEmail,
      phone,
      lineId,
      size,
      height,
      weight,
      garment,
      service,
      rentFee,
      depositFee,
      discountFee,
      degree,
      color,
      totalAmount,
      gradDate,
      slipUrl,
      notes
    ]);

    // จัดกึ่งกลางสำหรับคอลัมน์สำคัญ
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 2).setHorizontalAlignment('center'); // วันที่ & เลขที่
    sheet.getRange(lastRow, 7, 1, 3).setHorizontalAlignment('center'); // ไซส์, สูง, น้ำหนัก

    // 3. ส่งอีเมลแจ้งเตือนไปยัง NOTIFICATION_EMAIL พร้อมแนบรูปสลิป
    if (NOTIFICATION_EMAIL) {
      try {
        const subject = `[Madame Gown ออเดอร์ใหม่ #${orderRef}] คุณ${customerName} | ไซส์: ${size} | ${degree} ${color}`;
        
        const htmlBody = `
          <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #1e293b, #0f172a); color: #ffffff; padding: 24px; text-align: center;">
              <h2 style="margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Madame Gown</h2>
              <p style="margin: 6px 0 0 0; color: #cbd5e1; font-size: 14px;">แจ้งเตือนคำสั่งซื้อใหม่และสลิปการชำระเงิน</p>
            </div>
            
            <div style="padding: 24px;">
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; text-align: center;">
                <span style="font-size: 12px; color: #64748b; text-transform: uppercase;">หมายเลขคำสั่งซื้อ</span>
                <div style="font-size: 24px; font-weight: bold; color: #1e293b; margin-top: 4px;">${orderRef}</div>
                <div style="display: inline-block; background: #dcfce7; color: #166534; font-size: 13px; font-weight: 600; padding: 4px 12px; border-radius: 9999px; margin-top: 8px;">
                  ยอดชำระ: ${totalAmount}
                </div>
              </div>

              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 35%;">ชื่อลูกค้า</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #1e293b;">${customerName}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">อีเมลลูกค้า</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #1e293b;">${customerEmail}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">เบอร์โทรศัพท์</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #1e293b;">${phone}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">LINE ID</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${lineId}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">ไซส์ความยาวชุด</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0284c7;">${size}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">ส่วนสูง / น้ำหนัก</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">สูง ${height} / หนัก ${weight}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">สินค้า & บริการ</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${garment}<br><small style="color: #64748b;">(${service})</small></td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">ค่าเช่า / ตัดเย็บ</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #1e293b;">${rentFee}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">เงินประกันมัดจำ</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #166534;">${depositFee}</td></tr>
                ${discountFee !== '-' ? `<tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">ส่วนลดคูปอง</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #e11d48;">${discountFee}</td></tr>` : ''}
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">ฮูด & แถบสี</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${degree} • ${color}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">กำหนดการใช้งาน</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${gradDate}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">หมายเหตุ</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${notes}</td></tr>
                <tr><td style="padding: 8px; color: #64748b;">สลิปใน Google Drive</td><td style="padding: 8px;"><a href="${slipUrl}" style="color: #2563eb; text-decoration: underline;" target="_blank">คลิกดูสลิปโอนเงิน</a></td></tr>
              </table>

              <div style="text-align: center; margin-top: 24px;">
                <a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}" style="background: #1e293b; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; display: inline-block;">เปิดดูตารางใน Google Sheets</a>
              </div>
            </div>
            
            <div style="background: #f8fafc; padding: 12px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0;">
              Madame Gown • ระบบบันทึกคำสั่งซื้ออัตโนมัติ
            </div>
          </div>
        `;

        const mailOptions = {
          to: NOTIFICATION_EMAIL,
          subject: subject,
          htmlBody: htmlBody
        };

        if (slipBlob) {
          mailOptions.attachments = [slipBlob];
        }

        MailApp.sendEmail(mailOptions);
      } catch (mailErr) {
        console.warn('Mail dispatch error:', mailErr);
      }
    }

    // 4. ส่งอีเมลยืนยันคำสั่งซื้อไปยังผู้ซื้อ (Buyer Confirmation Email)
    if (customerEmail && customerEmail !== '-' && customerEmail.includes('@')) {
      try {
        const customerSubject = `[Madame Gown] ยืนยันคำสั่งซื้อ #${orderRef} ขอบพระคุณ คุณ${customerName}`;
        const customerHtml = `
          <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #1e293b, #0f172a); color: #ffffff; padding: 28px 24px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Madame Gown (มาดามเกาวน์)</h1>
              <p style="margin: 6px 0 0 0; color: #cbd5e1; font-size: 14px;">ใบยืนยันคำสั่งซื้อและรับชำระเงิน</p>
            </div>
            
            <div style="padding: 24px;">
              <p style="font-size: 15px; color: #334155; margin-top: 0;">
                เรียน คุณ <strong>${customerName}</strong>,
              </p>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                ทางร้านมาดามเกาวน์ได้รับข้อมูลคำสั่งซื้อหมายเลข <strong>${orderRef}</strong> พร้อมหลักฐานการชำระเงินของท่านเรียบร้อยแล้ว ช่างใหญ่กำลังตรวจสอบข้อมูลสัดส่วนเพื่อเตรียมชุดให้พอดีตัวและสง่างามที่สุดในวันสำคัญครับ
              </p>

              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
                <span style="font-size: 12px; color: #64748b; text-transform: uppercase;">หมายเลขคำสั่งซื้อของคุณ</span>
                <div style="font-size: 26px; font-weight: bold; color: #1e293b; margin-top: 4px;">${orderRef}</div>
                <div style="display: inline-block; background: #dcfce7; color: #166534; font-size: 14px; font-weight: 600; padding: 6px 16px; border-radius: 9999px; margin-top: 8px;">
                  ยอดชำระสุทธิ: ${totalAmount}
                </div>
              </div>

              <h3 style="font-size: 15px; color: #1e293b; margin-bottom: 8px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
                สรุปรายการสั่งซื้อ / จองชุด
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 35%;">สินค้า & บริการ</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #1e293b;">${garment}<br><small style="color: #64748b;">(${service})</small></td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">ไซส์ความยาวชุด</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0284c7;">${size}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">สรีระ (สูง/น้ำหนัก)</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">สูง ${height} / หนัก ${weight}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">ฮูด & แถบสี</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${degree} • ${color}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">ค่าเช่า / ค่าตัด</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #1e293b;">${rentFee}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">เงินประกันมัดจำ</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #166534;">${depositFee}</td></tr>
                ${discountFee !== '-' ? `<tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">ส่วนลดคูปอง</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #e11d48; font-weight: 600;">${discountFee}</td></tr>` : ''}
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">กำหนดการใช้งาน</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${gradDate}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">เบอร์โทรติดต่อ</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${phone} (LINE: ${lineId})</td></tr>
                ${notes !== '-' ? `<tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #64748b;">หมายเหตุ</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${notes}</td></tr>` : ''}
              </table>

              <!-- เงื่อนไขการคืนชุด & การคืนเงินมัดจำ (Return Policy) -->
              <div style="background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 10px; padding: 18px 20px; margin: 24px 0 20px 0;">
                <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #1c1917; display: flex; align-items: center; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">
                  📋 เงื่อนไขและกำหนดการส่งคืนชุดครุย &amp; การคืนเงินประกันมัดจำ
                </h4>
                
                <!-- 1. กำหนดการส่งคืน -->
                <div style="margin-bottom: 12px;">
                  <strong style="color: #44403c; font-size: 13px;">1. กำหนดการส่งคืนชุด (Return Timeline):</strong>
                  <ul style="margin: 4px 0 0 0; padding-left: 20px; font-size: 12.5px; color: #57534e; line-height: 1.6;">
                    <li><strong>เช่าวันพิธี:</strong> กำหนดส่งคืนภายใน <strong>7 วัน</strong> หลังจากเสร็จสิ้นพิธีพระราชทานปริญญาบัตร</li>
                    <li><strong>เช่าถ่ายนอกรอบ:</strong> ส่งคืนภายใน <strong>7 วัน</strong> นับจากวันที่ลูกค้ารับชุด</li>
                    <li><strong>ส่งทางพัสดุ:</strong> ทางร้านยึดจาก <strong>"ตราประทับวันที่จัดส่ง"</strong> ของขนส่ง (ไปรษณีย์ไทย / Flash / Kerry) เป็นหลัก บัณฑิตสามารถส่งวันสุดท้ายได้ทันที</li>
                  </ul>
                </div>

                <!-- 2. การคืนเงินมัดจำ -->
                <div style="margin-bottom: 12px;">
                  <strong style="color: #166534; font-size: 13px;">2. การคืนเงินประกันมัดจำ (Deposit Refund):</strong>
                  <ul style="margin: 4px 0 0 0; padding-left: 20px; font-size: 12.5px; color: #57534e; line-height: 1.6;">
                    <li><strong>โอนคืนเข้าบัญชีภายใน 1 – 3 วันทำการ</strong> หลังพนักงานตรวจเช็กสภาพชุดเรียบร้อย พร้อมส่งสลิปยืนยันทาง LINE</li>
                    <li><strong>คืนเงินสดทันที</strong> สำหรับบัณฑิตที่นำชุดมาคืนด้วยตนเองที่หน้าร้าน Madame Gown</li>
                    <li><strong>ฟรี ไม่หักเงินประกัน!</strong> สำหรับรอยเปื้อนเหงื่อไคล หรือฝุ่นละอองจากการสวมใส่ปกติ ร้านดูแลซักอบรีดมาตรฐานให้โดยไม่มีค่าใช้จ่าย</li>
                  </ul>
                </div>

                <!-- 3. อัตราค่าปรับความเสียหาย -->
                <div style="margin-bottom: 12px;">
                  <strong style="color: #991b1b; font-size: 13px;">3. ระเบียบการดูแลรักษาและอัตราค่าปรับ:</strong>
                  <ul style="margin: 4px 0 0 0; padding-left: 20px; font-size: 12.5px; color: #57534e; line-height: 1.6;">
                    <li><strong>ความเสียหายเล็กน้อยซ่อมได้</strong> (ตะเข็บปริ, กระดุมหลุด, ซิปแตก): หักเงินประกัน 50 – 150 บาท</li>
                    <li><strong>อุปกรณ์เสริมสูญหาย</strong> (เข็มวิทยฐานะ, ตราสถาบัน): ชดใช้ตามราคาอะไหล่ 150 บาท</li>
                    <li><strong>กรณีส่งคืนล่าช้า:</strong> คิดค่าปรับเริ่มต้น 50 บาท/วัน/ชุด (หากเกิน 15 – 30 วันโดยไม่มีการติดต่อแจ้งร้าน จะถือว่าซื้อขาดและริบเงินมัดจำทั้งหมด)</li>
                    <li><strong>ความเสียหายหนักซ่อมไม่ได้</strong> (ผ้าไหม้จากเตารีด, โดนบุหรี่จี้, หมึกฝังแน่น): หักค่าเปลี่ยนชิ้นส่วนหรือหักตามจริง</li>
                  </ul>
                </div>

                <!-- 4. ที่อยู่จัดส่งคืนชุด -->
                <div style="background: #f5f5f4; border-radius: 6px; padding: 10px 12px; font-size: 12px; color: #44403c; line-height: 1.5;">
                  📍 <strong>ที่อยู่จัดส่งคืนชุดพัสดุ:</strong> ห้องเสื้อ Madame Gown (แผนกคืนชุดครุย)<br>
                  โทร. 089-456-7890 | LINE: @madamegown<br>
                  <em>(เมื่อจัดส่งพัสดุแล้ว สามารถถ่ายรูปสลิปเลข Tracking แจ้งแอดมินทาง LINE ได้ตลอด 24 ชม.)</em>
                </div>
              </div>

              <div style="text-align: center; margin: 24px 0 10px 0;">
                <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">มีข้อสงสัยหรือต้องการสอบถามเพิ่มเติม?</p>
                <a href="tel:0894567890" style="background: #475569; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; display: inline-block; margin-right: 8px;">โทร. 089-456-7890</a>
                <a href="https://line.me" style="background: #16a34a; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; display: inline-block;">LINE: @madamegown</a>
              </div>
            </div>
            
            <div style="background: #f8fafc; padding: 14px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0;">
              Madame Gown (มาดามเกาวน์) • ห้องเสื้อชุดครุยวิทยฐานะและสูทสั่งตัดชั้นสูง<br>
              อีเมลฉบับนี้เป็นการยืนยันอัตโนมัติจากระบบ
            </div>
          </div>
        `;

        MailApp.sendEmail({
          to: customerEmail,
          subject: customerSubject,
          htmlBody: customerHtml
        });
      } catch (custMailErr) {
        console.warn('Customer mail dispatch error:', custMailErr);
      }
    }

    // ส่งผลลัพธ์กลับไปยังเว็บไซต์ (CORS Supported)
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      orderRef: orderRef,
      slipUrl: slipUrl
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ฟังก์ชันสำหรับทดสอบว่า Web App ทำงานได้ปกติ (เรียกผ่านเบราว์เซอร์ได้)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    message: 'Madame Gown Order Receiver is ready to accept orders!',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

