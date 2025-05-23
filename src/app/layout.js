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
            <Link href="/game" className="logButton">Home</Link>
          </div>
          <h1 className="title">Dr.Tetris</h1>
        </div>
        <img className="piranha-img" src="/images/piranha.png" alt="Piranha" />
        <img className="mario-img" src="/images/images.png" alt="Mario" />
        <img className="virus-img" src="/images/Virus.png" alt="Virus" />
        {children}
      </body>
    </html>
  );
}
