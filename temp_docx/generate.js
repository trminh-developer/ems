const fs = require('fs');
const htmlToDocx = require('html-to-docx');
const HTML = fs.readFileSync('report.html', 'utf8');

(async () => {
  try {
    const fileBuffer = await htmlToDocx(HTML, null, {
      title: 'Báo Cáo Phân Tích Code - HeartConnect',
      margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
    });
    fs.writeFileSync('../BaoCao_PhanTichCode_HeartConnect.docx', fileBuffer);
    console.log('DOCX created successfully!');
  } catch (error) {
    console.error('Error creating DOCX:', error);
  }
})();
