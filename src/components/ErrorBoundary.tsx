import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorCount: number;
}

/**
 * IMPROVED ERROR BOUNDARY
 * 
 * This component catches any React errors and displays them instead of a blank screen.
 * Usage: Wrap your entire app with <ErrorBoundary><App /></ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorCount: 0,
    };

    // Log to window for debugging
    if (typeof window !== 'undefined') {
      (window as any).ErrorBoundaryState = this.state;
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    console.error('❌ ERROR BOUNDARY CAUGHT:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error('🔴 COMPONENT ERROR:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // Update state with error info
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Send to error tracking service (optional)
    // Example: Sentry, LogRocket, etc.
    // sendErrorToService(error, errorInfo);
  }

  handleReset = () => {
    console.log('🔄 Attempting to reset ErrorBoundary');
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#0a0e27',
            color: '#00D9FF',
            fontFamily: 'monospace',
            padding: '20px',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              textAlign: 'left',
              border: '2px solid #FF006E',
              borderRadius: '8px',
              padding: '30px',
              backgroundColor: 'rgba(0, 217, 255, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h1
                style={{
                  fontSize: '2em',
                  color: '#FF006E',
                  textShadow: '0 0 20px #FF006E',
                  margin: '0 0 10px 0',
                }}
              >
                ⚠️ Application Error
              </h1>
              <p style={{ color: '#FF006E', margin: '0', fontSize: '0.9em' }}>
                Something went wrong. Here's what we know:
              </p>
            </div>

            {/* Error Message */}
            <div
              style={{
                backgroundColor: 'rgba(255, 0, 110, 0.1)',
                border: '1px solid #FF006E',
                borderRadius: '6px',
                padding: '15px',
                marginBottom: '15px',
              }}
            >
              <p style={{ color: '#FF006E', fontSize: '0.9em', margin: '0', fontWeight: 'bold' }}>
                Error Message:
              </p>
              <p
                style={{
                  color: '#00D9FF',
                  fontSize: '0.85em',
                  margin: '10px 0 0 0',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>

            {/* Stack Trace (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
              <details style={{ marginBottom: '15px', cursor: 'pointer' }}>
                <summary
                  style={{
                    color: '#00D9FF',
                    fontSize: '0.9em',
                    padding: '8px',
                    backgroundColor: 'rgba(0, 217, 255, 0.1)',
                    borderRadius: '4px',
                    marginBottom: '10px',
                  }}
                >
                  📋 Stack Trace (click to expand)
                </summary>
                <pre
                  style={{
                    color: '#00FF41',
                    fontSize: '0.75em',
                    backgroundColor: '#0a0e27',
                    padding: '10px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '200px',
                    border: '1px solid #00FF41',
                  }}
                >
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            {/* Component Stack (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.errorInfo?.componentStack && (
              <details style={{ marginBottom: '15px', cursor: 'pointer' }}>
                <summary
                  style={{
                    color: '#00D9FF',
                    fontSize: '0.9em',
                    padding: '8px',
                    backgroundColor: 'rgba(0, 217, 255, 0.1)',
                    borderRadius: '4px',
                    marginBottom: '10px',
                  }}
                >
                  🔍 Component Stack (click to expand)
                </summary>
                <pre
                  style={{
                    color: '#B800E8',
                    fontSize: '0.75em',
                    backgroundColor: '#0a0e27',
                    padding: '10px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '200px',
                    border: '1px solid #B800E8',
                  }}
                >
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            {/* Error Count */}
            <div
              style={{
                backgroundColor: 'rgba(184, 0, 232, 0.1)',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '15px',
                fontSize: '0.85em',
                color: '#B800E8',
              }}
            >
              Error Count: {this.state.errorCount}
              {this.state.errorCount > 3 && (
                <p style={{ marginTop: '8px', color: '#FF006E' }}>
                  ⚠️ Multiple errors detected. This might be a serious issue.
                </p>
              )}
            </div>

            {/* Help Text */}
            <div style={{ marginBottom: '20px', fontSize: '0.9em', color: '#00D9FF' }}>
              <p style={{ margin: '0 0 10px 0' }}>
                <strong>What to do:</strong>
              </p>
              <ol style={{ paddingLeft: '20px', margin: '0' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Check Netlify Environment Variables</strong>
                  <br />
                  Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Netlify
                  dashboard
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Check Browser Console</strong>
                  <br />
                  Press F12, go to Console tab, and look for more detailed error messages
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Check Netlify Build Logs</strong>
                  <br />
                  Go to your site's Deploys page and check the build output
                </li>
                <li>
                  <strong>Refresh the Page</strong>
                  <br />
                  Sometimes this is just a temporary issue
                </li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={this.handleReset}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#FF006E',
                  color: '#0a0e27',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9em',
                  transition: 'all 0.3s',
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 0 20px #FF006E';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                  (e.target as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                🔄 Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#00D9FF',
                  color: '#0a0e27',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.9em',
                  transition: 'all 0.3s',
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 0 20px #00D9FF';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                  (e.target as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                🏠 Go to Home
              </button>
            </div>

            {/* Footer */}
            <p
              style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid #00D9FF',
                fontSize: '0.8em',
                color: '#888',
                textAlign: 'center',
                margin: '20px 0 0 0',
              }}
            >
              Site: {typeof window !== 'undefined' ? window.location.origin : 'Unknown'}
              <br />
              Timestamp: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
