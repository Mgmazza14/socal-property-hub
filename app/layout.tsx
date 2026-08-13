import React from 'react';

export const metadata = {
  title: 'SoCal Property Hub',
  description: 'Property management in Ventura and LA Counties',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
