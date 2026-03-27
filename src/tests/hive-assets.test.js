import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildInboundHiveResult,
  buildOutboundHiveRecipient,
  createHiveBreakdown,
  parseHiveTransferAmount,
} from '../services/hiveAssetSummary.js';

test('parseHiveTransferAmount accepts HIVE and HBD only', () => {
  assert.deepEqual(parseHiveTransferAmount('0.010 HBD'), { asset: 'HBD', value: 0.01 });
  assert.deepEqual(parseHiveTransferAmount('1.250 HIVE'), { asset: 'HIVE', value: 1.25 });
  assert.equal(parseHiveTransferAmount('3.000 SWAP.HIVE'), null);
});

test('createHiveBreakdown preserves legacy HIVE slots and asset buckets', () => {
  const breakdown = createHiveBreakdown({ pvpHive: 'cryptoshots.tips' });
  assert.deepEqual(breakdown, {
    pvpHive: {
      tot: 0,
      transactions: 0,
      assets: {
        HIVE: { tot: 0, transactions: 0 },
        HBD: { tot: 0, transactions: 0 },
      },
    },
  });
});

test('buildInboundHiveResult adds HBD and combined hive-chain usd totals', () => {
  const result = buildInboundHiveResult({
    hiveResult: {
      totHiveSent: 1.5,
      totHbdSent: 0.25,
      totHiveTransactions: 2,
      totHbdTransactions: 1,
    },
    hiveUsd: 0.5,
    hbdUsd: 1,
  });

  assert.equal(result.totHiveUsd, 0.75);
  assert.equal(result.totHbdUsd, 0.25);
  assert.equal(result.totUsd, 1);
});

test('buildOutboundHiveRecipient tracks per-asset and combined totals', () => {
  const result = buildOutboundHiveRecipient({
    totHive: 2,
    totHbd: 0.1,
    hiveUsd: 0.5,
    hbdUsd: 1,
    hiveTransactions: 3,
    hbdTransactions: 1,
  });

  assert.equal(result.totHiveUsd, 1);
  assert.equal(result.totHbdUsd, 0.1);
  assert.equal(result.totUsd, 1.1);
  assert.equal(result.transactions, 4);
});
