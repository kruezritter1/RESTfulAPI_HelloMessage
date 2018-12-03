
var environments={};
environments.staging={
'httpport':3000,
  'httpsport':3001,
    'envName':'Staging'
};
environments.production={
'httpport':5000,
  'httpsport':5001,
    'envName':'Production'
};
var selectedEnv=typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
var exportedEnv=typeof(environments[selectedEnv])== 'object'? environments[selectedEnv] : environments.staging;
module.exports=exportedEnv;
