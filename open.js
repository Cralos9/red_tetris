import open from 'open';

const count = 10;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

for (let i = 1; i <= count; i++) {
  const suffix = `a${i}`;
  const url = `http://localhost:3000/123/${suffix}`;
  await sleep(500);
  await open(url);
}
