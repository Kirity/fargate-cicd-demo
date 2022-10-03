# Introduction
In this project a sample Node application is deployed with CICD onto Fargate with CloudFormation.

# Architecture

# Let's create the CodePipeline

AWS CodePipeline is used as continious integration and continious deployment.

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



# Let's create the application
