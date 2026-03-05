import puppeteer from 'puppeteer';

(async () => {
    console.log('--- Starting Puppeteer E2E Tests ---');
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = (await browser.pages())[0];

        console.log('1. Loading Home Page...');
        await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });

        // Wait for a UI element to confirm React rendered properly
        await page.waitForSelector('nav', { timeout: 5000 });
        const html = await page.content();

        if (html.includes('SkillHub')) {
            console.log('Home Page loaded successfully with SkillHub brand.');
        } else {
            console.error('Home Page loaded but missing brand text.');
            process.exit(1);
        }

        console.log('2. Navigating to Register...');
        await page.goto('http://localhost:5174/register', { waitUntil: 'networkidle0' });
        await page.waitForSelector('form', { timeout: 5000 });

        console.log('3. Filling out Registration...');
        const uniqueEmail = `puppeteer${Date.now()}@test.com`;
        await page.type('input[type="text"]', 'Puppeteer User');
        await page.type('input[type="email"]', uniqueEmail);
        await page.type('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');

        console.log('4. Waiting for successful registration and redirect to Dashboard...');
        // On successful register, it redirects to /
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 });
        const currentUrl = page.url();
        if (currentUrl === 'http://localhost:5174/') {
            console.log('Redirected to Dashboard successfully.');
        } else {
            console.error('Failed to redirect. Current URL:', currentUrl);
        }

        console.log('5. Navigating to Profile to test auth context...');
        await page.goto('http://localhost:5174/profile', { waitUntil: 'networkidle0' });
        await page.waitForSelector('.glass', { timeout: 5000 });
        const profileHtml = await page.content();
        if (profileHtml.includes('Puppeteer User')) {
            console.log('Profile page verified, AuthContext is working!');
        } else {
            console.error('Auth context failed. Details not found on Profile.');
        }

        console.log('--- Puppeteer E2E Tests Complete ---');
        await browser.close();
        process.exit(0);
    } catch (e) {
        console.error('Puppeteer Test Failed:', e.message);
        if (browser) await browser.close();
        process.exit(1);
    }
})();
