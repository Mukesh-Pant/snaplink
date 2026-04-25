# SnapLink Frontend

The frontend application for SnapLink URL Shortener, built with React 18, Vite, and Tailwind CSS.

## Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Backend API** running on `http://localhost:3000`

## Installation

1. **Install dependencies:**

```bash
npm install
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:5173` with hot module replacement (HMR).

### Build for Production

```bash
npm run build
```

The production build will be created in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Testing

```bash
npm test
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── UrlForm.jsx       # URL input form
│   │   ├── UrlTable.jsx      # URL records table
│   │   └── CopyButton.jsx    # Copy to clipboard button
│   ├── pages/
│   │   ├── Home.jsx          # Home page with URL shortening
│   │   └── Dashboard.jsx     # Dashboard with all URLs
│   ├── api/
│   │   └── urlApi.js         # Axios API client
│   ├── App.jsx               # Root component with routing
│   ├── main.jsx              # Application entry point
│   └── index.css             # Tailwind CSS imports
├── index.html
├── vite.config.js            # Vite configuration with proxy
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
└── package.json
```

## Features

### Home Page

- **URL Shortening Form**: Enter a long URL and get a shortened version
- **Copy to Clipboard**: One-click copy functionality for shortened URLs
- **Error Handling**: Clear error messages for invalid URLs
- **Success Feedback**: Visual confirmation when URL is shortened

### Dashboard Page

- **URL Statistics**: View total URLs, total clicks, and average clicks
- **URL Table**: See all shortened URLs with:
  - Original URL (clickable)
  - Short URL (clickable)
  - Click count
  - Creation timestamp
- **Refresh Button**: Manually refresh the data
- **Real-time Updates**: Fetch latest data on page load

## Technology Stack

- **React 18** - UI library with hooks
- **Vite** - Fast build tool and dev server
- **React Router DOM v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework

## API Integration

The frontend communicates with the backend API through the following endpoints:

- `POST /api/urls` - Create shortened URL
- `GET /api/urls` - Get all URLs
- `GET /:code` - Redirect to original URL

The Vite dev server proxies API requests to `http://localhost:3000` (configured in `vite.config.js`).

## Configuration

### Vite Proxy

The `vite.config.js` file configures proxy rules to forward API requests to the backend:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
```

### Tailwind CSS

Tailwind is configured in `tailwind.config.js` with custom color schemes and content paths.

## Development

### Hot Module Replacement (HMR)

Vite provides instant HMR for React components. Changes are reflected immediately without full page reloads.

### Code Organization

- **Components**: Reusable UI components
- **Pages**: Top-level route components
- **API**: Centralized API client with error handling

## Building for Production

1. **Build the application:**

```bash
npm run build
```

2. **Preview the build:**

```bash
npm run preview
```

3. **Deploy the `dist/` directory** to your hosting provider (Vercel, Netlify, AWS S3, etc.)

## Environment Variables

For production deployment, you may need to configure the backend API URL. Create a `.env` file:

```env
VITE_API_URL=https://your-backend-api.com
```

Then update `src/api/urlApi.js` to use this environment variable.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Backend Connection Error

If you see "Failed to fetch URLs" or "Failed to shorten URL":

1. Ensure the backend server is running on `http://localhost:3000`
2. Check the browser console for CORS errors
3. Verify the proxy configuration in `vite.config.js`

### Styling Issues

If Tailwind styles are not applied:

1. Ensure PostCSS and Tailwind are installed
2. Check that `index.css` imports Tailwind directives
3. Verify `tailwind.config.js` content paths include all component files

## License

MIT
