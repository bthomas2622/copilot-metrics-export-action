/**
 * Converts the provided copilot enterprise-level teams usage data into a CSV string.
 * 
 * Data source: https://docs.github.com/en/enterprise-cloud@latest/rest/copilot/copilot-metrics?apiVersion=2022-11-28#get-copilot-metrics-for-an-enterprise-team
 *
 * @param {Array} data - The data to be converted into CSV in format { team, data: enterprise_team_req.data }
 * @returns {string} The CSV string representation of the data.
 */
const enterpriseteamcsv = (data) => {
  let csv = 'date,team,total_active_users,total_engaged_users,section,section_total_engaged_users,editor,editor_total_engaged_users,model,is_custom_model,custom_model_training_date,model_total_engaged_users,language,repository,total_code_suggestions,total_code_acceptances,total_code_lines_suggested,total_code_lines_accepted,total_chats,total_chat_insertion_events,total_chat_copy_events,total_pr_summaries_created\n';
  
  data.forEach((teamData) => {
    const team = teamData.team;
    teamData.data.forEach((row) => {
      const date = row.date;
      const totalActiveUsers = row.total_active_users;
      const totalEngagedUsers = row.total_engaged_users;

      // Process IDE Code Completions
      if (row.copilot_ide_code_completions) {
        const section = row.copilot_ide_code_completions;
        const sectionEngagedUsers = section.total_engaged_users || '';
        
        if (section.editors) {
          section.editors.forEach((editor) => {
            const editorEngagedUsers = editor.total_engaged_users || '';
            
            if (editor.models) {
              editor.models.forEach((model) => {
                const modelEngagedUsers = model.total_engaged_users || '';
                
                if (model.languages) {
                  model.languages.forEach((language) => {
                    csv += `${date},${team},${totalActiveUsers},${totalEngagedUsers},copilot_ide_code_completions,${sectionEngagedUsers},${editor.name},${editorEngagedUsers},${model.name},${model.is_custom_model},${model.custom_model_training_date || ''},${modelEngagedUsers},${language.name},,${language.total_code_suggestions || ''},${language.total_code_acceptances || ''},${language.total_code_lines_suggested || ''},${language.total_code_lines_accepted || ''},,,\n`;
                  });
                } else {
                  // Model without languages
                  csv += `${date},${team},${totalActiveUsers},${totalEngagedUsers},copilot_ide_code_completions,${sectionEngagedUsers},${editor.name},${editorEngagedUsers},${model.name},${model.is_custom_model},${model.custom_model_training_date || ''},${modelEngagedUsers},,,,,,,,\n`;
                }
              });
            }
          });
        }
        
        // Process top-level languages for code completions
        if (section.languages) {
          section.languages.forEach((language) => {
            csv += `${date},${team},${totalActiveUsers},${totalEngagedUsers},copilot_ide_code_completions,${sectionEngagedUsers},,${language.total_engaged_users || ''},,,,${language.name},,,,,,,,\n`;
          });
        }
      }

      // Process IDE Chat
      if (row.copilot_ide_chat) {
        const section = row.copilot_ide_chat;
        const sectionEngagedUsers = section.total_engaged_users || '';
        
        if (section.editors) {
          section.editors.forEach((editor) => {
            const editorEngagedUsers = editor.total_engaged_users || '';
            
            if (editor.models) {
              editor.models.forEach((model) => {
                const modelEngagedUsers = model.total_engaged_users || '';
                csv += `${date},${team},${totalActiveUsers},${totalEngagedUsers},copilot_ide_chat,${sectionEngagedUsers},${editor.name},${editorEngagedUsers},${model.name},${model.is_custom_model},${model.custom_model_training_date || ''},${modelEngagedUsers},,,,,,${model.total_chats || ''},${model.total_chat_insertion_events || ''},${model.total_chat_copy_events || ''},\n`;
              });
            }
          });
        }
      }

      // Process Dotcom Chat
      if (row.copilot_dotcom_chat) {
        const section = row.copilot_dotcom_chat;
        const sectionEngagedUsers = section.total_engaged_users || '';
        
        if (section.models) {
          section.models.forEach((model) => {
            const modelEngagedUsers = model.total_engaged_users || '';
            csv += `${date},${team},${totalActiveUsers},${totalEngagedUsers},copilot_dotcom_chat,${sectionEngagedUsers},,,${model.name},${model.is_custom_model},${model.custom_model_training_date || ''},${modelEngagedUsers},,,,,,${model.total_chats || ''},,,\n`;
          });
        }
      }

      // Process Dotcom Pull Requests
      if (row.copilot_dotcom_pull_requests) {
        const section = row.copilot_dotcom_pull_requests;
        const sectionEngagedUsers = section.total_engaged_users || '';
        
        if (section.repositories) {
          section.repositories.forEach((repository) => {
            if (repository.models) {
              repository.models.forEach((model) => {
                const modelEngagedUsers = model.total_engaged_users || '';
                csv += `${date},${team},${totalActiveUsers},${totalEngagedUsers},copilot_dotcom_pull_requests,${sectionEngagedUsers},,,${model.name},${model.is_custom_model},${model.custom_model_training_date || ''},${modelEngagedUsers},,${repository.name},,,,,,${model.total_pr_summaries_created || ''}\n`;
              });
            }
          });
        }
      }
    });
  });
  
  return csv;
};

export default enterpriseteamcsv;