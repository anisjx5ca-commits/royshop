import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 RoyShop initializing...');
console.log('📦 Node env:', import.meta.env.MODE);

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
  const errorMessage = error instanceof Error ? error.message : String(error);
  const isEnvError = errorMessage.includes('Supabase') || errorMessage.includes('environment');
  
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
      line-height: 1.6;
    ">
      <div style="max-width: 600px;">
        <h1>⚠️ Application Error</h1>
        <p style="color: #FF006E; font-size: 16px; margin: 20px 0;">${errorMessage}</p>
        ${isEnvError ? `
          <div style="background: rgba(255, 0, 110, 0.1); border: 2px solid #FF006E; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="color: #00D9FF; font-weight: bold;">🔧 Fix Required:</p>
            <p>Add environment variables to Netlify:</p>
            <p style="font-size: 12px; color: #00D9FF;">
              Settings → Environment → Add Variables:<br/>
              VITE_SUPABASE_URL<br/>
              VITE_SUPABASE_ANON_KEY<br/>
              Then: Deploys → Trigger deploy
            </p>
          </div>
        ` : ''}
        <p style="margin-top: 20px; font-size: 14px; color: #00D9FF;">Press F12 → Console tab for full error details</p>
      </div>
    </div>
  `;
  rootElement.innerHTML = errorHtml;
}
