
# Code Execution API

This repository contains a Node.js based backend server that provides an API for executing code snippets written in various programming languages. It supports JavaScript, Python, C++, and TypeScript.



## Features

- Execute JavaScript code using Node.js.
- Execute Python code.
- Execute C++ code.
- Compile and execute TypeScript code.
- Temporary files are automatically cleaned up after execution.
- CORS support for cross-origin requests.


## Prerequisites
- Node.js installed on your machine.
- npm (Node Package Manager) installed.
- TypeScript installed globally (npm install -g typescript).
- C++ compiler (e.g., g++) installed.
- Python installed.

## Installation

Clone my Repository

```bash
    git clone https://github.com/padmapriyar04/CC_CodeRunner.git
    cd backend
```

Install the dependencies
```bash
    npm install
``` 
Start the server
```bash
    nodemon compiler.js
```
The server will start running on port 3000.
## API Endpoints

"POST/Code"-This endpoint allows you to submit code for execution.

Request Body:
The request body should be in JSON format and include the following fields:
- 'title': The programming language of the code (js, py, cpp, or ts).
- 'body': The code to be executed.

Example Request:
{
    "title": "js",
    "body": "console.log('hello')"
}

Response:

The response will be a JSON object containing the output of the executed code or an error message if the execution fails.


## Error Handling

The server responds with appropriate HTTP status codes and error messages in case of errors:

- '400 Bad Request': If the title or body fields are missing in the request.
- '500 Internal Server Error': If there is an error during code execution or file handling.
## Acknowledgements

 - [Compilex](https://github.com/scriptnull/compilex) A node.js library for compiling and executing code.-
 - [Node.js](https://nodejs.org/en/download/package-manager) -JavaScript runtime built on Chrome's V8 JavaScript engine.


## Contributing

Contributions are always welcome! Please feel free to submit a Pull Request.

