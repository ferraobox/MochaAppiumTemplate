const JiraClient = require('jira-connector');
// Base64 encoding of 'SirUserOfName:Password123'
const jira = new JiraClient({
  host: 'testtest.atlassian.net',
  basic_auth: {
    base64: '=='
  }
  // basic_auth: {
  //   username: 'carlos.ferrao@wefoxgroup.com',
  //   password: ''
  // }
});

module.exports = {
  jiraService: function(resultsTest) {
    return new Promise(resolve => {
      let name = resultsTest.fullName;
      if (name === null) {
        resolve();
      } else {
        searchIssue(resultsTest).then(res => {
          let issuesTest = res;
          if (issuesTest.length === 0) {
            createIssue(resultsTest).then(resIssue => {
              console.log('issuesTest: ', resIssue);
              resolve(jsonIssue(name, resIssue));
            });
          } else {
            resolve(jsonIssue(name, issuesTest));
          }
        });
      }
    });
  }
};

function jsonIssue(name, issuesTest) {
  let issue = {};
  issue[name] = issuesTest;
  return issue;
}

function createIssue(resultsTest) {
  return new Promise((resolve, reject) => {
    let summary = process.env.OS + ' - ' + resultsTest.fullName;
    let assertresult = '';
    let description = createDescription(resultsTest);
    let jsonIssue = {
      fields: {
        project: {
          key: ''
        },
        summary: summary,
        assignee: { name: '' },
        description: description,
        issuetype: {
          name: 'Bug'
        }
      }
    };
    let issuesList = [];
    jira.issue.createIssue(jsonIssue, function(err, issue) {
      if (err) {
        console.log(err);
        reject();
      }
      console.log('issue create: ', issue);
      issuesList.push(issue.key);
      resolve(issuesList);
    });
  });
}

function searchIssue(resultsTest) {
  return new Promise((resolve, reject) => {
    let summary = process.env.OS + ' - ' + resultsTest.fullName;
    let jsonSearch = {
      jql: `summary ~ "\\"${summary}\\"" AND project = "QA"`,
      startAt: '0',
      maxResults: '2',
      validateQuery: true
    };
    jira.search.search(jsonSearch, function(err, output) {
      if (err) {
        console.log(err);
        reject();
      }
      if (output.issues.length > 0) {
        processIssues(output, resultsTest).then(issuesList => resolve(issuesList));
      } else {
        let issuesListEmpty = [];
        resolve(issuesListEmpty);
      }
    });
  });
}

function updateIssue(issue, description) {
  return new Promise((resolve, reject) => {
    let message = {
      issueKey: issue.key,
      issue: {
        issueKey: issue.key,
        update: {
          description: [
            {
              set: description
            }
          ],
          comment: [
            {
              add: {
                body: 'last reproduction: ' + new Date().toString()
              }
            }
          ]
        }
      }
    };
    jira.issue.editIssue(message, function(err, issue) {
      if (err) {
        console.log(err);
        reject();
      }
      resolve();
    });
  });
}

function reopenIssue(issue) {
  return new Promise((resolve, reject) => {
    if (issue.fields.status.name === 'Done') {
      let message = {
        issueKey: issue.key,
        update: {
          comment: [
            {
              add: {
                body: 'The issue was reproduced on automated test.'
              }
            }
          ]
        },
        transition: {
          id: '2',
          key: 'new'
        }
      };
      jira.issue.transitionIssue(message, function(err, issueChanged) {
        if (err) {
          resolve();
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
}

function createDescription(resultsTest) {
  let description = 'h3. Description \n h3. (!) Pre-conditions \n * *DEVICE:* - ' + process.env.DEVICE + '\n * *OS:* ' + process.env.OS + '\n h3. (i) How to reproduce \n * Steps: \n';
  //issue information
  resultsTest.specs.forEach(step => {
    description += '** ' + step.description + ' - ' + step.status + ' \n';
  });
  return description;
}

function processIssues(output, resultsTest) {
  return new Promise(resolve => {
    let issuesList = [];
    let description = createDescription(resultsTest);
    Promise.all(
      output.issues.map(issue => {
        issuesList.push(issue.key);
        return getIssueJira(issue)
          .then(issueResult => reopenIssue(issueResult))
          .then(() => updateIssue(issue, description))
          .catch(function(err) {
            console.log('error' + '\n' + err);
          });
      })
    ).then(res => {
      resolve(issuesList);
    });
  });
}

function getIssueJira(issue) {
  return new Promise(resolve => {
    jira.issue.getIssue(
      {
        issueKey: issue.key
      },
      function(err, issueResult) {
        if (err) {
          console.log(err);
          reject();
        }
        resolve(issueResult);
      }
    );
  });
}
