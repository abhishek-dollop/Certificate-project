import { jsPDF } from 'jspdf';
import { lustriaFontBase64 } from '../assets/fonts/lustriaBase64';

// Import image assets
import leftbaseImg from '../assets/png/leftbase.png';
import ruLogoImg from '../assets/png/RU Logo.png';
import webinarLogoImg from '../assets/png/IHAA.png';
import sealImg from '../assets/png/3 2.png';
import watermarkImg from '../assets/png/watermark.png';

// Image data cache to ensure instantaneous subsequent generations
const imageCache = new Map();

/**
 * Helper to load an image URL into an HTMLImageElement / Base64 Data URL
 */
async function preloadImage(src) {
  if (imageCache.has(src)) {
    return imageCache.get(src);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      imageCache.set(src, { dataUrl, width: canvas.width, height: canvas.height });
      resolve({ dataUrl, width: canvas.width, height: canvas.height });
    };
    img.onerror = (err) => {
      console.warn('Failed to load image asset for PDF:', src, err);
      // Resolve with empty/null to avoid breaking the entire PDF generation
      resolve(null);
    };
    img.src = src;
  });
}

/**
 * Preload all certificate assets in the background
 */
export async function preloadCertificateAssets() {
  await Promise.all([
    preloadImage(leftbaseImg),
    preloadImage(ruLogoImg),
    preloadImage(webinarLogoImg),
    preloadImage(sealImg),
    preloadImage(watermarkImg),
  ]);
}

/**
 * Generates a true vector jsPDF Document
 * @param {Object} registration - { fullName, seminarTitle, certificateId, issueDate }
 * @returns {Promise<jsPDF>}
 */
export async function buildCertificateDoc(registration = {}) {
  // Yield execution to browser loop to prevent any UI frame drops
  await new Promise((r) => setTimeout(r, 10));

  const name = registration.fullName || '';
  const seminarTitle = registration.seminarTitle || '';
  const certificateId = registration.certificateId || '';
  const issueDate = registration.issueDate
    ? new Date(registration.issueDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

  // Load high-resolution assets in parallel
  const [leftbase, ruLogo, webinarLogo, seal, watermark] = await Promise.all([
    preloadImage(leftbaseImg),
    preloadImage(ruLogoImg),
    preloadImage(webinarLogoImg),
    preloadImage(sealImg),
    preloadImage(watermarkImg),
  ]);

  // Create jsPDF Document with 800 x 560 pt canvas
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [800, 560],
    compress: true,
  });

  // 1. Embed Native TrueType Lustria Font
  try {
    doc.addFileToVFS('Lustria-Regular.ttf', lustriaFontBase64);
    doc.addFont('Lustria-Regular.ttf', 'Lustria', 'normal');
    doc.setFont('Lustria', 'normal');
  } catch (fontErr) {
    console.warn('Could not register Lustria font, falling back to serif:', fontErr);
    doc.setFont('times', 'normal');
  }

  // 2. Left Decorative Swirls / Ribbon (Preserves native high resolution)
  if (leftbase?.dataUrl) {
    doc.addImage(leftbase.dataUrl, 'PNG', -28, 9, 495, 550, undefined, 'FAST');
  }

  // 3. Watermark (Center faint logo)
  if (watermark?.dataUrl) {
    try {
      doc.setGState(new doc.GState({ opacity: 0.12 }));
      const wmWidth = 560;
      const wmHeight = 320;
      doc.addImage(watermark.dataUrl, 'PNG', 400 - wmWidth / 2, 280 - wmHeight / 2, wmWidth, wmHeight, undefined, 'FAST');
      doc.setGState(new doc.GState({ opacity: 1.0 }));
    } catch {
      // Fallback if GState not supported in environment
      doc.addImage(watermark.dataUrl, 'PNG', 400 - 280, 280 - 160, 560, 320, undefined, 'FAST');
    }
  }

  // 4. Inner Green Border (True Vector Shape)
  doc.setDrawColor(45, 160, 0); // #2DA000
  doc.setLineWidth(3);
  doc.rect(40, 40, 720, 480);

  // 5. Header Logos & Divider (Top Center)
  // Left RU Logo (Height: 80pt)
  if (ruLogo?.dataUrl) {
    const ruH = 80;
    const ruW = ruLogo.width && ruLogo.height ? (ruLogo.width / ruLogo.height) * ruH : 98.5;
    const ruX = 400 - 24 - ruW;
    doc.addImage(ruLogo.dataUrl, 'PNG', ruX, 55, ruW, ruH, undefined, 'FAST');
  }

  // Vector Vertical Divider
  doc.setDrawColor(51, 51, 51); // #333333
  doc.setLineWidth(2);
  doc.line(400, 62.5, 400, 127.5);

  // Right Webinar Logo (Height: 80pt)
  if (webinarLogo?.dataUrl) {
    const webH = 80;
    const webW = webinarLogo.width && webinarLogo.height ? (webinarLogo.width / webinarLogo.height) * webH : 74.4;
    const webX = 400 + 24;
    doc.addImage(webinarLogo.dataUrl, 'PNG', webX, 55, webW, webH, undefined, 'FAST');
  }

  // 6. Title: CERTIFICATE OF PARTICIPATION (True Selectable Vector Text)
  doc.setTextColor(5, 0, 62); // #05003E
  doc.setFont('Lustria', 'normal');
  doc.setFontSize(28.5); // ~38px
  doc.text('CERTIFICATE OF PARTICIPATION', 400, 204, { align: 'center' });

  // 7. Presented To Section
  doc.setFontSize(15); // ~20px
  doc.text('This certificate is proudly presented to', 400, 252, { align: 'center' });

  // Student Full Name (Vector text + crisp vector underline)
  doc.setFontSize(24); // ~32px
  doc.text(name, 400, 296, { align: 'center' });
  doc.setDrawColor(5, 0, 62); // #05003E
  doc.setLineWidth(2);
  const calculatedNameWidth = Math.max(260, Math.min(460, (doc.getTextWidth(name) || 0) + 60));
  doc.line(400 - calculatedNameWidth / 2, 305, 400 + calculatedNameWidth / 2, 305);

  // Participation subtitle
  doc.setFontSize(15); // ~20px
  doc.text('for actively participating in', 400, 344, { align: 'center' });

  // Seminar Title (Vector text + crisp vector underline)
  doc.setFontSize(18); // ~24px
  doc.text(seminarTitle, 400, 384, { align: 'center', maxWidth: 540 });
  const calculatedTitleWidth = Math.max(360, Math.min(540, (doc.getTextWidth(seminarTitle) || 0) + 40));
  doc.line(400 - calculatedTitleWidth / 2, 394, 400 + calculatedTitleWidth / 2, 394);

  // 8. Seal / Stamp (High-resolution PNG embedded at exact coordinates)
  if (seal?.dataUrl) {
    doc.addImage(seal.dataUrl, 'PNG', 345, 422, 110, 78, undefined, 'FAST');
  }

  // 9. Footer: Certificate ID & Issue Date (True Vector Text)
  doc.setFontSize(9.75); // ~13px
  doc.text(`Certificate ID: ${certificateId}`, 55, 516, { align: 'left' });
  doc.text(`Issue Date: ${issueDate}`, 745, 516, { align: 'right' });

  return doc;
}

/**
 * Generates and triggers download of the Certificate PDF
 * @param {Object} registration
 */
export async function generateCertificatePDF(registration) {
  const doc = await buildCertificateDoc(registration);
  const certId = registration?.certificateId || 'certificate';
  doc.save(`certificate-${certId}.pdf`);
  return doc;
}
/**
 * Generates and returns the raw vector PDF Blob of the Certificate
 * @param {Object} registration
 * @returns {Promise<Blob>}
 */
export async function getCertificatePDFBlob(registration) {
  const doc = await buildCertificateDoc(registration);
  return doc.output('blob');
}
