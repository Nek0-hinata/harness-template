# Runbook: Rollback

## Trigger Conditions
- Core metrics degrade after release
- High-severity incident detected
- Canary verification failed

## Steps
1. Run rollback recipe in controlled environment
2. Restore previous artifact / config
3. Verify recovered metrics
4. Archive evidence
5. Open incident review
