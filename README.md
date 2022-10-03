This is a demo project with a `Node.js` application, which is deployed with CICD onto `ECS Fargate` with `CloudFormation` service.

# Summary

[Introduction](https://github.com/Kirity/fargate-cicd-demo#introduction)

[Pre-requisits](https://github.com/Kirity/fargate-cicd-demo#pre-requisits)

[Architecture](https://github.com/Kirity/fargate-cicd-demo#architecture)

[Let's create the application](https://github.com/Kirity/fargate-cicd-demo#lets-create-the-application)

[Let's create the CodePipeline](https://github.com/Kirity/fargate-cicd-demo#lets-create-the-codepipeline)

[Let's create the Fargate infrastructure](https://github.com/Kirity/fargate-cicd-demo#lets-create-the-fargate-infrastructure)

[Let's test the pipeline](https://github.com/Kirity/fargate-cicd-demo#lets-test-the-pipeline)


# Pre-requisits

# Architecture

![image](https://user-images.githubusercontent.com/15073157/193616398-28088cea-2557-4e8d-89bd-5c9d6418d8b4.png)


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

### Execution of the file

Command to run in the AWS CLI is `aws cloudformation create-stack --template-body file://infrastructure/node-sample-app-pipeline.yaml --stack-name node-sample-app-pipeline`.

If CLI is not configured this can be executed via AWS UI too.

Once the pipeline is created, we need the Fargate resources, which are used to deploy our Node application.

### Created pipeline and supported resources

ECR repository

![image](https://user-images.githubusercontent.com/15073157/193581731-22ad6b40-9778-41d0-a1ad-8bdb563501b5.png)

Pipeline

![image](https://user-images.githubusercontent.com/15073157/193584105-ec50b743-a807-4898-876b-f02729e33f77.png)


# Let's create the Fargate infrastructure

File `infrastructure/node-sample-fargate-template.yaml` contains the needed resources for Fargate.

`AWS::ElasticLoadBalancingV2::LoadBalancer`: an application is load balancer is created to take the requests from internet. 

`AWS::ElasticLoadBalancingV2::TargetGroup`: a load balancer TargetGroup is created to listen the incoming `HTTP` requests on port `80`.

`AWS::ElasticLoadBalancingV2::Listener`: a listener is created to bind the TargetGroup with the LoadBalancer.

`AWS::ECS::TaskDefinition`: it defines which docker image needs to be extracted and run on Fargate. Also additional configurations like  memory, cpu, network, service role, and port mappings

`AWS::ECS::Service`: it defines the configuration over the task and Fargate cluster on which task's needs to be run. Other config like tasks desired count, VPC configs, SecurityGroup, LoadBalancer.

### Execution of the file

This CloudFormation template is executed as part of `Deploy` stage in CodePipeline.

### Created Fargate and supporting resources

Application LoadBalancer

![image](https://user-images.githubusercontent.com/15073157/193603572-b83164e0-c0dc-4a1d-b5a3-516d7c91c6d2.png)

![image](https://user-images.githubusercontent.com/15073157/193603954-748626eb-35b8-44a5-85c0-89b92d1f6126.png)

New service

![image](https://user-images.githubusercontent.com/15073157/193604240-ab41b957-3ed5-4818-a532-4fd3aedf69b8.png)

Attached task to the service

![image](https://user-images.githubusercontent.com/15073157/193604870-ebe91ea7-e4f3-4e64-a461-5410685a31fa.png)


# Let's test the pipeline

First, let us see the running version.

Copy the DNS url from the ALB and hit it in a browser. You would see as below:

![image](https://user-images.githubusercontent.com/15073157/193605517-cc37c6fa-91bc-471e-8812-311f33857cc4.png)

The corresponding source code is to print this line from soruce code in `serveer.js` is

![image](https://user-images.githubusercontent.com/15073157/193605699-8190c70d-260b-454e-9eea-12df2d81b980.png)


Now let's increase the version from `1` to `2` and `commit` to branch `master`

![image](https://user-images.githubusercontent.com/15073157/193606194-348155a2-1ae2-4403-83a6-135296337991.png)

Pipeline triggered for the corresponding `commit`

![image](https://user-images.githubusercontent.com/15073157/193606363-a5614d5e-003f-4b15-95aa-769c09535cbe.png)

Wait a while for the deployment to be successful...

![image](https://user-images.githubusercontent.com/15073157/193609534-20199d44-02ee-47ad-b1d1-3dec7d4ee135.png)

After successful deployment the version is increased to `2`.

This proved that the changes from the application are deployed into `ECS Fargate`.
