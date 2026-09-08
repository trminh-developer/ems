import React from 'react';

interface LinkifyTextProps {
  text: string;
}

export const LinkifyText: React.FC<LinkifyTextProps> = ({ text }) => {
  if (!text) return <span>Chưa có thông tin.</span>;

  // Split text by URLs, Emails, and Phone numbers
  // This combined regex matches all 3 and keeps them in the split array because of the outer parentheses
  const combinedRegex = /((?:https?:\/\/[^\s]+)|(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)|(?:[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(?:(?:0|\+84)[35789][0-9]{8}\b))/g;
  
  const parts = text.split(combinedRegex);

  return (
    <div style={{ whiteSpace: 'pre-line' }}>
      {parts.map((part, index) => {
        if (!part) return null;

        // Clean part to safely test
        const isUrlWithHttp = /^(https?:\/\/[^\s]+)$/.test(part);
        const isEmail = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(part);
        const isPhone = /^((?:0|\+84)[35789][0-9]{8}\b)$/.test(part);
        const isUrlWithoutHttp = /^([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)$/.test(part) && !isEmail;

        if (isEmail) {
          return (
            <a key={index} href={`mailto:${part}`} className="text-primary text-decoration-none fw-medium">
              {part}
            </a>
          );
        }

        if (isPhone) {
          // Remove non-digits except +
          const cleanPhone = part.replace(/[^\d+]/g, '');
          return (
            <a key={index} href={`tel:${cleanPhone}`} className="text-primary text-decoration-none fw-medium">
              {part}
            </a>
          );
        }

        if (isUrlWithHttp) {
          return (
            <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none fw-medium">
              {part}
            </a>
          );
        }
        
        if (isUrlWithoutHttp) {
          return (
            <a key={index} href={`https://${part}`} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none fw-medium">
              {part}
            </a>
          );
        }

        // It's just normal text
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};
