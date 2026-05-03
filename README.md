# @amlhubs/mcp — Model Context Protocol 2025-11-25 as a Typed Metamodel

## Identity

| Field | Value |
|---|---|
| Standard | Model Context Protocol (MCP) Specification |
| Edition | 2025-11-25 |
| Spec URL | [modelcontextprotocol.io/specification/2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25) |
| Spec Source | [github.com/modelcontextprotocol/specification](https://github.com/modelcontextprotocol/specification) |
| TypeScript SDK | [github.com/modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk) |
| Authority | [Linux Foundation AI & Agents Foundation (LF AAIF)](https://lfaidata.foundation/) — donated 2025-12 (originally co-founded by Anthropic, Block, OpenAI) |
| Governance License | Apache License 2.0 (specification text and JSON-Schema artifacts) |
| Wrapper License | MIT (this `@amlhubs/mcp` TypeScript implementation only) |
| npm Package | `@amlhubs/mcp` |
| npm Version | `0.0.1` |
| Peer Dependencies | [`@amlhubs/uml`](../uml/README.md) `^0.0.1`, [`@amlhubs/mof`](../mof/README.md) `^0.0.1` |

## Abstract

The Model Context Protocol is the JSON-RPC 2.0 message protocol that defines how an LLM client and a tool/resource/prompt-providing server negotiate capabilities, exchange typed payloads, and stream notifications across one of three transports (`stdio`, `streamable-http`, `sse`). Originally co-developed by Anthropic, Block, and OpenAI, the specification was donated to the Linux Foundation AI & Agents Foundation in December 2025; the 2025-11-25 revision is the latest stable schema, frozen per dated revision and authoritatively expressed as a TypeScript source-of-truth at [github.com/modelcontextprotocol/specification/blob/main/schema/2025-11-25/schema.ts](https://github.com/modelcontextprotocol/specification/blob/main/schema/2025-11-25/schema.ts). The `@amlhubs/mcp` package surfaces every MCP 2025-11-25 entity — `Server`, `Client`, `Transport`, `ClientCapabilities`, `ServerCapabilities`, `InitializeRequest`, `InitializeResult`, `Resource`, `ResourceTemplate`, `Tool`, `ToolAnnotation`, `Prompt`, `PromptArgument`, `PromptMessage`, `Content` (text / image / audio / resource), `Annotations`, `Sampling`, `Logging`, `Roots`, `Completion`, `Elicitation`, `Authorization` — as a CMOF-conformant `Class` with typed `Property`, closed enums as `Enumeration`, and the JSON-RPC + capability constraints as `Constraint` instances carrying spec text inside `OpaqueExpression`.

## Business Value

Adopting MCP through a typed AML metamodel surface produces three compounding payoffs. First, every MCP-compatible host runtime — Claude Desktop, Claude Code, Cursor, Zed, Cody, Continue, the open-source MCP Inspector — interoperates with any server that conforms to the JSON-Schema MCP publishes. A typed metamodel turns conformance into a `tsc` pass: a server scaffolded against `IServer`, `ITool`, and `IResource` cannot accidentally drop a required field, mistype a capability flag, or violate the JSON-RPC envelope shape. Second, because the MCP schema is itself JSON-RPC over JSON-Schema, downstream PRE-engine consumers can statically validate every server-to-client message against the same TypeScript types the AML graph already operates on, collapsing the otherwise-quarterly work of keeping a separate runtime validator in sync with the spec. Third, MCP sits between Anthropic Messages, OpenAI Chat Completions, and Google Gemini ContentGen — a typed MCP metamodel becomes the `lingua franca` port through which any agentic ageni venture can address any of the three vendor surfaces without per-vendor custom adapters.

## Scope — What the Package Surfaces

The package surfaces the full set of metaclasses introduced by the MCP 2025-11-25 specification, grouped by spec area.

| MCP Area | Spec section | Metaclasses |
|---|---|---|
| Lifecycle / Initialization | [`Lifecycle`](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle) | `IInitializeRequest`, `IInitializeResult`, `IInitializedNotification`, `IClientCapabilities`, `IServerCapabilities`, `IImplementation` |
| JSON-RPC 2.0 Envelope | [`Base Protocol`](https://modelcontextprotocol.io/specification/2025-11-25/basic/index) | `IRequest`, `IResponse`, `INotification`, `IJsonRpcError`, `IRequestId`, `IProgressToken` |
| Server / Client | [`Architecture`](https://modelcontextprotocol.io/specification/2025-11-25/architecture/index) | `IServer`, `IClient`, `IHost` |
| Transport | [`Transports`](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports) | `ITransport` (Enumeration: `stdio` \| `streamable-http` \| `sse`) |
| Resources | [`Resources`](https://modelcontextprotocol.io/specification/2025-11-25/server/resources) | `IResource`, `IResourceTemplate`, `IResourceContents`, `IListResourcesRequest`, `IListResourcesResult`, `IReadResourceRequest`, `IReadResourceResult`, `ISubscribeRequest`, `IUnsubscribeRequest`, `IResourceUpdatedNotification`, `IResourceListChangedNotification` |
| Tools | [`Tools`](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) | `ITool`, `IToolAnnotation`, `IListToolsRequest`, `IListToolsResult`, `ICallToolRequest`, `ICallToolResult`, `IToolListChangedNotification` |
| Prompts | [`Prompts`](https://modelcontextprotocol.io/specification/2025-11-25/server/prompts) | `IPrompt`, `IPromptArgument`, `IPromptMessage`, `IListPromptsRequest`, `IListPromptsResult`, `IGetPromptRequest`, `IGetPromptResult`, `IPromptListChangedNotification` |
| Content blocks | [`Content`](https://modelcontextprotocol.io/specification/2025-11-25/server/index) | `IContent`, `ITextContent`, `IImageContent`, `IAudioContent`, `IEmbeddedResource`, `IAnnotations`, `IRole` (Enumeration: `user` \| `assistant`) |
| Sampling | [`Sampling`](https://modelcontextprotocol.io/specification/2025-11-25/client/sampling) | `ISampling`, `ICreateMessageRequest`, `ICreateMessageResult`, `ISamplingMessage`, `IModelPreferences`, `IModelHint`, `IIncludeContext` (Enumeration), `IStopReason` (Enumeration) |
| Logging | [`Logging`](https://modelcontextprotocol.io/specification/2025-11-25/server/utilities/logging) | `ILogger`, `ILoggingMessageNotification`, `ISetLevelRequest`, `ILoggingLevel` (Enumeration: `debug` \| `info` \| `notice` \| `warning` \| `error` \| `critical` \| `alert` \| `emergency`) |
| Roots | [`Roots`](https://modelcontextprotocol.io/specification/2025-11-25/client/roots) | `IRoot`, `IListRootsRequest`, `IListRootsResult`, `IRootsListChangedNotification` |
| Completion | [`Completion`](https://modelcontextprotocol.io/specification/2025-11-25/server/utilities/completion) | `ICompleteRequest`, `ICompleteResult`, `ICompletionReference` |
| Elicitation | [`Elicitation`](https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation) | `IElicitRequest`, `IElicitResult`, `IElicitAction` (Enumeration: `accept` \| `decline` \| `cancel`) |
| Authorization | [`Authorization`](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) | `IAuthorization`, `IOAuth2Metadata`, `IClientCredentials`, `IBearerToken` |
| Progress / Cancellation | [`Utilities`](https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/index) | `IProgressNotification`, `ICancelledNotification`, `IPingRequest` |

Every interface is accompanied by an extensible base class with the same name minus the `I` prefix (e.g., `Server`, `Tool`, `Resource`, `Prompt`). The full enumeration and §-section JSDoc headers live at [`src/mcp.ts`](./src/mcp.ts).

## Dependency Topology

```
@amlhubs/uml   (structural vocabulary — root of the stack)
      ▲
      │ peerDependency (IClass, IProperty, IEnumeration, IConstraint, IOpaqueExpression)
      │
@amlhubs/mof   (reflective machinery over UML)
      ▲
      │ peerDependency (IFactory, IExtent, IMofObject)
      │
@amlhubs/mcp   (this package — JSON-RPC agentic-LLM message metamodel)
```

`@amlhubs/mcp` depends on `@amlhubs/uml` because every MCP entity is surfaced as a UML `IClass` with typed `IProperty` memberEnds, every closed string set is surfaced as a UML `IEnumeration`, and every JSON-RPC / capability invariant is captured as a UML `IConstraint` with the spec text inside an `IOpaqueExpression`. It depends on `@amlhubs/mof` so that downstream consumers can drive a `Factory` over a registered MCP `Package` and reflectively instantiate `Server`, `Client`, `Tool`, `Resource`, and `Prompt` instances from a JSON payload.

## Installation & Usage

```bash
npm install @amlhubs/mcp @amlhubs/mof @amlhubs/uml
```

```typescript
import type {
  IServer,
  IClient,
  ITool,
  IResource,
  IPrompt,
  IInitializeRequest,
  IInitializeResult,
  ITransport,
} from '@amlhubs/mcp';

declare const stdioTransport: ITransport;

const server: IServer = {
  elementId: 'CMOF_Server_ExampleMcpServer',
  name: 'ExampleMcpServer',
  isAbstract: false,
  protocolVersion: '2025-11-25',
  serverInfo: { name: 'example', version: '0.1.0' },
  capabilities: {
    tools:     { listChanged: true },
    resources: { subscribe: true, listChanged: true },
    prompts:   { listChanged: true },
    logging:   {},
  },
  transport: stdioTransport,
  // ... remaining JSON-RPC envelope memberEnds
} as IServer;
```

The source artifact is [`src/mcp.ts`](./src/mcp.ts). Every interface JSDoc header declares `@standard MCP 2025-11-25`, the `@section` of the spec it implements, and the `@authority Linux Foundation AI & Agents Foundation`.

## Provenance & Formal References

- [MCP Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP Specification — main spec repo](https://github.com/modelcontextprotocol/specification)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Linux Foundation AI & Agents Foundation](https://lfaidata.foundation/)
- [Linux Foundation AAIF announcement (2025-12)](https://lfaidata.foundation/blog/) — MCP donation
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification) — base envelope MCP extends

## Version History

| Version | Date | Change Summary |
|---|---|---|
| 0.0.1 | 2026-05-03 | Initial publish — full MCP 2025-11-25 spec coverage as CMOF-conformant Classes (Server, Client, Transport, Capabilities, Initialize, JSON-RPC envelope, Resource, Tool, Prompt, PromptMessage, Content blocks, Annotations, Sampling, Logging, Roots, Completion, Elicitation, Authorization, Progress, Cancellation). Specs (`schema.ts`, JSON-Schema files, prose `.md`) committed under `spec/`. |

## License

MIT — this `@amlhubs/mcp` TypeScript implementation. The upstream MCP 2025-11-25 specification, JSON-Schema files, and reference TypeScript SDK retain their original Apache License 2.0 governance under the LF AAIF. See [`LICENSE`](./LICENSE) for the full notice.
