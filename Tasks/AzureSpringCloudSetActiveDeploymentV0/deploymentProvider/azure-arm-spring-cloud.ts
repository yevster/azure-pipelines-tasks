
import tl = require('azure-pipelines-task-lib/task');
import webClient = require('azure-pipelines-tasks-azure-arm-rest-v2/webClient');
import { AzureEndpoint } from 'azure-pipelines-tasks-azure-arm-rest-v2/azureModels';
import { ServiceClient } from 'azure-pipelines-tasks-azure-arm-rest-v2/AzureServiceClient';
import { ToError } from 'azure-pipelines-tasks-azure-arm-rest-v2/AzureServiceClientBase';
import constants = require('azure-pipelines-tasks-azure-arm-rest-v2/constants');


export class AzureSpringCloud {
    private _resourceId: string;
    private _client: ServiceClient;

    constructor(endpoint: AzureEndpoint, resourceId: string) {
        this._client = new ServiceClient(endpoint.applicationTokenCredentials, endpoint.subscriptionID, 30);
        this._resourceId = resourceId;
    }

    public async setActiveDeployment(appName: string, deploymentName: string): Promise<void> {

        var httpRequest = new webClient.WebRequest();
        httpRequest.method = 'PATCH';
        httpRequest.uri = this._client.getRequestUri(`${this._resourceId}/apps/{appName}/deployments/{deploymentName}`, {
            '{appName}': appName,
            '{deploymentName}': deploymentName
        }, null, '2019-05-01-preview');
        console.log('Request URI: ' + httpRequest.uri);
        httpRequest.body = JSON.stringify(
            {
                properties: {
                    active: true
                }
            }
        );

        var response = await this._client.beginRequest(httpRequest);
        if (response.statusCode != 200) {
            console.error('Error code: ' + response.statusCode);
            console.error(response.statusMessage);
            return Promise.reject(response.statusCode+":"+ response.statusMessage);
        }
        console.log('Response:');
        console.log(response.body);
    }
}
