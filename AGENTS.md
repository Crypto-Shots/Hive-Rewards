# Repository Notes

## Critical Root Docs Rule

Keeping these two root docs up to date is critical:

- `E:\CODE\CS\AGENTS.md`
- `E:\CODE\CS\PVP_LAYERS.md`

If work in this repo changes architecture assumptions, rewards tracking responsibilities, or the way the broader Crypto Shots system should be understood, update the affected root doc or docs in the same change.

If either root doc is missing or unreachable, notify the user immediately.

## Purpose

- `hiverewards` is a Node/browser SDK and CLI for analyzing inbound and outbound rewards on Hive.
- The public package entrypoints live in `src/index.js` and `src/rewards.js`.

## Key Code Paths

- Hive-chain transfer analysis lives in `src/services/analyzers.js`.
- Result shaping and sorting for `inbounds()` / `outbounds()` lives in `src/services/orchestrator.js`.
- API wrappers and price fetching live under `src/apis/`.
- Package-level docs and usage examples live in `README.md`.

## Maintenance Rules

- Preserve backward compatibility for existing HIVE fields when adding new assets or totals.
- When reward analysis behavior changes, update `README.md` in the same change.
- When broader architecture/rewards-layer understanding changes, update the required root docs in the same change.
- Prefer deterministic unit tests over live-chain example scripts for new coverage.
- Do not remove the example scripts in `src/tests/`; they are still useful for manual verification.

## Release Flow

- Ship code changes on a feature branch and open a merge request targeting `main`.
- After merge, bump the package version, publish the release, and push the Git tag.
- Treat the GitHub tag/release as part of the rollout, not a follow-up.
