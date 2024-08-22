import { getInput, setFailed, info } from '@actions/core';
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

// https://docs.github.com/en/enterprise-cloud@latest/early-access/admin/articles/rest-api-endpoints-for-enterprise-teams#list-enterprise-teams
const fetchEnterpriseTeams = async (octokit, enterprise_name) => {
  try {
    const response = await octokit.paginate('GET /enterprises/{enterprise}/teams', {
      enterprise: enterprise_name,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    if (!response || response.length === 0) {
      console.error('No data received from fetchEnterpriseTeams. Response:', response);
      throw new Error('No data received from fetchEnterpriseTeams.  Ensure you have enterprise teams defined or disable the enterprise_team_summary input.');
    }

    return response;
  } catch (error) {
    console.error('Failed to fetch enterprise teams:', error);
    throw error;
  }
};

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
    let enterprise_teams;
    let allEnterpriseTeamData = [];

    const get_enterprise_summary = inputs.enterprise_summary === 'true' || inputs.enterprise_summary === true ? true : false;
    if (get_enterprise_summary) {
      if (enterprise_name === '') {
        setFailed("Enterprise Name is required to retreive Enterprise Copilot usage");
        return;
      }
      else {
        enterprise_req = octokit.paginate('GET /enterprises/{enterprise}/copilot/usage', {
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
        org_req = octokit.paginate('GET /orgs/{org}/copilot/usage', {
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
        team_req = octokit.paginate('GET /orgs/{org}/team/{team}/copilot/usage', {
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
        // If all teams requested, call the API to get a list of all teams
        if (enterprise_team_name.includes('all') || enterprise_team_name.includes('*')) {
          const enterprise_teams_data = await fetchEnterpriseTeams(octokit, enterprise_name); // Fetch all teams from the API
          if (!enterprise_teams_data) {
            setFailed("Failed to fetch enterprise teams data");
            return;
          }

          // Sort the list of enterprise teams
          enterprise_teams_data.sort((a, b) => a.name.localeCompare(b.name));
          const enterprise_teams = enterprise_teams_data.map(team => team.name);

          // Log the list of enterprise teams to the actions log
          info(`Enterprise teams: ${enterprise_teams.join(', ')}`);

          for (const team of enterprise_teams_data) {
            const { name, slug } = team;
            try {
              const enterprise_team_req = await octokit.paginate('GET /enterprises/{enterprise}/team/{enterprise_team}/copilot/usage', {
                enterprise: enterprise_name,
                enterprise_team: slug,
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
              });
              allEnterpriseTeamData.push({ team: name, data: enterprise_team_req });
            } catch (error) {
              console.error(`Failed to fetch data for team ${team}:`, error);
            }
          }
        } else {
          const enterprise_team_req = await octokit.paginate('GET /enterprises/{enterprise}/team/{enterprise_team}/copilot/usage', {
            enterprise: enterprise_name,
            enterprise_team: enterprise_team_name,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          });
          allEnterpriseTeamData.push({ team: enterprise_team_name, data: enterprise_team_req });
        }
      }
    }

    const artifact = new DefaultArtifactClient()

    if (get_enterprise_summary) {
      const enterprise_response = await enterprise_req;
      const enterprise_csv = enterprisecsv(enterprise_response);
      writeFileSync('enterprise_copilot_usage_metrics.csv', enterprise_csv);
      await artifact.uploadArtifact('enterprise_copilot_usage_metrics', ['enterprise_copilot_usage_metrics.csv'], '.');
    }

    if (get_org_summary) {
      const org_response = await org_req;
      const org_csv = orgcsv(org_response);
      writeFileSync('org_copilot_usage_metrics.csv', org_csv);
      await artifact.uploadArtifact('org_copilot_usage_metrics', ['org_copilot_usage_metrics.csv'], '.' );
    }

    if (get_team_summary) {
      const team_response = await team_req;
      const team_csv = teamcsv(team_response);
      writeFileSync('team_copilot_usage_metrics.csv', team_csv);
      await artifact.uploadArtifact('team_copilot_usage_metrics', ['team_copilot_usage_metrics.csv'], '.');
    }

    if (get_enterprise_team_summary) {
      const enterprise_team_csv = enterpriseteamcsv(allEnterpriseTeamData);
      writeFileSync('enterprise_team_copilot_usage_metrics.csv', enterprise_team_csv);
      await artifact.uploadArtifact('enterprise_team_copilot_usage_metrics', ['enterprise_team_copilot_usage_metrics.csv'], '.');
    }

  }
  catch (error) {
    setFailed(error.message);
  }
}

run();