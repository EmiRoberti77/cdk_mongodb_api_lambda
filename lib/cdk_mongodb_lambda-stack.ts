import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import { existsSync } from 'fs';
import {
  Cors,
  LambdaIntegration,
  ResourceOptions,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { HTTP_METHOD } from '../src/util';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkMongodbLambdaStack extends cdk.Stack {
  private lambda: NodejsFunction | undefined;
  private api: RestApi | undefined;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const path = join(
      __dirname,
      '..',
      'src',
      'lambdas',
      'Mongodb',
      'handler.ts'
    );
    if (!existsSync(path)) {
      console.error('Error:Not found', path);
      return;
    }
    console.info('Message:Path found', path);

    this.lambda = new NodejsFunction(this, 'mongo_lambda', {
      functionName: 'mongo_lambda',
      runtime: Runtime.NODEJS_20_X,
      entry: path,
      handler: 'handler',
    });

    this.lambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: ['*'],
        actions: ['*'],
      })
    );

    this.api = new RestApi(this, 'mongodb_api');

    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    };

    const apiResources = this.api.root.addResource('sync', optionsWithCors);
    const lambdaIntegration = new LambdaIntegration(this.lambda);
    apiResources.addMethod(HTTP_METHOD.POST, lambdaIntegration);
    apiResources.addMethod(HTTP_METHOD.PUT, lambdaIntegration);
    apiResources.addMethod(HTTP_METHOD.DELETE, lambdaIntegration);
    apiResources.addMethod(HTTP_METHOD.GET, lambdaIntegration);

    new cdk.CfnOutput(this, 'api_endpoint', {
      value: this.api.url,
    });
  }
}
