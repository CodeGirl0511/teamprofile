const inquirer = require("inquirer");
const fs = require("fs");
const style = require("./templates/css")

const Employee = require("./lib/employee")
const Engineer = require("./lib/engineer")
const Manager = require("./lib/manager")
const Intern = require("./lib/intern")

let finalTeam = [];


function startingPrompt() {
    inquirer.prompt([
        {
            message: "/////////Welcome to Team Generator 5000! Please write your team name://///////",
            name: "teamname"
        }
    ])
        .then(function(data){
            const teamName = data.teamname
            finalTeam.push(teamName)
            addManager();
        })

    
}

function addManager() {
    inquirer.prompt([
        {
            message: "What is your team manager's name?",
            name: "name"
        },
        {
            message: "What is your team manager's email address?",
            name: "email"
        },

        {
            type: "number",
            message: "What is your team manager's office number?",
            name: "officeNumber"
        },
    ])

        .then(function (data) {
            const name = data.name
            const id = 1
            const email = data.email
            const officeNumber = data.officeNumber
            const teamMember = new Manager(name, id, email, officeNumber)
            finalTeam.push(teamMember)
            addTeamMembers();
        });

}

function addTeamMembers() {
    inquirer.prompt([
        {
            type: "list",
            message: "Would you like to add more team members?",
            choices: ["Yes, add an engineer", "Yes, add an intern", "No, my team is complete"],
            name: "addMemberData"
        }
    ])

        .then(function (data) {

            switch (data.addMemberData) {
                case "Yes, add an engineer":
                    addEngineer();
                    break;

                case "Yes, add an intern":
                    addIntern();
                    break;
                case "No, my team is complete":
                    compileTeam();
                    break;
            }
        });
}

function addEngineer() {
    inquirer.prompt([
        {
            message: "What is this engineer's name?",
            name: "name"
        },
        {
            message: "What is this engineer's email address?",
            name: "email"
        },
        {
            message: "What is this engineer's Github profile?",
            name: "github"
        }
    ])

        .then(function (data) {
            const name = data.name
            const id = finalTeam.length + 1
            const email = data.email
            const github = data.github
            const teamMember = new Engineer(name, id, email, github)
            finalTeam.push(teamMember)
            addTeamMembers()
        });

};

function addIntern() {
    inquirer.prompt([
        {
            message: "What is this intern's name?",
            name: "name"
        },
        {
            message: "What is this intern's email address?",
            name: "email"
        },
        {
            message: "What is this intern's school?",
            name: "school"
        }
    ])

        .then(function (data) {
            const name = data.name
            const id = finalTeam.length + 1
            const email = data.email
            const school = data.school
            const teamMember = new Intern(name, id, email, school)
            finalTeam.push(teamMember)
            addTeamMembers()
        });

};

function compileTeam() {
    console.log("//////////You've done it!!! Now give your team a raise.////////")

    const htmlArray = []
    const htmlBeginning = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${finalTeam[0]}</title>
    <link href="https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap" rel="stylesheet">
    <style>
     ${style}
    </style>
</head>

<body>
    <div class="banner-bar">
        <h1>${finalTeam[0]}</h1>
    </div>
    <div class="card-container">
    `
    htmlArray.push(htmlBeginning);

    for (let i = 1; i < finalTeam.length; i++) {
        let object = `
        <div class="member-card">
            <div class="card-top">
                <h2>${finalTeam[i].name}</h2>
                <h2>${finalTeam[i].title}</h2>
            </div>
            <div class="card-bottom">
                <p>Employee ID: ${finalTeam[i].id}</p>
                <p>Email: <a href="mailto:${finalTeam[i].email}">${finalTeam[i].email}</a>></p>
        `
        if (finalTeam[i].officeNumber) {
            object += `
            <p>${finalTeam[i].officeNumber}</p>
            `
        }
        if (finalTeam[i].github) {
            object += `
            <p>GitHub: <a href="https://github.com/${finalTeam[i].github}">${finalTeam[i].github}</a></p>
            `
        }
        if (finalTeam[i].school) {
            object += `
            <p>School: ${finalTeam[i].school}</p>
            `
        }
        object += `
        </div>
        </div>
        `
        htmlArray.push(object)
    }

    const htmlEnd = `
    </div>
    </body>
    </html>
    `
    htmlArray.push(htmlEnd);

    fs.writeFile(`./generated-html/${finalTeam[0]}.html`, htmlArray.join(""), function (err) {
        
    })
}

startingPrompt()

