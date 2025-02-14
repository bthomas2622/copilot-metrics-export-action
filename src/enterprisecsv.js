/**
 * Converts the provided copilot enterprise copilot metrics data into a CSV string.
 * 
 * Data source: https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-metrics?apiVersion=2022-11-28#get-copilot-metrics-for-an-enterprise
 *
 * @param {Array} data - The data to be converted into CSV.
 * @returns {string} The CSV string representation of the data.
 */
const enterprisecsv = (data) => {
  let csv = 'date,total_active_users,total_engaged_users,section,editor,model,is_custom_model,custom_model_training_date,language,repository,total_code_suggestions,total_code_acceptances,total_code_lines_suggested,total_code_lines_accepted,total_chats,total_chat_insertion_events,total_chat_copy_events,total_pr_summaries_created\n';
  
  data.forEach((row) => {
    const date = row.date;
    const totalActiveUsers = row.total_active_users;
    const totalEngagedUsers = row.total_engaged_users;

    const processModel = (section, editor, model, language, repository) => {
      csv += `${date},${totalActiveUsers},${totalEngagedUsers},${section},${editor},${model.name},${model.is_custom_model},${model.custom_model_training_date || ''},${language.name || ''},${repository || ''},${language.total_code_suggestions || ''},${language.total_code_acceptances || ''},${language.total_code_lines_suggested || ''},${language.total_code_lines_accepted || ''},${model.total_chats || ''},${model.total_chat_insertion_events || ''},${model.total_chat_copy_events || ''},${model.total_pr_summaries_created || ''}\n`;
    };

    if (row.copilot_ide_code_completions && row.copilot_ide_code_completions.editors) {
      row.copilot_ide_code_completions.editors.forEach((editor) => {
        editor.models.forEach((model) => {
          model.languages.forEach((language) => {
            processModel('copilot_ide_code_completions', editor.name, model, language);
          });
        });
      });
    }

    if (row.copilot_ide_chat && row.copilot_ide_chat.editors) {
      row.copilot_ide_chat.editors.forEach((editor) => {
        editor.models.forEach((model) => {
          processModel('copilot_ide_chat', editor.name, model, {});
        });
      });
    }

    if (row.copilot_dotcom_chat && row.copilot_dotcom_chat.models) {
      row.copilot_dotcom_chat.models.forEach((model) => {
        processModel('copilot_dotcom_chat', '', model, {});
      });
    }

    if (row.copilot_dotcom_pull_requests && row.copilot_dotcom_pull_requests.repositories) {
      row.copilot_dotcom_pull_requests.repositories.forEach((repository) => {
        repository.models.forEach((model) => {
          processModel('copilot_dotcom_pull_requests', '', model, {}, repository.name);
        });
      });
    }
  });

  return csv;
};

export default enterprisecsv;