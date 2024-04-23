# GitHub Copilot Usage Metrics API Export
This action exports usage metrics from the [GitHub Copilot Usage Metrics API](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28) into a CSV file. The files are [available as workflow artifacts in the GitHub Action run](https://docs.github.com/en/enterprise-cloud@latest/actions/managing-workflow-runs/downloading-workflow-artifacts). 

## Inputs

### `access-token`

**REQUIRED**: The access token to use for authenticating with the GitHub API. See the eligible access token types and required permissions in the [GitHub Copilot Usage Metrics API documentation](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28).

### `enterprise-summary`

`true` or `false` on whether to generate a csv for [Copilot usage for enterprise members](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28#get-a-summary-of-copilot-usage-for-enterprise-members). Default is `false`.

### `enterprise-name`

The name/slug of the enterprise to generate a csv for. Required if `enterprise-summary` is `true`. Example: `octodemo` for `https://github.com/enterprises/octodemo`.

### `org-summary`

`true` or `false` on whether to generate a csv for [Copilot usage for organization members](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28#get-a-summary-of-copilot-usage-for-organization-members). Default is `false`.

### `org-name`

The name of the organization to generate a csv for. Required if `org-summary` is `true`. Example: `octodemo` for `https://github.com/octodemo`.

### `team-summary`

`true` or `false` on whether to generate a csv for [Copilot usage for a team](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28#get-a-summary-of-copilot-usage-for-a-team). Default is `false`.

### `team-name`

The name of the team to generate a csv for. Required if `team-summary` is `true`. Example: `engineering` for `https://github.com/orgs/octodemo/teams/engineering`.

## Example usages

```yaml
uses: bthomas2622/copilot-usage-metrics-api-export@v1
with:
  access-token: ${{ secrets.authorized-pat-here}}
  org-summary: true
  org-name: octodemo
```

```yaml
uses: bthomas2622/copilot-usage-metrics-api-export@v1
with:
  access-token: ${{ secrets.authorized-pat-here}}
  enterprise-summary: true
  enterprise-name: octodemo
  org-summary: true
  org-name: octodemo
  team-summary: true
  team-name: engineering
```
