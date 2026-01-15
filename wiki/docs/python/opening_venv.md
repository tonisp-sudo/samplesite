# Python Virtual Environment (venv)

## What is Python virtual environment?

Python Virtual Environment (venv) is a feature, like a sandbox environment for Python development. 

## Why use Python virtual environment?

Virtual environment makes it easy to manage Python requirement, dependencies and packages. By opening a venv, I will only be adding to that virtual environment while leaving my global Python and other environments unchanged. It is incredibly helpful if different projects require the user to jump between different Python versions. 

Say for example that I need to have Python 3.10 for project A and Python 3.8 for prject B. My computer will default to use the newer version, which is 3.10 (unless python command is called otherwise ie. "python3.8 projectB.py"). In simple terms, a venv enables me to open up a temporary environment, where an alternative version is used and all packages installed to the alternative version are contained in that environment.

## How to start Python virtual environment?

Starting a Python virtual environment is simple. Navigate to the directory where you intend to have your project and execute the command. The syntax is as follows: python3.8 -m venv .venv : where python3.8 is the python version you require for your project, -m is the flag that a built in module is executed, venv is the built-in command to open virtual environment and .venv is the virtual environment folder to be created, which can be named anything, however the industry standard is the one used in this example. * Note that the .venv folder will be a hidden folder due to the "." infront of the name to have less clutter in the root folder.

The command above only created the virtual environment, to actually activate it and start working within it, use the following command:
source .venv/bin/activate
Your terminal prompt will change immediately, which is the best way to confirm that virtual environment is active.