import { useState } from 'react';

function UrlForm({ onSubmit, loading }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }

    // Clear error and submit
    setError('');
    onSubmit(url);
  };

  const handleChange = (e) => {
    setUrl(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your long URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={handleChange}
            placeholder="https://example.com/very/long/url"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Shortening...
            </span>
          ) : (
            'Shorten URL'
          )}
        </button>
      </div>
    </form>
  );
}

export default UrlForm;
