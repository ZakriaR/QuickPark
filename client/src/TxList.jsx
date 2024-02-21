export default function TxList({ txs }) {
  if (txs.length === 0) return null;

  const etherscanUrl = "https://goerli.etherscan.io/tx/";

  return (
    <>
      {txs.map((item) => (
        <div key={item} className="alert alert-info mt-5">
          <div className="flex-1">
            <a href={etherscanUrl + item.hash} target="_blank" rel="noopener noreferrer">
              {item.hash}
            </a>
          </div>
        </div>
      ))}
    </>
  );
}

