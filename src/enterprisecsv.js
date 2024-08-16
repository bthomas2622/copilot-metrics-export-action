/**
 * Converts the provided copilot usage data for enterprise teams into a CSV string.
 * 
 * Data source: https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28#get-a-summary-of-copilot-usage-for-enterprise-members
 *
 * @param {Array} data - The data to be converted into CSV in format { team, data: enterprise_team_req.data }
 * @returns {string} The CSV string representation of the data.
 */
const enterprisecsv = (data) => {
  let csv = 'day,team,total_suggestions_count,total_acceptances_count,total_lines_suggested,total_lines_accepted,total_active_users,total_chat_acceptances,total_chat_turns,total_active_chat_users,language,editor,suggestions_count,acceptances_count,lines_suggested,lines_accepted,active_users\n';
  data.forEach((teamData) => {
    const team = teamData.team;
    teamData.data.forEach((row) => {
      row.breakdown.forEach((breakdown) => {
        csv += `${row.day},${team},${row.total_suggestions_count},${row.total_acceptances_count},${row.total_lines_suggested},${row.total_lines_accepted},${row.total_active_users},${row.total_chat_acceptances},${row.total_chat_turns},${row.total_active_chat_users},${breakdown.language},${breakdown.editor},${breakdown.suggestions_count},${breakdown.acceptances_count},${breakdown.lines_suggested},${breakdown.lines_accepted},${breakdown.active_users}\n`;
      });
    });
  });
  return csv;
};

export default enterprisecsv;