import { useState } from 'react';
import UrlForm from '../components/UrlForm';
import CopyButton from '../components/CopyButton';
import { shortenUrl } from '../api/urlApi';

function Home() {
  const [shortUrl, setShortUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (originalUrl) => {
    setLoading(true);
    setError(null);
    setShortUrl(null);

    try {
      const result = await shortenUrl(originalUrl);
      setShortUrl(result.shortUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Shorten Your URLs
              <span className="text-primary-600"> Instantly</span>
            </h1>
            <p className="text-xl text-gray-600">
              Transform long, unwieldy URLs into short, shareable links
            </p>
          </div>

          {/* URL Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <UrlForm onSubmit={handleSubmit} loading={loading} />

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Success Result */}
            {shortUrl && (
              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold text-green-900">URL Shortened Successfully!</h3>
                </div>
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-300">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-800 font-mono text-lg font-medium"
                  >
                    {shortUrl}
                  </a>
                  <CopyButton text={shortUrl} />
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-primary-600 text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Generate short URLs in milliseconds with our optimized system</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-primary-600 text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Clicks</h3>
              <p className="text-gray-600">Monitor how many times your shortened URLs are accessed</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-primary-600 text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Your URLs are stored securely with enterprise-grade infrastructure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
