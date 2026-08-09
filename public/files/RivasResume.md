<p align="center" style="margin-bottom:0.5rem;"><span style="font-family:Didot; font-size:2.5em; margin-bottom:0;">Jose Rivas</span></p>
<p align="center" style="margin-bottom:0.5rem;"><span style="font-family:Didot; font-size:2em; margin-bottom:0;"><i>Senior Software Engineer</i></span></p>

<br>

<p align="center" style="margin-bottom:0.5rem;"><span style="font-family:Didot; font-size:1.1em;">Senior software engineer with 8+ years building developer platforms and CI/CD infrastructure at Capital One, currently focused on agentic developer tooling &mdash; MCP servers, Temporal workflows, and Claude/Windsurf-driven application onboarding. Track record of measurable delivery impact, including raising first-time deployment success from 70% to 93% across an enterprise release platform.</span></p>

<br>

<p align="center" style="margin-bottom:0.5rem;"><span style="font-family:Didot; font-size:1.3em;"><b>Website&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Github&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;LinkedIn&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Email&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Phone</b></span></p>
<p align="center" style="margin-bottom:0.5rem;"><span style="font-family:Didot; font-size:1.2em;"><a href=https://rotios.dev>rotios.dev</a> &emsp; &emsp; <a href=https://www.github.com/rotios>github.com/rotios</a> &emsp; &emsp; <a href=https://www.linkedin.com/in/rotios>linkedin.com/in/rotios</a> &emsp; &emsp; <a href=mailto:jose.j.rivasgarcia@gmail.com>jose.j.rivasgarcia@gmail.com</a>&emsp; &emsp; <a href=tel:+19163046262>(916) 304-6262</a></span></p>

<br>

<p style="margin-bottom:0.5rem;"><span style="font-family:Didot; font-size:2em; margin-bottom:0;">Education</span></p>

**Williams College**  &emsp;&emsp;    August 2013 - June 2017  
* B.A. in Computer Science and Russian

<p style="margin-bottom:0.5rem;"><span style="font-family:Didot; font-size:2em; margin-bottom:0;">Technical Experience</span></p>

<p style="margin-bottom:0.5rem;"><span style="font-family:Didot; font-size:1.5em; margin-bottom:0;"><b>Capital One</b> &emsp;&emsp; Plano, TX </span></p>

**Principal Associate Software Engineer** &emsp;&emsp;   June 2021 – Present
* Co-engineered an enterprise-scale, Go-based MCP server for the Internal Developer Platform (IDP), backed by Temporal, enabling developers to agentically design and onboard new applications onto Capital One infrastructure using Claude and Windsurf.
* Drove adoption to 20% of all application creation company-wide; the server now lets developers onboard hundreds of applications in a single batch instead of one at a time through the UI, saving many engineering hours.
* Designed and implemented a Go CLI providing developers access to Capital One internal tools, including application registration lookup and creation, with skills registered to the CLI that allow agents to use it to continue scaffolding their applications.
* Own authentication for Capital One's Internal Developer Platform (IDP), built on Spotify Backstage, which every developer at the company uses to track and manage their applications; standardized authentication to meet company policy where Backstage's default policies fell short, now also securing access for the MCP server, CLI, and external consumer API access.
* Architected and led a team in implementing an on-demand deployment plugin for the IDP that enables users to deploy applications to any environment, including production, by verifying they meet all Capital One release checks for pre-approval.
* Implemented GitHub auth for access control on the plugin, securely passing tokens to the backend and Temporal server, and leveraged Temporal to manage releases end-to-end for stability and retryability.
* This IDP plugin remains widely used today for on-demand deployments and immediate rollbacks (100+ per day) across the company, maintaining a >95% release success rate.
* Previously led a team of engineers maintaining and enhancing an enterprise-wide internal product that managed the deployment of enterprise products to production, averaging 100 releases per day before being sunset in favor of the new IDP deployment plugin.
* Improved the first-time deployment success rate of enterprise applications on that legacy product from 70% to 93% by analyzing failures streamed to our data lake, collaborating with dependencies to fix issues, and shifting left potential failure scenarios.
* Created new processes allowing users to transition away from legacy ECS cluster infrastructure to ECS Fargate. This process allows the user to deploy and test both infrastructures simultaneously for quicker transition speeds.
* Led a team of interns in designing, developing and deploying a new MFE that displayed the monthly cost of the users' deployed infrastructure with a quick breakdown on the types of resources they had provisioned. This led to higher discussion between our users on infrastructure costs and a reduction in spending across the organization.

**Senior Associate Software Engineer** &emsp;&emsp;   June 2018 – June 2021
* Moved CICD pipeline from Jenkins to Lambda Step Functions, ensuring greater scalability, lower costs and more secure access to AWS resources and secrets
* Architected and deployed a suite of Java SDKs for Spring Boot applications that standardized application logging and provided annotation-driven auditing capabilities, enabling Cyber to securely track incoming requests.
* Developed and integrated SpringBoot backend and Lambda functions to power a UI where teams could check their Advanced Monitoring compliance status, verifying metrics in Prometheus (later New Relic), traces in New Relic/AppDynamics, logs in Splunk, and alerting configured in PagerDuty
* Extended this tooling to automatically onboard non-compliant applications onto the required monitoring stack, injecting our metrics libraries directly into user repositories and provisioning a PagerDuty service with user-supplied escalation policies for alerting

**Associate Software Engineer** &emsp;&emsp; September 2017 – June 2018
* Engineered a suite of metrics SDKs based on Google's Four Golden Signals, headlined by a Java SDK that provided a fully out-of-the-box telemetry solution for Spring Boot applications, alongside companion libraries for JavaScript Express and Python Flask.
* Managed a Prometheus cluster and drove org-wide adoption of these libraries, establishing a single source of truth that gave every adopting application instant Grafana dashboards and streamlined PagerDuty alerting.
* Co-developed CI/CD pipelines and automated testing frameworks to enable continuous deployment and enforce strict enterprise monitoring compliance.

<p style="margin-bottom:0.5rem;"><span style="font-family:Didot; font-size:2em;">Skills</span></p>

* **Languages:** Java, Python, JavaScript, Go
* **Tools/Platforms/Frameworks:** LitJS, SpringBoot, AWS Compute \(Lambda/ECS/Fargate\), AWS DynamoDB & Aurora, Git/Github, Prometheus/Grafana, New Relic, Splunk, Elastic (Formerly ELK), Spotify Backstage
* **AI/Agentic Tooling:** MCP (Model Context Protocol), Temporal, Claude, Windsurf, Agent Skills / Tool-use Design

<p style="margin-bottom:0.5rem;"><span style="font-family:Didot; font-size:2em;">Certificates</span></p>

* **AWS Certified Solutions Architect Associate** &emsp;&emsp; 2019, 2022, 2024