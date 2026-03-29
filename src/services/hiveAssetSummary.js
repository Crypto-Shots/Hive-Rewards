const SUPPORTED_HIVE_ASSETS = ['HIVE', 'HBD'];
export { SUPPORTED_HIVE_ASSETS };

const roundAmount = (value = 0, digits = 8) => +(+value || 0).toFixed(digits);
const roundUsd = (value = 0) => +(+value || 0).toFixed(2);

const createHiveAssetBucket = () => ({
  HIVE: { tot: 0, transactions: 0 },
  HBD: { tot: 0, transactions: 0 },
});

export const createHiveBreakdown = (hiveSenders = {}) => Object.fromEntries(
  Object.keys(hiveSenders).map((key) => [
    key,
    {
      tot: 0,
      transactions: 0,
      assets: createHiveAssetBucket(),
    },
  ])
);

export const parseHiveTransferAmount = (amount = '') => {
  const [rawValue = '', rawAsset = ''] = `${amount}`.trim().split(/\s+/);
  const asset = rawAsset.toUpperCase();
  const value = parseFloat(rawValue);

  if (!SUPPORTED_HIVE_ASSETS.includes(asset) || !Number.isFinite(value)) {
    return null;
  }

  return { asset, value };
};

export const buildInboundHiveResult = ({
  hiveResult = {},
  hiveUsd = 0,
  hbdUsd = 0,
}) => {
  const totHiveSent = roundAmount(hiveResult.totHiveSent);
  const totHbdSent = roundAmount(hiveResult.totHbdSent);
  const totHiveUsd = roundUsd(totHiveSent * hiveUsd);
  const totHbdUsd = roundUsd(totHbdSent * hbdUsd);

  return {
    ...hiveResult,
    hiveUsd: roundAmount(hiveUsd, 4),
    hbdUsd: roundAmount(hbdUsd, 4),
    totHiveUsd,
    totHbdUsd,
    totUsd: roundUsd(totHiveUsd + totHbdUsd),
  };
};

export const buildOutboundHiveRecipient = ({
  totHive = 0,
  totHbd = 0,
  hiveUsd = 0,
  hbdUsd = 0,
  hiveTransactions = 0,
  hbdTransactions = 0,
}) => {
  const totHiveUsd = roundUsd(totHive * hiveUsd);
  const totHbdUsd = roundUsd(totHbd * hbdUsd);

  return {
    totHive: roundAmount(totHive),
    totHbd: roundAmount(totHbd),
    hiveUsd: roundAmount(hiveUsd, 4),
    hbdUsd: roundAmount(hbdUsd, 4),
    totHiveUsd,
    totHbdUsd,
    totUsd: roundUsd(totHiveUsd + totHbdUsd),
    transactions: (hiveTransactions || 0) + (hbdTransactions || 0),
    hiveTransactions: hiveTransactions || 0,
    hbdTransactions: hbdTransactions || 0,
  };
};
