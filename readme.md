# Code as a Service
## Execute Docker
```
docker build -t nashvent:node-server .
docker run \
    -it \
    --rm \
    -p 8000:8080 \
    nashvent:node-server
```

## Excecute
```
node index.js
```

## API
### POST data
Receive json with python code
```
{
    "code":"i=7\nprint(i*2)\n"
}
```

### Response
Response data
```
{
    "result": "14\n"
}
```

