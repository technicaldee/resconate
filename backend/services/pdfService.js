const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
    constructor() {
        this.handbookPath = path.join(__dirname, '..', '..', 'public', 'handbooks');
        if (!fs.existsSync(this.handbookPath)) {
            fs.mkdirSync(this.handbookPath, { recursive: true });
        }
    }

    /**
     * Generate a staff handbook for a business.
     * @param {object} business Business details
     */
    async generateStaffHandbook(business) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    margin: 50
                });

                const fileName = `Handbook_${business.id}_${Date.now()}.pdf`;
                const filePath = path.join(this.handbookPath, fileName);
                const stream = fs.createWriteStream(filePath);

                doc.pipe(stream);

                // --- HEADER & BRANDING ---
                doc.fontSize(28).font('Helvetica-Bold').fillColor('#003366').text('RESCONATE HR LITE', { align: 'center' });
                doc.moveDown(0.2);
                doc.fontSize(12).font('Helvetica').fillColor('#64748b').text('THE OFFICIAL EMPLOYEE GUIDEBOOK', { align: 'center', characterSpacing: 2 });

                doc.moveDown(2);
                doc.rect(50, doc.y, 495, 4).fill('#003366');
                doc.moveDown(3);

                // --- COVER PAGE BUSINESS INFO ---
                doc.fontSize(32).font('Helvetica-Bold').fillColor('#0f172a').text(business.business_name.toUpperCase(), { align: 'left' });
                doc.moveDown(0.5);
                doc.fontSize(14).font('Helvetica').fillColor('#475569').text(`Industrial Sector: ${business.business_type || 'General Commerce'}`);
                doc.text(`Authorized by: ${business.owner_name || 'Business Owner'}`);
                doc.text(`Reference ID: #${business.id}00${Date.now().toString().slice(-4)}`);

                doc.moveDown(4);
                doc.fontSize(10).font('Helvetica-Bold').fillColor('#94a3b8').text('POWERED BY THE CLOAKA AUTOMATION ENGINE', { align: 'center' });

                // --- TABLE OF CONTENTS ---
                doc.fontSize(22).font('Helvetica-Bold').fillColor('#003366').text('Table of Contents');
                doc.moveDown(1.5);
                const tocItems = [
                    '1. Our Mission & Core Values',
                    '2. General Code of Conduct',
                    '3. Compensation & Disbursement Schedule',
                    '4. Statutory Benefits & Compliance',
                    '5. Leave, Absence & Holidays',
                    '6. Disciplinary & Grievance Procedures',
                    '7. Resignation & Exit Protocols'
                ];
                tocItems.forEach((item, i) => {
                    doc.fontSize(12).font('Helvetica').fillColor('#334155').text(`${item}`, { lineGap: 10 });
                });

                doc.addPage();

                doc.addPage();

                // --- MISSION & VALUES ---
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#003366').text('1. Mission & Core Values');
                doc.moveDown(1);
                doc.fontSize(11).font('Helvetica').fillColor('#1e293b').lineGap(6).text(
                    `At ${business.business_name}, we believe in excellence and professionalism. This handbook serves as the structural foundation of our working relationship. ` +
                    `Every employee is expected to uphold the highest standards of integrity, service delivery, and mutual respect.`
                );
                doc.moveDown();
                doc.font('Helvetica-Bold').text('Professionalism:').font('Helvetica').text(' We maintain a standard of behavior that reflects positively on our brand.', { indent: 20 });
                doc.font('Helvetica-Bold').text('Efficiency:').font('Helvetica').text(' We maximize results through disciplined work habits.', { indent: 20 });

                doc.addPage();

                // --- COMPENSATION ---
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#003366').text('3. Compensation & Schedule');
                doc.moveDown(1);
                doc.fontSize(11).font('Helvetica').fillColor('#1e293b').text(
                    `Salaries are processed on a ${business.payment_frequency} basis. Disbursements are automated via the Resconate Payout Engine. ` +
                    `Ensure your details are correctly registered on the Cloaka Portal for seamless receipt of funds.`
                );
                doc.moveDown();
                doc.rect(50, doc.y, 495, 80).fill('#f8fafc');
                doc.fillColor('#475569').text('Automated Compliance Notice:', 65, doc.y - 70, { font: 'Helvetica-Bold' });
                doc.fillColor('#64748b').text(
                    'As per the Nigerian Labour Act, statutory deductions including Personal Income Tax (PAYE) and Pension contributions are calculated where applicable based on your contract terms.',
                    65, doc.y + 5
                );

                doc.addPage();

                // --- LEAVE POLICY ---
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#003366').text('5. Leave & Holidays');
                doc.moveDown(1);
                doc.fontSize(11).fillColor('#1e293b').text(
                    `In line with Resconate HR Lite best practices and Nigerian Labor Standards:`
                );
                doc.moveDown(1);
                const leaves = [
                    { t: 'Annual Leave', d: '21 Days per calendar year (paid)' },
                    { t: 'Sick Leave', d: 'Fully paid for short durations with a valid medical certificate' },
                    { t: 'Maternity/Paternity', d: '12 weeks for mothers; 5 days for fathers' }
                ];
                leaves.forEach(l => {
                    doc.font('Helvetica-Bold').text(`${l.t}: `, { continued: true }).font('Helvetica').text(l.d, { indent: 20 });
                    doc.moveDown(0.5);
                });

                // --- COMPLIANCE FOOTER Logic ---
                const range = doc.bufferedPageRange();
                for (let i = range.start; i < range.start + range.count; i++) {
                    doc.switchToPage(i);
                    doc.rect(0, doc.page.height - 40, doc.page.width, 40).fill('#f1f5f9');
                    doc.fontSize(8).fillColor('#64748b').text(
                        `OFFICIAL STAFF HANDBOOK | ${business.business_name} | PAGE ${i + 1} OF ${range.count}`,
                        0, doc.page.height - 25, { align: 'center' }
                    );
                }

                doc.end();

                stream.on('finish', () => {
                    resolve({
                        success: true,
                        fileName,
                        filePath,
                        url: `/handbooks/${fileName}`
                    });
                });

                stream.on('error', (err) => {
                    reject(err);
                });

            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = new PDFService();
