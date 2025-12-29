import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 RoyShop initializing...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error('Root element not found');
}

console.log('✅ Root element found');

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('❌ Error rendering app:', error);
  const errorHtml = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #0a0e27;
      color: #FF006E;
      font-family: monospace;
      padding: 20px;
      text-align: center;
    ">
      <div>
        <h1>⚠️ Application Failed to Load</h1>
        <p>${String(error)}</p>
        <p style="margin-top: 20px; font-size: 14px; color: #00D9FF;">Check console for details</p>
      </div>
    </div>
  `;
  rootElement.innerHTML = errorHtml;
}
