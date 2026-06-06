const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'dompurify': 'isomorphic-dompurify',
    };
    return config;
  },
  turbo: {
    resolveAlias: {
      'dompurify': 'isomorphic-dompurify',
    },
  },
};

export default nextConfig;
