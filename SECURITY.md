# Security Policy

## Scope

This repository is currently a **prototype harness template** and is not yet intended for direct production deployment.

However, security expectations already apply to the following areas:

- secret handling
- SSH / Git credentials
- task execution boundaries
- policy enforcement
- evidence and telemetry output
- future AI / ACP task execution paths

## Current Security Posture

At the current stage:

- secrets must not be committed into the repository
- production credentials must not be used in local prototype flows
- task execution is still partly simulated and should not be treated as production-safe automation
- Git operations should go through explicit adapters and PR-based workflows

## Rules

### Do not commit
- `.env`
- tokens
- private keys
- service account credentials
- production URLs containing secrets
- exported incident data containing sensitive information

### Do not automate yet
Until the platform matures, do not let this repository directly:
- deploy to production
- modify production infrastructure
- bypass PR review
- execute high-risk AI-generated changes against sensitive paths

## Sensitive Paths

The following paths are considered sensitive and should remain protected:

- `secrets/**`
- `infra/prod/**`
- authentication-related configuration
- audit / policy-related configuration

## Reporting

If you discover a security issue in this repository or its generated workflows, report it to the maintainers before opening a public issue.

Recommended report contents:
- affected file or module
- impact summary
- reproduction steps
- suggested mitigation

## Future Hardening Checklist

- [ ] add schema-level validation for configs/specs
- [ ] introduce stricter policy evaluation
- [ ] add path allowlists for AI / ACP tasks
- [ ] separate read / PR-write / deploy / prod-deploy credentials
- [ ] standardize evidence redaction and telemetry sanitization
