const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function removeWhiteBackground(inputPath, outputPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Read image as base64
    const imageBase64 = fs.readFileSync(inputPath, { encoding: 'base64' });
    const dataUrl = `data:image/png;base64,${imageBase64}`;

    await page.setContent(`
        <html>
            <body>
                <canvas id="canvas"></canvas>
                <script>
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.getElementById('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const data = imageData.data;
                        
                        // Tolerance for "white"
                        const threshold = 240; 
                        
                        for (let i = 0; i < data.length; i += 4) {
                            const r = data[i];
                            const g = data[i+1];
                            const b = data[i+2];
                            
                            if (r > threshold && g > threshold && b > threshold) {
                                data[i+3] = 0; // Alpha = 0
                            }
                        }
                        
                        ctx.putImageData(imageData, 0, 0);
                        window.done = canvas.toDataURL('image/png');
                    };
                    img.src = "${dataUrl}";
                </script>
            </body>
        </html>
    `);

    // Wait for the canvas processing to finish
    await page.waitForFunction('window.done');
    const resultDataUrl = await page.evaluate('window.done');

    // Extract base64 and save
    const base64Data = resultDataUrl.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(outputPath, base64Data, 'base64');

    await browser.close();
    console.log(`Processed image saved to ${outputPath}`);
}

const input = process.argv[2];
const output = process.argv[3];

if (!input || !output) {
    console.error("Usage: node remove_bg.js <input> <output>");
    process.exit(1);
}

removeWhiteBackground(input, output).catch(console.error);
