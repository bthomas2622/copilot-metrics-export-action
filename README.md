# GitHub Copilot Usage Metrics API Export
This action exports usage metrics from the [GitHub Copilot Usage Metrics API](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28) into a CSV file. The files are [available as workflow artifacts in the GitHub Action run](https://docs.github.com/en/enterprise-cloud@latest/actions/managing-workflow-runs/downloading-workflow-artifacts). 

## Inputs

| Input              | Description                                                                                                                             | Required | Default |
|--------------------|-----------------------------------------------------------------------------------------------------------------------------------------|----------|---------|
| `access-token`     | The access token to use for authenticating with the GitHub API. See the eligible access token types and required permissions in the [GitHub Copilot Usage Metrics API documentation](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28).                                                                         | Yes | - |
| `enterprise-summary` | `true` or `false` on whether to generate a csv for [Copilot usage for enterprise members](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28#get-a-summary-of-copilot-usage-for-enterprise-members). | No | `false` |
| `enterprise-name`  | The name/slug of the enterprise to generate a csv for. Example: `myent` for `https://github.com/enterprises/myent`. | If `enterprise-summary` is `true` | - |
| `org-summary`      | `true` or `false` on whether to generate a csv for [Copilot usage for organization members](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28#get-a-summary-of-copilot-usage-for-organization-members). | No | `false` |
| `org-name`         | The name of the organization to generate a csv for. Example: `myorg` for `https://github.com/myorg`. | No | Name of organization that action is running in. |
| `team-summary`     | `true` or `false` on whether to generate a csv for [Copilot usage for a team](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28#get-a-summary-of-copilot-usage-for-a-team). | No | `false` |
| `team-name`        | The name of the team to generate a csv for. Example: `engineering` for `https://github.com/orgs/octodemo/teams/engineering`. | If `team-summary` is `true` | - |

## Usage

In order to run this action you must create a GitHub Action workflow (`.github/workflows/copilot-api-export.yml`). See [Creating a Workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Examples

```yaml
name: Copilot Usage Metrics Export
on:
  workflow_dispatch:

jobs:
  run:
    name: Copilot Usage Metrics Export Action
    runs-on: ubuntu-latest
    steps:
      - uses: bthomas2622/copilot-metrics-export-action@v1.1
        with:
          access-token: ${{ secrets.authorized-pat-here}}
          org-summary: true
          org-name: myorg
```

```yaml
uses: bthomas2622/copilot-metrics-export-action@v1.1
with:
  access-token: ${{ secrets.authorized-pat-here}}
  enterprise-summary: true
  enterprise-name: myenterprise
  org-summary: true
  org-name: myorg
  team-summary: true
  team-name: engineering
```

## Creating an Access Token

See the eligible access token types and required permissions in the [GitHub Copilot Usage Metrics API documentation](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28).

### Personal Access Tokens (Classic)

If you choose to utilize [a Personal Access Token (PAT) (Classic)](https://github.com/settings/tokens/new?scopes=admin:org) it must possess `copilot`, `manage_billing:copilot`, `admin:org`, `admin:enterprise`, or `manage_billing:enterprise` scope to use the Copilot Usage Metrics API endpoint.

Add this PAT as a secret so it can be used as input for `access-token`, see [Creating encrypted secrets for a repository](https://docs.github.com/en/enterprise-cloud@latest/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository).

### Organizations

If your organization has SAML enabled you must authorize the PAT, see [Authorizing a personal access token for use with SAML single sign-on](https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on/authorizing-a-personal-access-token-for-use-with-saml-single-sign-on).

## Downloading your files

The files are [available as workflow artifacts in the GitHub Action run](https://docs.github.com/en/enterprise-cloud@latest/actions/managing-workflow-runs/downloading-workflow-artifacts). 

![Screenshot 2024-04-24 at 9 06 11 AM](https://github.com/bthomas2622/copilot-metrics-export-action/assets/15069517/820118c7-7745-4157-8c49-a1648ff18bfc)

