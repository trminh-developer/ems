import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'HeartConnect - Ứng dụng hẹn hò dành cho bạn',
  description = 'Tìm kiếm một nửa yêu thương của bạn với HeartConnect. Nền tảng kết bạn, hẹn hò an toàn và uy tín.',
  image = 'https://heartconnect-8e934.web.app/og-image.jpg',
  url = 'https://heartconnect-8e934.web.app',
  type = 'website',
}) => {
  const fullTitle = title.includes('HeartConnect') ? title : `${title} | HeartConnect`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      
      {/* OpenGraph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="HeartConnect" />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content="@heartconnect" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
