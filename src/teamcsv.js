/**
 * Converts the provided copilot team copilot usage data into a CSV string.
 * 
 * Data source: https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-metrics?apiVersion=2022-11-28#get-copilot-metrics-for-a-team
 *
 * @param {Array} data - The data to be converted into CSV.
 * @returns {string} The CSV string representation of the data.
 */
const teamcsv = (data) => {
  let csv = 'date,total_active_users,total_engaged_users,section,editor,model,is_custom_model,custom_model_training_date,language,total_code_suggestions,total_code_acceptances,total_code_lines_suggested,total_code_lines_accepted,total_chats,total_chat_insertion_events,total_chat_copy_events,total_pr_summaries_created,repository\n';
  
  data.forEach((row) => {
    const date = row.date;
    const totalActiveUsers = row.total_active_users;
    const totalEngagedUsers = row.total_engaged_users;

    // Handle copilot_ide_code_completions
    row.copilot_ide_code_completions.editors.forEach((editor) => {
      editor.models.forEach((model) => {
        model.languages.forEach((language) => {
          csv += `${date},${totalActiveUsers},${totalEngagedUsers},copilot_ide_code_completions,${editor.name},${model.name},${model.is_custom_model},${model.custom_model_training_date},${language.name},${language.total_code_suggestions},${language.total_code_acceptances},${language.total_code_lines_suggested},${language.total_code_lines_accepted},,,,,,\n`;
        });
      });
    });

    // Handle copilot_ide_chat
    row.copilot_ide_chat.editors.forEach((editor) => {
      editor.models.forEach((model) => {
        csv += `${date},${totalActiveUsers},${totalEngagedUsers},copilot_ide_chat,${editor.name},${model.name},${model.is_custom_model},${model.custom_model_training_date},,,,${model.total_chats},${model.total_chat_insertion_events},${model.total_chat_copy_events},,,\n`;
      });
    });

    // Handle copilot_dotcom_chat
    row.copilot_dotcom_chat.models.forEach((model) => {
      csv += `${date},${totalActiveUsers},${totalEngagedUsers},copilot_dotcom_chat,,,${model.name},${model.is_custom_model},${model.custom_model_training_date},,,,${model.total_chats},,,,\n`;
    });

    // Handle copilot_dotcom_pull_requests
    row.copilot_dotcom_pull_requests.repositories.forEach((repository) => {
      repository.models.forEach((model) => {
        csv += `${date},${totalActiveUsers},${totalEngagedUsers},copilot_dotcom_pull_requests,,,${model.name},${model.is_custom_model},${model.custom_model_training_date},,,,,,,${model.total_pr_summaries_created},${repository.name}\n`;
      });
    });
  });

  return csv;
};

export default teamcsv;