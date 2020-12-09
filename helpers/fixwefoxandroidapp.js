const { execSync } = require('child_process');
module.exports = async (apppath) => {
	const stdout = await execSync(`sh setmobileanimatons.sh ${apppath} 0`, { stdout: 'inherit' }).toString();
	console.log('**** Android WA -', stdout);
	return stdout;
};
