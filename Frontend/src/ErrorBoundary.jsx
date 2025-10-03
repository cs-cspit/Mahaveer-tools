import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // You could also log to a service here
    console.error('Caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif' }}>
          <h2 style={{ color: '#b91c1c' }}>Application error</h2>
          <div style={{ whiteSpace: 'pre-wrap', background: '#fff7f7', padding: 12, borderRadius: 8, border: '1px solid #fee2e2' }}>
            <strong>{String(this.state.error && this.state.error.message)}</strong>
            <div style={{ marginTop: 12, color: '#374151' }}>{this.state.info && this.state.info.componentStack}</div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
