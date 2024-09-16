### Installation & Setup Virtual ENV
*** Virtual env
'pip install virtualenv'
run: 'virtualenv env'
activate: 'env\scripts\activate'
deactivate: 'env\scripts\deactivate'

### Tools
Node.js >> https://nodejs.org/en/download/prebuilt-installer (it's already included npm)
Npm >> npm install -g (don't need to run this command)

-Check installation is success with correct version
npm -v
node -v

# Installing and Opening cypress
Create the folder to store the code
npm init -y (to gennerate package.json)
npm install --save-dev cypress (install cypress in the project)
npx cypress open  >> the windows will open up with examples

# Install Cypress Grep Plugin
npm install cypress-grep --save-dev
*** pls check the compatible version between cypress and grep


# Execution
npx cypress run --env grepTags=@status
# run only the tests with "auth user" in the title
$ npx cypress run --env grep="auth user"
# run tests with "hello" or "auth user" in their titles
# by separating them with ";" character
$ npx cypress run --env grep="hello; auth user"
# run tests tagged @fast
$ npx cypress run --env grepTags=@fast
# run only the tests tagged "smoke"
# that have "login" in their titles
$ npx cypress run --env grep=login,grepTags=smoke
# only run the specs that have any tests with "user" in their titles
$ npx cypress run --env grep=user,grepFilterSpecs=true
# only run the specs that have any tests tagged "@smoke"
$ npx cypress run --env grepTags=@smoke,grepFilterSpecs=true
# run only tests that do not have any tags
# and are not inside suites that have any tags
$ npx cypress run --env grepUntagged=true

# run specific file and test case
npx cypress run --spec "cypress/e2e/fcp-azure.cy.js" --env grepTags=@get_account

DEBUG='cypress:server:task' npx cypress run --spec "cypress/e2e/fcp-azure.cy.js" --env grepTags=@get_account> DEBUG_cypress-server-task.log