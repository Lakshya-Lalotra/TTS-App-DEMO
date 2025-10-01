# API Specification (Ingress + WS)

## REST Endpoints

POST /api/v1/session
- Request: `{ user_id, sample_rate, channels, user_vocab?, transliterate? }`
- Response: `{ session_id, ws_url, token, expiry }`

POST /api/v1/login
- OAuth/JWT login, returns access token

GET /api/v1/vocab
- Returns user's saved vocabulary

POST /api/v1/vocab
- Add to user's vocabulary

## WebSocket Protocol

Client → Server
- `start` — `{ sample_rate, user_vocab?, transliterate?, partial_freq_hz? }`
- `audio` — `{ seq, data }` where data is base64 PCM16/Opus frame
- `end` — `{}` marks end of utterance

Server → Client
- `partial` — `{ text, tokens:[{t,conf,start,end}], seq }`
- `final` — `{ text, language, confidence, tokens }`
- `nbest` — `{ items: [{ text, score }], for_seq }`
- `error` — `{ code, message }`

## Auth
- HTTP: Bearer JWT (short-lived)
- WS: token in query or `start` metadata

## Errors
- 401 unauthorized, 429 rate limited, 5xx server
