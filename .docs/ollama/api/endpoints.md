Endpoints

Generate a response

Generates a response for the provided prompt

POST /api/generate

curl <http://localhost:11434/api/generate> -d '{
  "model": "gemma3",
  "prompt": "Why is the sky blue?"
}'

200
{
  "model": "<string>",
  "created_at": "<string>",
  "response": "<string>",
  "thinking": "<string>",
  "done": true,
  "done_reason": "<string>",
  "total_duration": 123,
  "load_duration": 123,
  "prompt_eval_count": 123,
  "prompt_eval_duration": 123,
  "eval_count": 123,
  "eval_duration": 123,
  "logprobs": [
    {
      "token": "<string>",
      "logprob": 123,
      "bytes": [
        123
      ],
      "top_logprobs": [
        {
          "token": "<string>",
          "logprob": 123,
          "bytes": [
            123
          ]
        }
      ]
    }
  ]
}
Body
application/json
​
model
stringrequired
Model name

​
prompt
string
Text for the model to generate a response from

​
suffix
string
Used for fill-in-the-middle models, text that appears after the user prompt and before the model response

​
images
string[]
Base64-encoded images for models that support image input

​
format

string
string
Structured output format for the model to generate a response from. Supports either the string "json" or a JSON schema object.

​
system
string
System prompt for the model to generate a response from

​
stream
booleandefault:true
When true, returns a stream of partial responses

​
think

boolean
boolean
When true, returns separate thinking output in addition to content. Can be a boolean (true/false) or a string ("high", "medium", "low") for supported models.

​
raw
boolean
When true, returns the raw response from the model without any prompt templating

​
keep_alive

string
string
Model keep-alive duration (for example 5m or 0 to unload immediately)

​
options
object
Runtime options that control text generation

Show child attributes

​
logprobs
boolean
Whether to return log probabilities of the output tokens

​
top_logprobs
integer
Number of most likely tokens to return at each token position when logprobs are enabled

Response

200

application/json
Generation responses

​
model
string
Model name

​
created_at
string
ISO 8601 timestamp of response creation

​
response
string
The model's generated text response

​
thinking
string
The model's generated thinking output

​
done
boolean
Indicates whether generation has finished

​
done_reason
string
Reason the generation stopped

​
total_duration
integer
Time spent generating the response in nanoseconds

​
load_duration
integer
Time spent loading the model in nanoseconds

​
prompt_eval_count
integer
Number of input tokens in the prompt

​
prompt_eval_duration
integer
Time spent evaluating the prompt in nanoseconds

​
eval_count
integer
Number of output tokens generated in the response

​
eval_duration
integer
Time spent generating tokens in nanoseconds

​
logprobs
object[]
Log probability information for the generated tokens when logprobs are enabled

Show child attributes

---

Endpoints
Generate a chat message

Generate the next chat message in a conversation between a user and an assistant.

POST /api/chat

curl http://localhost:11434/api/chat -d '{
  "model": "gemma3",
  "messages": [
    {
      "role": "user",
      "content": "why is the sky blue?"
    }
  ]
}'

200
{
  "model": "<string>",
  "created_at": "2023-11-07T05:31:56Z",
  "message": {
    "role": "assistant",
    "content": "<string>",
    "thinking": "<string>",
    "tool_calls": [
      {
        "function": {
          "name": "<string>",
          "description": "<string>",
          "arguments": {}
        }
      }
    ],
    "images": [
      "<string>"
    ]
  },
  "done": true,
  "done_reason": "<string>",
  "total_duration": 123,
  "load_duration": 123,
  "prompt_eval_count": 123,
  "prompt_eval_duration": 123,
  "eval_count": 123,
  "eval_duration": 123,
  "logprobs": [
    {
      "token": "<string>",
      "logprob": 123,
      "bytes": [
        123
      ],
      "top_logprobs": [
        {
          "token": "<string>",
          "logprob": 123,
          "bytes": [
            123
          ]
        }
      ]
    }
  ]
}
Body
application/json
​
model
stringrequired
Model name

​
messages
object[]required
Chat history as an array of message objects (each with a role and content)

Show child attributes

​
tools
object[]
Optional list of function tools the model may call during the chat

Show child attributes

​
format

enum<string>
enum<string>
Format to return a response in. Can be json or a JSON schema

Available options: json 
​
options
object
Runtime options that control text generation

Show child attributes

​
stream
booleandefault:true
​
think

boolean
boolean
When true, returns separate thinking output in addition to content. Can be a boolean (true/false) or a string ("high", "medium", "low") for supported models.

​
keep_alive

string
string
Model keep-alive duration (for example 5m or 0 to unload immediately)

​
logprobs
boolean
Whether to return log probabilities of the output tokens

​
top_logprobs
integer
Number of most likely tokens to return at each token position when logprobs are enabled

Response

200

application/json
Chat response

​
model
string
Model name used to generate this message

​
created_at
string<date-time>
Timestamp of response creation (ISO 8601)

​
message
object
Show child attributes

​
done
boolean
Indicates whether the chat response has finished

​
done_reason
string
Reason the response finished

​
total_duration
integer
Total time spent generating in nanoseconds

​
load_duration
integer
Time spent loading the model in nanoseconds

​
prompt_eval_count
integer
Number of tokens in the prompt

​
prompt_eval_duration
integer
Time spent evaluating the prompt in nanoseconds

​
eval_count
integer
Number of tokens generated in the response

​
eval_duration
integer
Time spent generating tokens in nanoseconds

​
logprobs
object[]
Log probability information for the generated tokens when logprobs are enabled

Show child attributes

---

Endpoints
List models

Fetch a list of models and their details

GET /api/tags

List models

curl http://localhost:11434/api/tags

200
{
  "models": [
    {
      "name": "gemma3",
      "modified_at": "2025-10-03T23:34:03.409490317-07:00",
      "size": 3338801804,
      "digest": "a2af6cc3eb7fa8be8504abaf9b04e88f17a119ec3f04a3addf55f92841195f5a",
      "details": {
        "format": "gguf",
        "family": "gemma",
        "families": [
          "gemma"
        ],
        "parameter_size": "4.3B",
        "quantization_level": "Q4_K_M"
      }
    }
  ]
}
Response
200 - application/json
List available models

​
models
object[]
Show child attributes

---

Endpoints
List running models

Retrieve a list of models that are currently running

GET /api/ps

List running models

curl http://localhost:11434/api/ps

200
{
  "models": [
    {
      "model": "gemma3",
      "size": 6591830464,
      "digest": "a2af6cc3eb7fa8be8504abaf9b04e88f17a119ec3f04a3addf55f92841195f5a",
      "details": {
        "parent_model": "",
        "format": "gguf",
        "family": "gemma3",
        "families": [
          "gemma3"
        ],
        "parameter_size": "4.3B",
        "quantization_level": "Q4_K_M"
      },
      "expires_at": "2025-10-17T16:47:07.93355-07:00",
      "size_vram": 5333539264,
      "context_length": 4096
    }
  ]
}
Response
200 - application/json
Models currently loaded into memory

​
models
object[]
Currently running models

---

Endpoints
Show model details

POST /api/show

curl http://localhost:11434/api/show -d '{
  "model": "gemma3"
}'

200
{
  "parameters": "temperature 0.7\nnum_ctx 2048",
  "license": "Gemma Terms of Use \n\nLast modified: February 21, 2024...",
  "capabilities": [
    "completion",
    "vision"
  ],
  "modified_at": "2025-08-14T15:49:43.634137516-07:00",
  "details": {
    "parent_model": "",
    "format": "gguf",
    "family": "gemma3",
    "families": [
      "gemma3"
    ],
    "parameter_size": "4.3B",
    "quantization_level": "Q4_K_M"
  },
  "model_info": {
    "gemma3.attention.head_count": 8,
    "gemma3.attention.head_count_kv": 4,
    "gemma3.attention.key_length": 256,
    "gemma3.attention.sliding_window": 1024,
    "gemma3.attention.value_length": 256,
    "gemma3.block_count": 34,
    "gemma3.context_length": 131072,
    "gemma3.embedding_length": 2560,
    "gemma3.feed_forward_length": 10240,
    "gemma3.mm.tokens_per_image": 256,
    "gemma3.vision.attention.head_count": 16,
    "gemma3.vision.attention.layer_norm_epsilon": 0.000001,
    "gemma3.vision.block_count": 27,
    "gemma3.vision.embedding_length": 1152,
    "gemma3.vision.feed_forward_length": 4304,
    "gemma3.vision.image_size": 896,
    "gemma3.vision.num_channels": 3,
    "gemma3.vision.patch_size": 14,
    "general.architecture": "gemma3",
    "general.file_type": 15,
    "general.parameter_count": 4299915632,
    "general.quantization_version": 2,
    "tokenizer.ggml.add_bos_token": true,
    "tokenizer.ggml.add_eos_token": false,
    "tokenizer.ggml.add_padding_token": false,
    "tokenizer.ggml.add_unknown_token": false,
    "tokenizer.ggml.bos_token_id": 2,
    "tokenizer.ggml.eos_token_id": 1,
    "tokenizer.ggml.merges": null,
    "tokenizer.ggml.model": "llama",
    "tokenizer.ggml.padding_token_id": 0,
    "tokenizer.ggml.pre": "default",
    "tokenizer.ggml.scores": null,
    "tokenizer.ggml.token_type": null,
    "tokenizer.ggml.tokens": null,
    "tokenizer.ggml.unknown_token_id": 3
  }
}
Body
application/json
​
model
stringrequired
Model name to show

​
verbose
boolean
If true, includes large verbose fields in the response.

Response
200 - application/json
Model information

​
parameters
string
Model parameter settings serialized as text

​
license
string
The license of the model

​
modified_at
string
Last modified timestamp in ISO 8601 format

​
details
object
High-level model details

​
template
string
The template used by the model to render prompts

​
capabilities
string[]
List of supported features

​
model_info
object
Additional model metadata

---

Endpoints
Create a model

POST /api/create

curl http://localhost:11434/api/create -d '{
  "from": "gemma3",
  "model": "alpaca",
  "system": "You are Alpaca, a helpful AI assistant. You only answer with Emojis."
}'

200
{
  "status": "success"
}
Body
application/json
​
model
stringrequired
Name for the model to create

​
from
string
Existing model to create from

​
template
string
Prompt template to use for the model

​
license

string
string
License string or list of licenses for the model

​
system
string
System prompt to embed in the model

​
parameters
object
Key-value parameters for the model

​
messages
object[]
Message history to use for the model

Show child attributes

​
quantize
string
Quantization level to apply (e.g. q4_K_M, q8_0)

​
stream
booleandefault:true
Stream status updates

Response

200

application/json
Stream of create status updates

​
status
string
Current status message

---

Endpoints
Copy a model

Copy page
POST
/
api
/
copy
Copy a model to a new name

curl http://localhost:11434/api/copy -d '{
  "source": "gemma3",
  "destination": "gemma3-backup"
}'

---

Endpoints
Pull a model

POST /api/pull

curl http://localhost:11434/api/pull -d '{
  "model": "gemma3"
}'

200
{
  "status": "success"
}
Body
application/json
​
model
stringrequired
Name of the model to download

​
insecure
boolean
Allow downloading over insecure connections

​
stream
booleandefault:true
Stream progress updates

Response

200

application/json
Pull status updates.

​
status
string
Current status message

---

Endpoints
Delete a model


DELETE /api/delete
Delete model

curl -X DELETE http://localhost:11434/api/delete -d '{
  "model": "gemma3"
}'
Body
application/json
​
model
stringrequired
Model name to delete

Response
200
Model successfully deleted

---

Endpoints
Get version

Retrieve the version of the Ollama

GET /api/version

Default

curl http://localhost:11434/api/version

200
{
  "version": "0.12.6"
}
Response
200 - application/json
Version information

​
version
string
Version of Ollama