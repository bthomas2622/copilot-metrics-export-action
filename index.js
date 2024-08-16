import { getInput, setFailed } from '@actions/core';
import { getOctokit } from '@actions/github';
import { DefaultArtifactClient } from '@actions/artifact';
import { writeFileSync } from 'fs';
import enterprisecsv from './src/enterprisecsv';
import orgcsv from './src/orgcsv';
import teamcsv from './src/teamcsv';
import enterpriseteamcsv from './src/enterpriseteamcsv';

const getInputs = () => {
  const inputs = {
    access_token: getInput('access-token'),
    enterprise_summary: getInput('enterprise-summary'),
    enterprise_name: getInput('enterprise-name'),
    enterprise_team_summary: getInput('enterprise-team-summary'),
    enterprise_team_name: getInput('enterprise-team-name'),
    org_summary: getInput('org-summary'),
    org_name: getInput('org-name'),
    team_summary: getInput('team-summary'),
    team_name: getInput('team-name')
  };
  return inputs;
}

const run = async () => {
  try {
    const inputs = getInputs();
    const enterprise_name = inputs.enterprise_name;
    const org_name = inputs.org_name;
    const team_name = inputs.team_name;
    const enterprise_team_name = inputs.enterprise_team_name;

    const octokit = getOctokit(inputs.access_token);

    let enterprise_req;
    let org_req;
    let team_req;
    let enterprise_team_req;

    const get_enterprise_summary = inputs.enterprise_summary === 'true' || inputs.enterprise_summary === true ? true : false;
    if (get_enterprise_summary) {
      if (enterprise_name === '') {
        setFailed("Enterprise Name is required to retreive Enterprise Copilot usage");
        return;
      }
      else {
        enterprise_req = octokit.request('GET /enterprises/{enterprise}/copilot/usage', {
          enterprise: enterprise_name,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        })
      }
    }
    
    const get_org_summary = inputs.org_summary === 'true'|| inputs.org_summary === true ? true : false;
    if (get_org_summary) {
      if (org_name === '') {
        setFailed("Organization Name is required to retreive Organization Copilot usage");
        return;
      }
      else {
        org_req = octokit.request('GET /orgs/{org}/copilot/usage', {
          org: org_name,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        })
      }
    }

    const get_team_summary = inputs.team_summary === 'true' || inputs.team_summary === true ? true : false;
    if (get_team_summary) {
      if (team_name === '' || org_name === '') {
        setFailed("Both Organization and Team Name are required to retreive Team Copilot usage");
        return;
      }
      else {
        team_req = octokit.request('GET /orgs/{org}/team/{team}/copilot/usage', {
          org: org_name,
          team: team_name,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        })
      }
    }

    const get_enterprise_team_summary = inputs.enterprise_team_summary === 'true' || inputs.enterprise_team_summary === true ? true : false;
    if (get_enterprise_team_summary) {
      if (enterprise_team_name === '' || enterprise_name === '') {
        setFailed("Both Enterprise and Enterprise Team Name are required to retreive Enterprise Team Copilot usage");
        return;
      }
      else {
        enterprise_team_req = octokit.request('GET /enterprises/{enterprise}/team/{team}/copilot/usage', {
          enterprise: enterprise_name,
          team: team_name,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        })
      }
    }

    const artifact = new DefaultArtifactClient()

    if (get_enterprise_summary) {
      const enterprise_response = await enterprise_req;
      const enterprise_csv = enterprisecsv(enterprise_response.data);
      writeFileSync('enterprise_copilot_usage_metrics.csv', enterprise_csv);
      await artifact.uploadArtifact('enterprise_copilot_usage_metrics', ['enterprise_copilot_usage_metrics.csv'], '.');
    }

    if (get_org_summary) {
      const org_response = await org_req;
      const org_csv = orgcsv(org_response.data);
      writeFileSync('org_copilot_usage_metrics.csv', org_csv);
      await artifact.uploadArtifact('org_copilot_usage_metrics', ['org_copilot_usage_metrics.csv'], '.' );
    }

    if (get_team_summary) {
      const team_response = await team_req;
      const team_csv = teamcsv(team_response.data);
      writeFileSync('team_copilot_usage_metrics.csv', team_csv);
      await artifact.uploadArtifact('team_copilot_usage_metrics', ['team_copilot_usage_metrics.csv'], '.');
    }

    if (get_enterprise_team_summary) {
      const enterprise_team_response = await enterprise_team_req;
      const enterprise_team_csv = enterpriseteamcsv(enterprise_team_response.data);
      writeFileSync('enterprise_team_copilot_usage_metrics.csv', enterprise_team_csv);
      await artifact.uploadArtifact('enterprise_team_copilot_usage_metrics', ['enterprise_team_copilot_usage_metrics.csv'], '.');
    }

  }
  catch (error) {
    setFailed(error.message);
  }
}

run();