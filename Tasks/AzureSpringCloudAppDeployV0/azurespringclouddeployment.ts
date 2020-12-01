import tl = require('azure-pipelines-task-lib/task');
import { TaskParameters, TaskParametersUtility } from './operations/taskparameters';
import { AzureSpringCloudDeploymentProvider } from './deploymentProvider/AzureSpringCloudDeploymentProvider'

import path = require('path');

async function main() {
    let isDeploymentSuccess: boolean = true;

    try {
        tl.setResourcePath(path.join( __dirname, 'task.json'));
        tl.setResourcePath(path.join( __dirname, 'node_modules/azure-pipelines-tasks-azure-arm-rest-v2/module.json'));
        tl.setResourcePath(path.join( __dirname, 'node_modules/webdeployment-common-v2/module.json'));
        var taskParams: TaskParameters = TaskParametersUtility.getParameters();
        var deploymentProvider = new AzureSpringCloudDeploymentProvider(taskParams);

        tl.debug("Predeployment Step Started");
        await deploymentProvider.PreDeploymentStep();

        tl.debug("Deployment Step Started");
        await deploymentProvider.DeployAppStep();
    }
    catch(error) {
        tl.debug("Deployment Failed with Error: " + error);
        isDeploymentSuccess = false;
        tl.setResult(tl.TaskResult.Failed, error);
    }
    finally {
        if(deploymentProvider != null) {
            await deploymentProvider.UpdateDeploymentStatus(isDeploymentSuccess);
        }
        
     //   Endpoint.dispose();
        tl.debug(isDeploymentSuccess ? "Deployment Succeded" : "Deployment failed");

    }
}