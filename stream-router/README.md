# Stream Router

Stateless gateway that maintains sticky routing (session → ASR worker).

Responsibilities:
- Load-aware routing and health checks
- Re-route on worker failure
- Observability: per-route latency and errors

Tech (suggested): Go or Rust; gRPC + WS; Consistent hashing.
