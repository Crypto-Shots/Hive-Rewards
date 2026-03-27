import test from 'node:test';
import assert from 'node:assert/strict';

import { HiveEarningsService } from '../services/analyzers.js';

const createHiveHistoryApi = (pages) => {
  let call = 0;
  return {
    getAccountHistory: async () => pages[call++] || [],
  };
};

test('analyzeInbound counts tracked HBD transfers and keeps HIVE legacy totals', async () => {
  const service = new HiveEarningsService(createHiveHistoryApi([
    [
      [12, { timestamp: '2026-03-26T12:00:00Z', op: ['transfer', { from: 'cryptoshots.tips', to: 'alice', amount: '0.010 HBD' }] }],
      [11, { timestamp: '2026-03-26T11:59:00Z', op: ['transfer', { from: 'cryptoshots.tips', to: 'alice', amount: '1.500 HIVE' }] }],
      [10, { timestamp: '2026-03-26T11:58:00Z', op: ['transfer', { from: 'other', to: 'alice', amount: '9.000 HBD' }] }],
      [9, { timestamp: '2026-03-26T11:57:00Z', op: ['vote', { from: 'cryptoshots.tips', to: 'alice', amount: '7.000 HBD' }] }],
    ],
  ]), {
    hiveHistoryLimit: 500,
    apiCallsDelay: 0,
    hiveSenders: { PVP_HIVE: 'cryptoshots.tips' },
    verbose: false,
    log: console,
  });

  const result = await service.analyzeInbound('alice', Date.parse('2026-03-26T11:00:00Z'));

  assert.equal(result.totHiveSent, 1.5);
  assert.equal(result.totHbdSent, 0.01);
  assert.equal(result.totHiveTransactions, 1);
  assert.equal(result.totHbdTransactions, 1);
  assert.equal(result.breakdown.pvpHive.tot, 1.5);
  assert.equal(result.breakdown.pvpHive.assets.HIVE.tot, 1.5);
  assert.equal(result.breakdown.pvpHive.assets.HBD.tot, 0.01);
});

test('analyzeOutbound aggregates HBD separately per recipient', async () => {
  const service = new HiveEarningsService(createHiveHistoryApi([
    [
      [7, { timestamp: '2026-03-26T12:00:00Z', op: ['transfer', { from: 'cryptoshots.tips', to: 'alice', amount: '0.010 HBD' }] }],
      [6, { timestamp: '2026-03-26T11:59:00Z', op: ['transfer', { from: 'cryptoshots.tips', to: 'alice', amount: '1.500 HIVE' }] }],
      [5, { timestamp: '2026-03-26T11:58:00Z', op: ['transfer', { from: 'cryptoshots.tips', to: 'cryptoshots.tips', amount: '4.000 HBD' }] }],
      [4, { timestamp: '2026-03-26T11:57:00Z', op: ['transfer', { from: 'cryptoshots.tips', to: 'keychain.swap', amount: '5.000 HBD' }] }],
    ],
  ]), {
    ignoredReceivers: ['keychain.swap'],
    hiveHistoryLimit: 500,
    apiCallsDelay: 0,
    verbose: false,
    log: console,
  });

  const result = await service.analyzeOutbound('cryptoshots.tips', Date.parse('2026-03-26T11:00:00Z'));

  assert.equal(result.perRecipient.alice, 1.5);
  assert.equal(result.perRecipientTxCount.alice, 1);
  assert.equal(result.perRecipientHbd.alice, 0.01);
  assert.equal(result.perRecipientHbdTxCount.alice, 1);
  assert.equal(result.perRecipient['keychain.swap'], undefined);
});
