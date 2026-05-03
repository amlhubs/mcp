// ═══════════════════════════════════════════════════════════════════════════
// @amlhubs/mcp — Model Context Protocol 2025-11-25 Metaclasses
//
// Specification:    MCP Specification 2025-11-25 (frozen revision)
// Spec source:      https://modelcontextprotocol.io/specification/2025-11-25
// Schema source:    https://github.com/modelcontextprotocol/specification
//                   /blob/main/schema/2025-11-25/schema.ts
// TypeScript SDK:   https://github.com/modelcontextprotocol/typescript-sdk
// Authority:        Linux Foundation AI & Agents Foundation (LF AAIF) —
//                   donated 2025-12 (Anthropic, Block, OpenAI co-founders)
// Spec license:     Apache License 2.0 (governs spec text + JSON-Schema
//                   files redistributed under spec/)
// Wrapper license:  MIT (governs this TypeScript implementation only)
//
// SCOPE — Complete spec coverage of every MCP 2025-11-25 entity:
//
//   Lifecycle / Initialization (basic/lifecycle):
//     • InitializeRequest, InitializeResult, InitializedNotification
//     • ClientCapabilities, ServerCapabilities, Implementation
//
//   JSON-RPC 2.0 Envelope (basic/index):
//     • Request, Response, Notification, JsonRpcError
//     • RequestId (string | number), ProgressToken
//
//   Architecture (architecture/index):
//     • Server, Client, Host
//
//   Transport (basic/transports):
//     • Transport (Enumeration: stdio | streamable-http | sse)
//
//   Resources (server/resources):
//     • Resource, ResourceTemplate, ResourceContents
//     • ListResourcesRequest, ListResourcesResult
//     • ReadResourceRequest, ReadResourceResult
//     • SubscribeRequest, UnsubscribeRequest
//     • ResourceUpdatedNotification, ResourceListChangedNotification
//
//   Tools (server/tools):
//     • Tool, ToolAnnotation
//     • ListToolsRequest, ListToolsResult
//     • CallToolRequest, CallToolResult
//     • ToolListChangedNotification
//
//   Prompts (server/prompts):
//     • Prompt, PromptArgument, PromptMessage
//     • ListPromptsRequest, ListPromptsResult
//     • GetPromptRequest, GetPromptResult
//     • PromptListChangedNotification
//
//   Content blocks (server/index):
//     • Content (abstract), TextContent, ImageContent, AudioContent
//     • EmbeddedResource, Annotations
//     • Role (Enumeration: user | assistant)
//
//   Sampling (client/sampling):
//     • Sampling, CreateMessageRequest, CreateMessageResult
//     • SamplingMessage, ModelPreferences, ModelHint
//     • IncludeContext (Enumeration: none | thisServer | allServers)
//     • StopReason (Enumeration)
//
//   Logging (server/utilities/logging):
//     • Logger, LoggingMessageNotification, SetLevelRequest
//     • LoggingLevel (Enumeration: debug | info | notice | warning | error
//                                  | critical | alert | emergency)
//
//   Roots (client/roots):
//     • Root, ListRootsRequest, ListRootsResult
//     • RootsListChangedNotification
//
//   Completion (server/utilities/completion):
//     • CompleteRequest, CompleteResult, CompletionReference
//
//   Elicitation (client/elicitation):
//     • ElicitRequest, ElicitResult
//     • ElicitAction (Enumeration: accept | decline | cancel)
//
//   Authorization (basic/authorization):
//     • Authorization, OAuth2Metadata, ClientCredentials, BearerToken
//
//   Progress / Cancellation / Ping (basic/utilities/index):
//     • ProgressNotification, CancelledNotification, PingRequest
//
// Pattern:
//   Every MCP entity is declared as an interface (`I{Name}`) plus a base class
//   (`{Name}`) following the AML/CMOF surface convention. UML metaclasses
//   (`IClass`, `IProperty`, `IEnumeration`, `IConstraint`, `IOpaqueExpression`)
//   are imported from `@amlhubs/uml` and are NEVER reimplemented. MOF
//   reflective metaclasses (`IFactory`, `IExtent`, `IMofObject`) are imported
//   from `@amlhubs/mof` for the runtime instantiation surface.
//
// JSDoc citations follow the project convention:
//   @standard MCP 2025-11-25
//   @section  basic/lifecycle | server/tools | client/sampling | …
//   @authority Linux Foundation AI & Agents Foundation
//   @metaclass UML::Class | UML::Enumeration | UML::Constraint
//   @generalization extends … via UML Generalization
//   @definition <verbatim spec definition>
//   @ownedAttributes <list of typed Property memberEnds>
//   @associationEnds <list of Association memberEnds>
//   @operations <list of Operation declarations>
//   @constraints <verbatim OCL or prose invariant from spec>
// ═══════════════════════════════════════════════════════════════════════════

import type {
  IClass,
  IProperty,
  IEnumeration,
  IEnumerationLiteral,
  IConstraint,
  IOpaqueExpression,
  INamedElement,
  IElement,
  IPackage,
  IDataType,
  IPrimitiveType,
} from '@amlhubs/uml'

import type {
  IMofObject,
  IFactory,
  IExtent,
} from '@amlhubs/mof'

// Implementations are inserted below by the implementation-loop subagents.
// Order:
//   A. JSON-RPC 2.0 envelope (basic/index)
//   B. Lifecycle / Initialization (basic/lifecycle)
//   C. Architecture — Server / Client / Host (architecture/index)
//   D. Transport (basic/transports)
//   E. Resources (server/resources)
//   F. Tools (server/tools)
//   G. Prompts (server/prompts)
//   H. Content blocks + Annotations + Role (server/index)
//   I. Sampling (client/sampling)
//   J. Logging (server/utilities/logging)
//   K. Roots (client/roots)
//   L. Completion (server/utilities/completion)
//   M. Elicitation (client/elicitation)
//   N. Authorization (basic/authorization)
//   O. Progress / Cancellation / Ping (basic/utilities/index)
