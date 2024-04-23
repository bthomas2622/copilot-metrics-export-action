/**
 * Converts the provided copilot team copilot usage data into a CSV string.
 * 
 * Data source: https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28#get-a-summary-of-copilot-usage-for-a-team
 *
 * @param {Array} data - The data to be converted into CSV.
 * @returns {string} The CSV string representation of the data.
 */
const orgcsv = (data) => {
  let csv = 'day,total_suggestions_count,total_acceptances_count,total_lines_suggested,total_lines_accepted,total_active_users,total_chat_acceptances,total_chat_turns,total_active_chat_users,language,editor,suggestions_count,acceptances_count,lines_suggested,lines_accepted,active_users\n';
  data.forEach((row) => {
    row.breakdown.forEach((breakdown) => {
      csv += `${row.day},${row.total_suggestions_count},${row.total_acceptances_count},${row.total_lines_suggested},${row.total_lines_accepted},${row.total_active_users},${row.total_chat_acceptances},${row.total_chat_turns},${row.total_active_chat_users},${breakdown.language},${breakdown.editor},${breakdown.suggestions_count},${breakdown.acceptances_count},${breakdown.lines_suggested},${breakdown.lines_accepted},${breakdown.active_users}\n`;
    });
  });
  return csv;
};

export default orgcsv;