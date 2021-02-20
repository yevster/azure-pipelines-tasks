import path = require('path');
import { Package, PackageType } from 'webdeployment-common-v2/packageUtility';
import { TaskParameters } from '../operations/taskparameters';
import { AzureSpringCloud } from './azure-arm-spring-cloud';
import { AzureRMEndpoint } from 'azure-pipelines-tasks-azure-arm-rest-v2/azure-arm-endpoint';
import { AzureEndpoint } from 'azure-pipelines-tasks-azure-arm-rest-v2/azureModels';
import tl = require('azure-pipelines-task-lib/task');

export class AzureSpringCloudDeploymentProvider {
    protected taskParameters: TaskParameters;
    protected azureEndpoint: AzureEndpoint;
    protected azureSpringCloud: AzureSpringCloud;

    constructor(taskParameters: TaskParameters) {
        this.taskParameters = taskParameters;
    }

    public async PreDeploymentStep() {
        this.azureEndpoint = await new AzureRMEndpoint(this.taskParameters.ConnectedServiceName).getEndpoint();
        this.azureSpringCloud = new AzureSpringCloud(this.azureEndpoint, this.taskParameters.SpringCloudResourceId);
    }

    public async PostDeploymentStep() {
    }

    public async UpdateDeploymentStatus(isDeploymentSuccessful: boolean) {

    }

    public async DeployAppStep() {
        if (this.taskParameters.Package.getPackageType() != PackageType.jar){
            throw('Only Jar files are currently supported.');
        }
        this.azureSpringCloud.deployJar(this.taskParameters.Package.getPath(), this.taskParameters.AppName, 
            this.taskParameters.DeploymentName, this.taskParameters.JvmOptions, this.taskParameters.EnvironmentVariables);
    }
}