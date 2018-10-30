
# WitnessProtection - Raspbian

This is a  Whaleshares Witness Failover Tool, written in NodeJS and based off of the original design by the Witness @kennybll, he is a solid guy,
and did excellent work in that project which you can find HERE, though I have added a few features to this version to make it more
'User-Friendly'. For starters, I have involved a visual GUI component to the server, which can be viewed by visiting the URL 127.0.0.1:3000, which is the address for your local host. The GUI will make storing, and maintaining data much simpler, as well as simplifying the run process. This tool was designed to be used in our home PC's, though I know there are people who will want to run this on their witness server, so I will be including a headless configuration as soon as possible.

## Version
**0.8**

## Installation

- WitnessProtection requires [Node.js](https://nodejs.org/) v4+ to run.


#### Install NodeJS V10
```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Install Dependencies
Once NodeS has been Installed, you will need to use NPM to install the required packages for the tool. CD into the project Directory, and then run 'npm install'.
```
cd /insert/project/directory
npm install
```

## Usage
Ensure you have posted the correct details in the .env file, (if file is names '.1.env', rename to '.env'). If details are correct, and you are in the directory of the project;
```
node app.js
```

## ToDo:
- Cleanup **(V1.0)**
- Validation **(V1.3)**
- Security **(V1.5)**
- Headless **(V1.8)**
- GUI Updates **(2.0)**
