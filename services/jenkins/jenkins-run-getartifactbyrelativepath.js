require('colors');
const launchJob = require('./jenkins-calls').launchJob;
const getArtifactFile = require('./jenkins-calls').getArtifactFile;
const getJobStatus = require('./jenkins-calls').getJobStatus;

/**
 * - jenkins-run-getartifactbyrelativepath - launch job and timeout of 10 min then each 1 min check the status of job and return the artifact by relative path
 * @param {String} jobName - Ex: 'one-pre-mdw-create-users',
 * @param {Array} parameters - Ex: [{ CONTRACT_FILE: 'create-user-liability-comfort' }, {START_DATE: "1"}, param3...],
 * @param {String} relativePath - Ex: 'test-files/new-user.json',
 * @return {Promise}
 */
module.exports = (jobName, parameters, relativePath) => {
	return new Promise((resolve, reject) => {
		getJobStatus(jobName)
			.then((lastJob) => {
				const lastJobNumber = lastJob.number;
				launchJob(jobName, parameters).then((launchedJob) => {
					console.log(launchedJob);
					let jobStatus = iterationCheckJob(jobName, lastJobNumber);
					const intervalAction = setInterval(async () => {
						console.log('- Next iteration 1 MIN -'.bold.blue);
						jobStatus = await iterationCheckJob(jobName, lastJobNumber);
						if (jobStatus.result !== null) {
							clearTimeout(timeoutPending);
							clearInterval(intervalAction);
							console.log(`*** THE JOB - ${jobName} - NUMBER - ${jobStatus.number} - ${jobStatus.result}`);
							if (jobStatus.result === 'SUCCESS') {
								const artifact = await getArtifactFile(jobName, relativePath);
								resolve(artifact);
							} else resolve(jobStatus);
						} else return jobStatus;
					}, 60000);

					const timeoutPending = setTimeout(() => {
						console.log('- Timeout of 10 min ended -'.bold.blue);
						clearTimeout(timeoutPending);
						clearInterval(intervalAction);
						reject(jobStatus);
					}, 600000);
				});
			})
			.catch((err) => {
				reject(err);
			});
	});
};

const iterationCheckJob = (jobName, lastJobNumber) => {
	return getJobStatus(jobName).then((jobStatus) => {
		if (jobStatus.number > lastJobNumber) console.log(`**** JOB - ${jobStatus.number} - IS BUILDING NOW in ${jobName}`.yellow.bold);
		else console.log('- NEW JOB IS NOT BUILDING YET -'.yellow);
		return jobStatus;
	});
};
