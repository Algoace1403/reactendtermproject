import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
    window.location.assign("/");
  };

  render() {
    if (this.state.error) {
      return (
        <main className="grid min-h-screen place-items-center px-6">
          <div className="card max-w-md p-8 text-center">
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Something broke.
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {this.state.error.message || "An unexpected error occurred."}
            </p>
            <button onClick={this.handleReset} className="btn-primary mt-6">
              Go home
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
