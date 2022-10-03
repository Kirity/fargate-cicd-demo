# Introduction

In this a demo project with a Node.js application which is deployed with CICD onto Fargate with CloudFormation.

# Pre-requisits

# Architecture

# Let's create the application

It is a simple Hello World application, which will respond to our request. It listens on the port `8080` and returns a String with versio and hostname.

Source code is in the file `server.js`. Dependencies and metadata are in the file `package.json`.

A simple `Dockerfile` is created to install the needed dependencies, start the application, and expose the application on the port `8080`.

Once the application is ready, we need a pipeline to extract, build and deploy our application, so let's do it.

# Let's create the CodePipeline

AWS CodePipeline is used as continious integration and continious deployment.

### Infrastructure details
`infrastructure/node-sample-app-pipeline.yaml`: this file contains the code to create the piepline with CloudFormation.

The resources created are:

`AWS::ECR::Repository`: this is the docker file repository used to store the application docker file

`AWS::S3::Bucket`: a S3 bucekt is created to save the build artifacts.

`AWS::CodeBuild::Project`: [CodeBuild](https://aws.amazon.com/codebuild/) is a fully managed build tool. This would provide a build environment to execute the build steps with following details:
  - `ComputeType`: name of the build virtual server with configuration 4 GB memory, 2 vCPUs, 50 GB disk space
  - `Image`: image used to create the virtual environment
  - `ServiceRole`: execution role
  - `BuildSpec`: file name(should be present in root directory), which contains the build instrutions.

`AWS::CodePipeline::Pipeline`: instance of the CodePipeline. It would will have three stages namely Soruce, Build, Deploy.
  - `Source`: to link the GitHub project to the pipeline.
  - `Build`: the above created build project is used here.
  - `Deploy`: in this step a CloudFormation template is executed in CF service. 

### Execute the file

Command to run in the AWS CLI is `aws cloudformation create-stack --template-body file://node-sample-app-pipeline.yaml --stack-name node-sample-app-pipeline`.

If CLI is not configured this can be executed via AWS UI too.

Once the pipeline is created, we need the Fargate resources, which are used to deploy our Node application.

### Created resources

ECR repository

![image](https://user-images.githubusercontent.com/15073157/193581731-22ad6b40-9778-41d0-a1ad-8bdb563501b5.png)



# Let's create the Fargate infrastructure


