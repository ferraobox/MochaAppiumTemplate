require('colors');
const got = require('got');
const baseurl = 'http://IP:8080/job';

/**
 * - getArtifactFile - Make get call to get job status
 * @param {String} jobName
 * @returns {Promise} - body response of job status
 */
exports.getJobStatus = function (jobName) {
	return new Promise((resolve, reject) => {
		const endpoint = `/${jobName}/lastBuild/api/json`;
		console.log(`GET: ${baseurl}${endpoint}`.cyan);
		got
			.get(`${baseurl}${endpoint}`)
			.then((resultJob) => {
				const body = JSON.parse(resultJob.body);
				const infoJob = {
					result: body.result,
					number: body.number,
					artifacts: body.artifacts,
					fullDisplayName: body.fullDisplayName,
					building: body.building,
				};
				resolve(infoJob);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

/**
 * - getArtifactFile - Make get call to dowload artifact by relative path
 * @param {String} jobName
 * @param {String} relativePath
 * @returns {Promise} - body response of artifact
 */
exports.getArtifactFile = function (jobName, relativePath) {
	return new Promise((resolve, reject) => {
		const endpoint = `/${jobName}/lastSuccessfulBuild/artifact/${relativePath}`;
		console.log(`GET: ${baseurl}${endpoint}`.cyan);
		got
			.get(`${baseurl}${endpoint}`)
			.then((resultArtifacts) => {
				resolve(resultArtifacts.body);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

/**
 * launchJob -  post to launch jenkins job
 * @param {String} jobName
 * @param {Array} parameters
 * @returns {Promise} - body response
 */
exports.launchJob = function (jobName, parameters) {
	return new Promise((resolve) => {
		const options = {
			followRedirect: true,
			headers: {
				authorization: process.env.JENKINS_BASIC,
			},
			body: '{}',
		};
		let urlParameters = '';
		parameters.forEach((parameter) => {
			urlParameters += `${Object.keys(parameter)[0]}=${parameter[Object.keys(parameter)[0]]}&`;
		});
		urlParameters = urlParameters.substring(0, urlParameters.length - 1);

		const endpoint = `/${jobName}/buildWithParameters?${urlParameters}`;
		console.log(`POST: ${baseurl}${endpoint}`.blue);
		got
			.post(`${baseurl}${endpoint}`, options)
			.then((buildingJob) => {
				resolve(buildingJob.body);
			})
			.catch((err) => {
				console.log(err);
				resolve(err);
			});
	});
};
