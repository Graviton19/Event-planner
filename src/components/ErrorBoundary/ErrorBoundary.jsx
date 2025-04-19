import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for development
    console.error('Error caught by boundary:', error)
    console.error('Component stack:', errorInfo.componentStack)

    this.setState({ errorInfo })
    
    // In production, you could send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: send to error reporting service
      this.logErrorToService(error, errorInfo)
    }
  }

  logErrorToService(error, errorInfo) {
    // Implement your error reporting logic here
    console.log('Logging to error service:', {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    })
  }

  handleReset = () => {
    // Clear error state
    this.setState({ hasError: false, error: null, errorInfo: null })

    // Clear any cached state that might be causing the error
    try {
      localStorage.removeItem('selectedDates')
      localStorage.removeItem('currentStep')
      localStorage.removeItem('activeDate')
    } catch (e) {
      console.error('Error clearing local storage:', e)
    }

    // Reload the page
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3 text-red-700 mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-lg font-semibold">Something went wrong</h2>
          </div>

          <div className="bg-white rounded p-4 mb-4 overflow-auto max-h-48">
            <p className="text-red-600 mb-2">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            {this.state.errorInfo && (
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reset Application
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary