import type { PropsWithChildren } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>DailyTen</title>
        <meta name="application-name" content="DailyTen" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="DailyTen" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0B0F0F" />
        <meta name="background-color" content="#0B0F0F" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" />
        <ScrollViewStyleReset />
        <style>{`
          html,
          body {
            margin: 0;
            padding: 0;
            background: #0B0F0F;
          }

          body {
            overflow-x: hidden;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
