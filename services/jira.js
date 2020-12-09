const JiraClient = require('jira-connector');
// Base64 encoding of 'SirUserOfName:Password123'
const jira = new JiraClient({
	host: '',
	basic_auth: {
		base64: '',
	},
	// basic_auth: {
	//   username: 'carlos.ferrao@.com',
	//   password: ''
	// }
});

module.exports = {
	jiraService: function (resultsTest) {
		return new Promise((resolve) => {
			const name = resultsTest.fullName;
			if (name === null) {
				resolve();
			} else {
				searchIssue(resultsTest).then((res) => {
					const issuesTest = res;
					if (issuesTest.length === 0) {
						createIssue(resultsTest).then((resIssue) => {
							console.log('issuesTest: ', resIssue);
							resolve(jsonIssue(name, resIssue));
						});
					} else {
						resolve(jsonIssue(name, issuesTest));
					}
				});
			}
		});
	},
};

function jsonIssue(name, issuesTest) {
	const issue = {};
	issue[name] = issuesTest;
	return issue;
}

function createIssue(resultsTest) {
	return new Promise((resolve, reject) => {
		const summary = process.env.OS + ' - ' + resultsTest.fullName;
		const description = createDescription(resultsTest);
		const jsonIssue = {
			fields: {
				project: {
					key: 'WQA',
				},
				summary: summary,
				assignee: { name: 'carlos.ferrao' },
				description: description,
				issuetype: {
					name: 'Bug',
				},
			},
		};
		const issuesList = [];
		jira.issue.createIssue(jsonIssue, function (err, issue) {
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
		const summary = process.env.OS + ' - ' + resultsTest.fullName;
		const jsonSearch = {
			jql: `summary ~ "\\"${summary}\\"" AND project = "QA"`,
			startAt: '0',
			maxResults: '2',
			validateQuery: true,
		};
		jira.search.search(jsonSearch, function (err, output) {
			if (err) {
				console.log(err);
				reject();
			}
			if (output.issues.length > 0) {
				console.log('------> Encuentra la issue');
				processIssues(output, resultsTest).then((issuesList) => resolve(issuesList));
			} else {
				const issuesListEmpty = [];
				resolve(issuesListEmpty);
			}
		});
	});
}

function updateIssue(issue, description) {
	return new Promise((resolve, reject) => {
		const message = {
			issueKey: issue.key,
			issue: {
				issueKey: issue.key,
				update: {
					description: [
						{
							set: description,
						},
					],
					comment: [
						{
							add: {
								body: 'last reproduction: ' + new Date().toString(),
							},
						},
					],
				},
			},
		};
		jira.issue.editIssue(message, function (err, issue) {
			console.log(issue);
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
		console.log('LLega Reopen Issue: -----> ', issue.key, issue.fields.status);
		if (issue.fields.status.name === 'Done') {
			const message = {
				issueKey: issue.key,
				update: {
					comment: [
						{
							add: {
								body: 'The issue was reproduced on automated test.',
							},
						},
					],
				},
				transition: {
					id: '2',
					key: 'new',
				},
			};
			jira.issue.transitionIssue(message, function (err, issueChanged) {
				console.log(issueChanged);
				if (err) {
					reject();
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
	resultsTest.specs.forEach((step) => {
		description += '** ' + step.description + ' - ' + step.status + ' \n';
	});
	return description;
}

function processIssues(output, resultsTest) {
	return new Promise((resolve) => {
		const issuesList = [];
		const description = createDescription(resultsTest);
		Promise.all(
			output.issues.map((issue) => {
				issuesList.push(issue.key);
				return getIssueJira(issue)
					.then((issueResult) => reopenIssue(issueResult))
					.then(() => updateIssue(issue, description))
					.catch(function (err) {
						console.log(err);
					});
			})
		).then(() => {
			resolve(issuesList);
		});
	});
}

function getIssueJira(issue) {
	return new Promise((resolve, reject) => {
		jira.issue.getIssue(
			{
				issueKey: issue.key,
			},
			function (err, issueResult) {
				if (err) {
					console.log(err);
					reject();
				}
				resolve(issueResult);
			}
		);
	});
}
