# Runbook: Standard Release

## Preconditions
- PR merged
- Required checks passed
- Change window valid
- Approvals completed

## Steps
1. `harness plan --recipe recipe.fe_change_standard --env staging`
2. `harness run --recipe recipe.fe_change_standard --env staging`
3. Verify evidence
4. Promote to canary
5. Observe telemetry for 30 min
6. Promote to full

## Rollback Conditions
- Error rate > threshold
- White screen rate > threshold
- Core action failure > threshold
