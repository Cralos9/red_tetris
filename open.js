import open from 'open';

const count = 15;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

for (let i = 1; i <= count; i++) {
  const suffix = `a${i}`;
  const url = `http://10.11.3.6:3000/123/${suffix}`;
  await sleep(500);
  await open(url);
}
