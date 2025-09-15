import '../cssFiles/globals.css';
import '../cssFiles/buttons.css';
import '../cssFiles/board.css';
import ClientRoutes from '../clientLayout';

export const metadata = {
  title: 'Dr Tetris',
};

export default function RootLayout() {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="header">
          <h1 className="title">Dr.Tetris</h1>
        </div>
        <img className="shroom-img" src="/images/shroom.png" alt="Shroom" />
        <img className="piranha-img" src="/images/piranha.png" alt="Piranha" />
        <img className="mario-img" src="/images/images.png" alt="Mario" />

        <ClientRoutes />
      </body>
    </html>
  );
}
