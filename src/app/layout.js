import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Dr Tetris',
};

export default function Page({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="header">
          <div className="logButton-cont">
            <Link href="/" className="logButton">Home</Link>
          </div>
          <h1 className="title">Dr.Tetris</h1>
        </div>
        <img className="image" src="/images/images.png" alt="Mario" />
        {children}
      </body>
    </html>
  );
}
