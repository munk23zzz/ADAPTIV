const fs = require('fs');

const dashCssPath = 'css/pages/dashboard.css';
let dashCss = fs.readFileSync(dashCssPath, 'utf8');

// 1. Extract Navbar (App Shell & Layout + Navbar)
const navbarRegex = /\/\* ═══════════════════════════════════════════════\r?\n   3\. NAVBAR[\s\S]*?(?=\/\* ═══════════════════════════════════════════════\r?\n   4\. GLOBAL DRAWER)/;
const navbarMatch = dashCss.match(navbarRegex);
let navbarCode = navbarMatch ? navbarMatch[0] : '';

// Also grab app shell
const shellRegex = /\/\* ═══════════════════════════════════════════════\r?\n   2\. APP SHELL & LAYOUT[\s\S]*?(?=\/\* ═══════════════════════════════════════════════\r?\n   3\. NAVBAR)/;
const shellMatch = dashCss.match(shellRegex);
let shellCode = shellMatch ? shellMatch[0] : '';

// We only want .app-shell and .app-layout from shellCode
// Actually let's just grab the whole block and remove .dashboard-main
let layoutCode = shellCode.replace(/\.dashboard-main[\s\S]*?}/, '');

fs.writeFileSync('css/components/navbar.css', layoutCode + '\n' + navbarCode);

// 2. Extract Sidebar (Global Drawer)
const sidebarRegex = /\/\* ═══════════════════════════════════════════════\r?\n   4\. GLOBAL DRAWER[\s\S]*?(?=\/\* ═══════════════════════════════════════════════\r?\n   5\. COMPONENTS)/;
const sidebarMatch = dashCss.match(sidebarRegex);
if (sidebarMatch) {
    fs.writeFileSync('css/components/sidebar.css', sidebarMatch[0]);
}

// 3. Extract Components (Buttons, Badges, etc)
const compRegex = /\/\* ═══════════════════════════════════════════════\r?\n   5\. COMPONENTS[\s\S]*?(?=\/\* ═══════════════════════════════════════════════\r?\n   6\. DASHBOARD PAGES)/;
const compMatch = dashCss.match(compRegex);
if (compMatch) {
    // Append to existing buttons.css
    let buttonsCss = fs.readFileSync('css/components/buttons.css', 'utf8');
    fs.writeFileSync('css/components/buttons.css', buttonsCss + '\n\n' + compMatch[0]);
}

// 4. Remove these sections from dashboard.css
dashCss = dashCss.replace(navbarRegex, '');
dashCss = dashCss.replace(sidebarRegex, '');
dashCss = dashCss.replace(compRegex, '');
dashCss = dashCss.replace(shellRegex, '.dashboard-main {\n  flex: 1;\n  overflow-y: auto;\n  padding: 30px 40px;\n  background: radial-gradient(circle at top right, rgba(154, 130, 219, 0.03), transparent 40%),\n    radial-gradient(circle at bottom left, rgba(208, 188, 255, 0.03), transparent 40%);\n}\n\n');

fs.writeFileSync(dashCssPath, dashCss);

console.log('Extraction complete');
