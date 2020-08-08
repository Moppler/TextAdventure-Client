# Text Adventure CLI

This is a Command Line Interface for playing the Open Text Adventure. It's
designed to be "dumb" this is strictly an interface for the game. The server
will provide instructions from the server and perform them.

## Instructions

Communication with the server is performed over a web socket and is transmitted
in JSON. The server will provide one of the following instructions

### Render

The render instruction is the simplest of all instructions. The client renders 
whatever the server has sent. This message may contain formatting characters to
alter colour and layout.

```json
{
  "type": "render",
  "data": {
    "message": "...",
  }
}
```

### Prompt

This instruction asks the user for input. There are different types of prompt:
- AutoComplete
- Text
- Password
- Number
- Confirm
- Select

```json
{
  "type": "prompt",
  "data": {
    "type": "autocomplete",
    "name": "value",
    "message": "What would you like to do?",
    "choices": [
      { "title": "Login", "value": "login" }
    ]
  }
}
```