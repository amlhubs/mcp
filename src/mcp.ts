// ═══════════════════════════════════════════════════════════════════════════
// @amlhubs/mcp — Model Context Protocol 2025-11-25 Metaclasses
//
// Specification:    MCP Specification 2025-11-25 (frozen revision)
// Spec source:      https://modelcontextprotocol.io/specification/2025-11-25
// Schema source:    https://github.com/modelcontextprotocol/modelcontextprotocol
//                   /blob/main/schema/2025-11-25/schema.ts
// Authority:        Linux Foundation AI & Agents Foundation (LF AAIF) —
//                   donated 2025-12 (Anthropic, Block, OpenAI co-founders)
// Spec license:     Apache License 2.0 (governs spec text + JSON-Schema files
//                   redistributed under spec/)
// Wrapper license:  MIT (governs this TypeScript implementation only)
//
// Pattern: every MCP entity is declared as an interface (`I{Name}`) plus a
// concrete base class (`{Name}`). UML metaclasses (`IClass`, `IProperty`,
// `IEnumeration`, `IConstraint`, `IOpaqueExpression`) are imported from
// `@amlhubs/uml` so every MCP entity surfaces as a CMOF-conformant Class with
// typed Property memberEnds. Closed string sets surface as `IEnumeration`
// instances; JSON-RPC and capability invariants surface as `IConstraint`
// instances carrying spec text inside `IOpaqueExpression.body`.
//
// Method names map directly to MCP JSON-RPC method strings (e.g.
// "initialize", "resources/list", "notifications/cancelled") so that runtime
// dispatch can be performed by string equality against the constants exported
// at the bottom of this file.
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

// ───────────────────────────────────────────────────────────────────────────
// Spec-frozen constants (mirrors LATEST_PROTOCOL_VERSION + JSONRPC_VERSION
// from schema.ts L14-L16)
// ───────────────────────────────────────────────────────────────────────────

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §LATEST_PROTOCOL_VERSION
 * @authority Linux Foundation AI & Agents Foundation
 * @definition The frozen MCP protocol version this package implements.
 */
export const MCP_PROTOCOL_VERSION = '2025-11-25' as const

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §JSONRPC_VERSION
 * @authority Linux Foundation AI & Agents Foundation
 * @definition JSON-RPC 2.0 envelope version literal that every JSONRPCRequest /
 *   JSONRPCNotification / JSONRPCResponse MUST carry.
 */
export const JSONRPC_VERSION = '2.0' as const

// Standard JSON-RPC error codes (schema.ts L175-L179)
export const PARSE_ERROR = -32700 as const
export const INVALID_REQUEST = -32600 as const
export const METHOD_NOT_FOUND = -32601 as const
export const INVALID_PARAMS = -32602 as const
export const INTERNAL_ERROR = -32603 as const

// Implementation-specific JSON-RPC error code (schema.ts L183)
export const URL_ELICITATION_REQUIRED = -32042 as const

// ═══════════════════════════════════════════════════════════════════════════
// A. JSON-RPC 2.0 ENVELOPE (basic/index)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ProgressToken (L18-L23)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::DataType
 * @definition A progress token, used to associate progress notifications with
 *   the original request. Surface union of `string | number`.
 */
export type IProgressToken = string | number

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §Cursor (L25-L30)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::DataType
 * @definition An opaque token used to represent a cursor for pagination.
 */
export type ICursor = string

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §RequestId (L119-L124)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::DataType
 * @definition A uniquely identifying ID for a request in JSON-RPC.
 */
export type IRequestId = string | number

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §RequestParams (L48-L64)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (abstract — `params` carrier)
 * @definition Common params for any request. Carries the optional `_meta` slot
 *   whose `progressToken` field, when present, asks the receiver to emit
 *   `notifications/progress` against the value of the token.
 * @ownedAttributes
 *   - `_meta?: { progressToken?: IProgressToken; [key: string]: unknown }`
 */
export interface IRequestParams {
  _meta?: {
    progressToken?: IProgressToken
    [key: string]: unknown
  }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §TaskAugmentedRequestParams (L32-L47)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IRequestParams (UML::Generalization)
 * @definition Common params for any task-augmented request. The receiver MUST
 *   declare task-augmentation support for the specific request type in its
 *   capabilities before honoring the `task` slot.
 * @ownedAttributes
 *   - `task?: ITaskMetadata`
 */
export interface ITaskAugmentedRequestParams extends IRequestParams {
  task?: ITaskMetadata
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §NotificationParams (L74-L80)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (abstract — `params` carrier for notifications)
 * @definition Common params for any notification.
 * @ownedAttributes
 *   - `_meta?: { [key: string]: unknown }`
 */
export interface INotificationParams {
  _meta?: { [key: string]: unknown }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §Request (L66-L72)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (abstract)
 * @definition Pre-envelope JSON-RPC request shape — `method` plus optional
 *   open-ended `params`. The wire-level `JSONRPCRequest` extends this with
 *   `jsonrpc` and `id`.
 * @ownedAttributes
 *   - `method: string`
 *   - `params?: { [key: string]: any }`
 */
export interface IRequest {
  method: string
  params?: { [key: string]: any }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §Notification (L82-L88)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (abstract)
 * @definition Pre-envelope JSON-RPC notification shape.
 * @ownedAttributes
 *   - `method: string`
 *   - `params?: { [key: string]: any }`
 */
export interface INotification {
  method: string
  params?: { [key: string]: any }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §Result (L90-L99)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (abstract)
 * @definition Common response result shape; carries open-ended `_meta` plus
 *   arbitrary keys supplied by the response variant.
 * @ownedAttributes
 *   - `_meta?: { [key: string]: unknown }`
 *   - `[key: string]: unknown`
 */
export interface IResult {
  _meta?: { [key: string]: unknown }
  [key: string]: unknown
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §EmptyResult (L203-L209)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IResult
 * @definition A response that indicates success but carries no data.
 */
export type IEmptyResult = IResult

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §Error (L101-L117)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @definition JSON-RPC error object. `code` is numeric per JSON-RPC 2.0;
 *   `message` is a single-sentence summary; `data` is sender-defined.
 * @ownedAttributes
 *   - `code: number`
 *   - `message: string`
 *   - `data?: unknown`
 */
export interface IJsonRpcError {
  code: number
  message: string
  data?: unknown
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §JSONRPCRequest (L126-L134)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IRequest
 * @constraints
 *   - `jsonrpc` MUST equal `JSONRPC_VERSION` ("2.0")
 *   - `id` MUST NOT be reused by the same sender in the same direction within
 *     the active session
 * @ownedAttributes
 *   - `jsonrpc: typeof JSONRPC_VERSION`
 *   - `id: IRequestId`
 *   - inherits `method`, `params?`
 */
export interface IJsonRpcRequest extends IRequest {
  jsonrpc: typeof JSONRPC_VERSION
  id: IRequestId
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §JSONRPCNotification (L136-L143)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends INotification
 * @constraints
 *   - Notifications MUST NOT carry an `id`; receivers MUST NOT reply.
 * @ownedAttributes
 *   - `jsonrpc: typeof JSONRPC_VERSION`
 *   - inherits `method`, `params?`
 */
export interface IJsonRpcNotification extends INotification {
  jsonrpc: typeof JSONRPC_VERSION
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §JSONRPCResultResponse (L145-L154)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @ownedAttributes
 *   - `jsonrpc: typeof JSONRPC_VERSION`
 *   - `id: IRequestId`
 *   - `result: IResult`
 */
export interface IJsonRpcResultResponse {
  jsonrpc: typeof JSONRPC_VERSION
  id: IRequestId
  result: IResult
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §JSONRPCErrorResponse (L156-L165)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @constraints
 *   - `id` MAY be omitted only when the request could not be parsed
 * @ownedAttributes
 *   - `jsonrpc: typeof JSONRPC_VERSION`
 *   - `id?: IRequestId`
 *   - `error: IJsonRpcError`
 */
export interface IJsonRpcErrorResponse {
  jsonrpc: typeof JSONRPC_VERSION
  id?: IRequestId
  error: IJsonRpcError
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §JSONRPCResponse (L167-L172)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @definition Discriminated union of result-bearing or error-bearing response.
 */
export type IJsonRpcResponse = IJsonRpcResultResponse | IJsonRpcErrorResponse

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §JSONRPCMessage (L1-L11)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (envelope union)
 * @definition Any valid JSON-RPC object that can be decoded off the wire, or
 *   encoded to be sent.
 */
export type IJsonRpcMessage =
  | IJsonRpcRequest
  | IJsonRpcNotification
  | IJsonRpcResponse

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §URLElicitationRequiredError (L185-L201)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcErrorResponse with refined `error.code`
 * @definition Error response that indicates the server requires the client to
 *   provide additional information via an elicitation URL request.
 */
export interface IUrlElicitationRequiredError {
  jsonrpc: typeof JSONRPC_VERSION
  id?: IRequestId
  error: IJsonRpcError & {
    code: typeof URL_ELICITATION_REQUIRED
    data: {
      elicitations: IElicitRequestUrlParams[]
      [key: string]: unknown
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// B. PAGINATION (basic/utilities — pagination.mdx)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §PaginatedRequestParams (L623-L635)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (abstract)
 * @generalization extends IRequestParams
 * @ownedAttributes
 *   - `cursor?: ICursor`
 */
export interface IPaginatedRequestParams extends IRequestParams {
  cursor?: ICursor
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §PaginatedRequest (L637-L640)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (abstract)
 * @generalization extends IJsonRpcRequest
 */
export interface IPaginatedRequest extends IJsonRpcRequest {
  params?: IPaginatedRequestParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §PaginatedResult (L642-L649)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (abstract)
 * @generalization extends IResult
 * @ownedAttributes
 *   - `nextCursor?: ICursor`
 */
export interface IPaginatedResult extends IResult {
  nextCursor?: ICursor
}

// ═══════════════════════════════════════════════════════════════════════════
// C. CANCELLATION (basic/utilities/cancellation.mdx)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §CancelledNotificationParams (L211-L231)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends INotificationParams
 * @constraints
 *   - `requestId` MUST correspond to a request previously issued in the same
 *     direction; MUST be present for cancelling non-task requests; MUST NOT
 *     be used for task cancellation (use `tasks/cancel` instead).
 * @ownedAttributes
 *   - `requestId?: IRequestId`
 *   - `reason?: string`
 */
export interface ICancelledNotificationParams extends INotificationParams {
  requestId?: IRequestId
  reason?: string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §CancelledNotification (L233-L249)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcNotification
 * @constraints
 *   - A client MUST NOT attempt to cancel its `initialize` request.
 */
export interface ICancelledNotification extends IJsonRpcNotification {
  method: 'notifications/cancelled'
  params: ICancelledNotificationParams
}

// ═══════════════════════════════════════════════════════════════════════════
// D. INITIALIZATION + LIFECYCLE (basic/lifecycle.mdx)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §InitializeRequestParams (L251-L264)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IRequestParams
 * @ownedAttributes
 *   - `protocolVersion: string`
 *   - `capabilities: IClientCapabilities`
 *   - `clientInfo: IImplementation`
 */
export interface IInitializeRequestParams extends IRequestParams {
  protocolVersion: string
  capabilities: IClientCapabilities
  clientInfo: IImplementation
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §InitializeRequest (L266-L274)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcRequest
 */
export interface IInitializeRequest extends IJsonRpcRequest {
  method: 'initialize'
  params: IInitializeRequestParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §InitializeResult (L276-L295)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IResult
 * @constraints
 *   - If the server's `protocolVersion` differs from the client's request and
 *     the client cannot support it, the client MUST disconnect.
 */
export interface IInitializeResult extends IResult {
  protocolVersion: string
  capabilities: IServerCapabilities
  serverInfo: IImplementation
  instructions?: string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §InitializedNotification (L297-L305)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcNotification
 * @definition Sent from the client to the server after initialization has
 *   finished.
 */
export interface IInitializedNotification extends IJsonRpcNotification {
  method: 'notifications/initialized'
  params?: INotificationParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ClientCapabilities (L307-L381)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @definition Capabilities a client may support. The set is open: a client MAY
 *   declare experimental capabilities under `experimental`.
 */
export interface IClientCapabilities {
  experimental?: { [key: string]: object }
  roots?: { listChanged?: boolean }
  sampling?: { context?: object; tools?: object }
  elicitation?: { form?: object; url?: object }
  tasks?: {
    list?: object
    cancel?: object
    requests?: {
      sampling?: { createMessage?: object }
      elicitation?: { create?: object }
    }
  }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ServerCapabilities (L383-L459)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @definition Capabilities a server may support. The set is open.
 */
export interface IServerCapabilities {
  experimental?: { [key: string]: object }
  logging?: object
  completions?: object
  prompts?: { listChanged?: boolean }
  resources?: { subscribe?: boolean; listChanged?: boolean }
  tools?: { listChanged?: boolean }
  tasks?: {
    list?: object
    cancel?: object
    requests?: {
      tools?: { call?: object }
    }
  }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §Icon (L461-L503)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @ownedAttributes
 *   - `src: string` (URI)
 *   - `mimeType?: string`
 *   - `sizes?: string[]` (WxH or "any")
 *   - `theme?: 'light' | 'dark'`
 */
export interface IIcon {
  src: string
  mimeType?: string
  sizes?: string[]
  theme?: 'light' | 'dark'
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §Icons (L505-L523)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (abstract — mixin)
 */
export interface IIcons {
  icons?: IIcon[]
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §BaseMetadata (L525-L545)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (abstract — mixin)
 * @ownedAttributes
 *   - `name: string` (programmatic identifier)
 *   - `title?: string` (human-facing display name)
 */
export interface IBaseMetadata {
  name: string
  title?: string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §Implementation (L547-L570)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IBaseMetadata, IIcons (multi-realization mixin)
 */
export interface IImplementation extends IBaseMetadata, IIcons {
  version: string
  description?: string
  websiteUrl?: string
}

// ═══════════════════════════════════════════════════════════════════════════
// E. PING (basic/utilities/ping.mdx)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §PingRequest (L572-L581)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcRequest
 * @constraints
 *   - The receiver MUST promptly respond, or else may be disconnected.
 */
export interface IPingRequest extends IJsonRpcRequest {
  method: 'ping'
  params?: IRequestParams
}

// ═══════════════════════════════════════════════════════════════════════════
// F. PROGRESS NOTIFICATIONS (basic/utilities/progress.mdx)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ProgressNotificationParams (L583-L611)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends INotificationParams
 */
export interface IProgressNotificationParams extends INotificationParams {
  progressToken: IProgressToken
  progress: number
  total?: number
  message?: string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ProgressNotification (L613-L621)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcNotification
 */
export interface IProgressNotification extends IJsonRpcNotification {
  method: 'notifications/progress'
  params: IProgressNotificationParams
}

// ═══════════════════════════════════════════════════════════════════════════
// G. RESOURCES (server/resources.mdx)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ListResourcesRequest (L651-L659)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IPaginatedRequest
 */
export interface IListResourcesRequest extends IPaginatedRequest {
  method: 'resources/list'
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ListResourcesResult (L661-L668)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IPaginatedResult
 */
export interface IListResourcesResult extends IPaginatedResult {
  resources: IResource[]
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ListResourceTemplatesRequest (L670-L677)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IPaginatedRequest
 */
export interface IListResourceTemplatesRequest extends IPaginatedRequest {
  method: 'resources/templates/list'
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ListResourceTemplatesResult (L679-L686)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IPaginatedResult
 */
export interface IListResourceTemplatesResult extends IPaginatedResult {
  resourceTemplates: IResourceTemplate[]
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ResourceRequestParams (L688-L700)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (abstract)
 */
export interface IResourceRequestParams extends IRequestParams {
  uri: string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ReadResourceRequestParams (L702-L708)
 * @authority Linux Foundation AI & Agents Foundation
 */
export type IReadResourceRequestParams = IResourceRequestParams

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ReadResourceRequest (L710-L718)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcRequest
 */
export interface IReadResourceRequest extends IJsonRpcRequest {
  method: 'resources/read'
  params: IReadResourceRequestParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ReadResourceResult (L720-L727)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IResult
 */
export interface IReadResourceResult extends IResult {
  contents: (ITextResourceContents | IBlobResourceContents)[]
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ResourceListChangedNotification (L729-L737)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcNotification
 */
export interface IResourceListChangedNotification extends IJsonRpcNotification {
  method: 'notifications/resources/list_changed'
  params?: INotificationParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §SubscribeRequestParams (L739-L745)
 * @authority Linux Foundation AI & Agents Foundation
 */
export type ISubscribeRequestParams = IResourceRequestParams

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §SubscribeRequest (L747-L755)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcRequest
 */
export interface ISubscribeRequest extends IJsonRpcRequest {
  method: 'resources/subscribe'
  params: ISubscribeRequestParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §UnsubscribeRequestParams (L757-L763)
 * @authority Linux Foundation AI & Agents Foundation
 */
export type IUnsubscribeRequestParams = IResourceRequestParams

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §UnsubscribeRequest (L765-L773)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcRequest
 */
export interface IUnsubscribeRequest extends IJsonRpcRequest {
  method: 'resources/unsubscribe'
  params: IUnsubscribeRequestParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ResourceUpdatedNotificationParams (L775-L787)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends INotificationParams
 */
export interface IResourceUpdatedNotificationParams
  extends INotificationParams {
  uri: string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ResourceUpdatedNotification (L789-L797)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcNotification
 */
export interface IResourceUpdatedNotification extends IJsonRpcNotification {
  method: 'notifications/resources/updated'
  params: IResourceUpdatedNotificationParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §Resource (L799-L840)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IBaseMetadata, IIcons
 */
export interface IResource extends IBaseMetadata, IIcons {
  uri: string
  description?: string
  mimeType?: string
  annotations?: IAnnotations
  size?: number
  _meta?: { [key: string]: unknown }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ResourceTemplate (L842-L876)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IBaseMetadata, IIcons
 * @ownedAttributes
 *   - `uriTemplate: string` (RFC 6570)
 */
export interface IResourceTemplate extends IBaseMetadata, IIcons {
  uriTemplate: string
  description?: string
  mimeType?: string
  annotations?: IAnnotations
  _meta?: { [key: string]: unknown }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ResourceContents (L878-L899)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (abstract)
 */
export interface IResourceContents {
  uri: string
  mimeType?: string
  _meta?: { [key: string]: unknown }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §TextResourceContents (L901-L909)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IResourceContents
 */
export interface ITextResourceContents extends IResourceContents {
  text: string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §BlobResourceContents (L911-L921)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IResourceContents
 */
export interface IBlobResourceContents extends IResourceContents {
  blob: string
}

// ═══════════════════════════════════════════════════════════════════════════
// H. PROMPTS (server/prompts.mdx)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ListPromptsRequest (L923-L931)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IPaginatedRequest
 */
export interface IListPromptsRequest extends IPaginatedRequest {
  method: 'prompts/list'
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ListPromptsResult (L933-L940)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IPaginatedResult
 */
export interface IListPromptsResult extends IPaginatedResult {
  prompts: IPrompt[]
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §GetPromptRequestParams (L942-L956)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IRequestParams
 */
export interface IGetPromptRequestParams extends IRequestParams {
  name: string
  arguments?: { [key: string]: string }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §GetPromptRequest (L958-L966)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcRequest
 */
export interface IGetPromptRequest extends IJsonRpcRequest {
  method: 'prompts/get'
  params: IGetPromptRequestParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §GetPromptResult (L968-L979)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IResult
 */
export interface IGetPromptResult extends IResult {
  description?: string
  messages: IPromptMessage[]
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §Prompt (L981-L1001)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IBaseMetadata, IIcons
 */
export interface IPrompt extends IBaseMetadata, IIcons {
  description?: string
  arguments?: IPromptArgument[]
  _meta?: { [key: string]: unknown }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §PromptArgument (L1003-L1017)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IBaseMetadata
 */
export interface IPromptArgument extends IBaseMetadata {
  description?: string
  required?: boolean
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §Role (L1019-L1024)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Enumeration
 * @definition The sender or recipient of messages and data in a conversation.
 *   Closed enumeration: { user, assistant }.
 */
export type IRole = 'user' | 'assistant'

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §PromptMessage (L1026-L1037)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface IPromptMessage {
  role: IRole
  content: IContentBlock
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ResourceLink (L1039-L1048)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IResource
 * @constraints
 *   - Resource links returned by tools are not guaranteed to appear in
 *     `resources/list` results.
 */
export interface IResourceLink extends IResource {
  type: 'resource_link'
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §EmbeddedResource (L1050-L1071)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface IEmbeddedResource {
  type: 'resource'
  resource: ITextResourceContents | IBlobResourceContents
  annotations?: IAnnotations
  _meta?: { [key: string]: unknown }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §PromptListChangedNotification (L1072-L1080)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcNotification
 */
export interface IPromptListChangedNotification extends IJsonRpcNotification {
  method: 'notifications/prompts/list_changed'
  params?: INotificationParams
}

// ═══════════════════════════════════════════════════════════════════════════
// I. TOOLS (server/tools.mdx)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ListToolsRequest (L1082-L1090)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IPaginatedRequest
 */
export interface IListToolsRequest extends IPaginatedRequest {
  method: 'tools/list'
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ListToolsResult (L1092-L1099)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IPaginatedResult
 */
export interface IListToolsResult extends IPaginatedResult {
  tools: ITool[]
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §CallToolResult (L1101-L1132)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IResult
 * @constraints
 *   - Errors that originate from the tool SHOULD be reported with `isError =
 *     true`, NOT as an MCP protocol-level error response.
 */
export interface ICallToolResult extends IResult {
  content: IContentBlock[]
  structuredContent?: { [key: string]: unknown }
  isError?: boolean
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §CallToolRequestParams (L1134-L1148)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends ITaskAugmentedRequestParams
 */
export interface ICallToolRequestParams extends ITaskAugmentedRequestParams {
  name: string
  arguments?: { [key: string]: unknown }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §CallToolRequest (L1150-L1158)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcRequest
 */
export interface ICallToolRequest extends IJsonRpcRequest {
  method: 'tools/call'
  params: ICallToolRequestParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ToolListChangedNotification (L1160-L1168)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcNotification
 */
export interface IToolListChangedNotification extends IJsonRpcNotification {
  method: 'notifications/tools/list_changed'
  params?: INotificationParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ToolAnnotations (L1170-L1224)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @constraints
 *   - All properties are HINTS — clients MUST NOT make trust decisions about
 *     untrusted servers based on these annotations.
 */
export interface IToolAnnotations {
  title?: string
  readOnlyHint?: boolean
  destructiveHint?: boolean
  idempotentHint?: boolean
  openWorldHint?: boolean
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ToolExecution (L1226-L1244)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @ownedAttributes
 *   - `taskSupport?: 'forbidden' | 'optional' | 'required'`
 */
export interface IToolExecution {
  taskSupport?: 'forbidden' | 'optional' | 'required'
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §Tool (L1246-L1299)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IBaseMetadata, IIcons
 */
export interface ITool extends IBaseMetadata, IIcons {
  description?: string
  inputSchema: {
    $schema?: string
    type: 'object'
    properties?: { [key: string]: object }
    required?: string[]
  }
  execution?: IToolExecution
  outputSchema?: {
    $schema?: string
    type: 'object'
    properties?: { [key: string]: object }
    required?: string[]
  }
  annotations?: IToolAnnotations
  _meta?: { [key: string]: unknown }
}

// ═══════════════════════════════════════════════════════════════════════════
// J. TASKS (basic/utilities/tasks.mdx)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §TaskStatus (L1301-L1313)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Enumeration
 * @definition Closed enumeration: { working, input_required, completed,
 *   failed, cancelled }.
 */
export type ITaskStatus =
  | 'working'
  | 'input_required'
  | 'completed'
  | 'failed'
  | 'cancelled'

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §TaskMetadata (L1315-L1326)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface ITaskMetadata {
  ttl?: number
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §RelatedTaskMetadata (L1328-L1339)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @definition Carried under `_meta` key
 *   `io.modelcontextprotocol/related-task` to associate a message with a
 *   task.
 */
export interface IRelatedTaskMetadata {
  taskId: string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §Task (L1341-L1386)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface ITask {
  taskId: string
  status: ITaskStatus
  statusMessage?: string
  createdAt: string
  lastUpdatedAt: string
  ttl: number | null
  pollInterval?: number
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §CreateTaskResult (L1388-L1395)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IResult
 */
export interface ICreateTaskResult extends IResult {
  task: ITask
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §GetTaskRequest (L1397-L1410)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcRequest
 */
export interface IGetTaskRequest extends IJsonRpcRequest {
  method: 'tasks/get'
  params: { taskId: string }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §GetTaskResult (L1412-L1417)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export type IGetTaskResult = IResult & ITask

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §GetTaskPayloadRequest (L1419-L1432)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcRequest
 */
export interface IGetTaskPayloadRequest extends IJsonRpcRequest {
  method: 'tasks/result'
  params: { taskId: string }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §GetTaskPayloadResult (L1434-L1443)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IResult
 */
export interface IGetTaskPayloadResult extends IResult {
  [key: string]: unknown
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §CancelTaskRequest (L1445-L1458)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcRequest
 */
export interface ICancelTaskRequest extends IJsonRpcRequest {
  method: 'tasks/cancel'
  params: { taskId: string }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §CancelTaskResult (L1460-L1465)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export type ICancelTaskResult = IResult & ITask

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ListTasksRequest (L1467-L1474)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IPaginatedRequest
 */
export interface IListTasksRequest extends IPaginatedRequest {
  method: 'tasks/list'
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ListTasksResult (L1476-L1483)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IPaginatedResult
 */
export interface IListTasksResult extends IPaginatedResult {
  tasks: ITask[]
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §TaskStatusNotificationParams (L1485-L1490)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export type ITaskStatusNotificationParams = INotificationParams & ITask

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §TaskStatusNotification (L1492-L1500)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcNotification
 */
export interface ITaskStatusNotification extends IJsonRpcNotification {
  method: 'notifications/tasks/status'
  params: ITaskStatusNotificationParams
}

// ═══════════════════════════════════════════════════════════════════════════
// K. LOGGING (server/utilities/logging.mdx)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §LoggingLevel (L1556-L1572)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Enumeration
 * @definition RFC 5424 §6.2.1 syslog severities. Closed enumeration:
 *   { debug, info, notice, warning, error, critical, alert, emergency }.
 */
export type ILoggingLevel =
  | 'debug'
  | 'info'
  | 'notice'
  | 'warning'
  | 'error'
  | 'critical'
  | 'alert'
  | 'emergency'

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §SetLevelRequestParams (L1502-L1514)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IRequestParams
 */
export interface ISetLevelRequestParams extends IRequestParams {
  level: ILoggingLevel
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §SetLevelRequest (L1516-L1524)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcRequest
 */
export interface ISetLevelRequest extends IJsonRpcRequest {
  method: 'logging/setLevel'
  params: ISetLevelRequestParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §LoggingMessageNotificationParams (L1526-L1544)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends INotificationParams
 */
export interface ILoggingMessageNotificationParams extends INotificationParams {
  level: ILoggingLevel
  logger?: string
  data: unknown
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §LoggingMessageNotification (L1546-L1554)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcNotification
 */
export interface ILoggingMessageNotification extends IJsonRpcNotification {
  method: 'notifications/message'
  params: ILoggingMessageNotificationParams
}

// ═══════════════════════════════════════════════════════════════════════════
// L. SAMPLING (client/sampling.mdx)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ToolChoice (L1626-L1639)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface IToolChoice {
  mode?: 'auto' | 'required' | 'none'
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §CreateMessageRequestParams (L1574-L1624)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends ITaskAugmentedRequestParams
 * @constraints
 *   - The client MUST return an error if `tools` is provided but
 *     `ClientCapabilities.sampling.tools` is not declared.
 *   - The client MUST return an error if `toolChoice` is provided but
 *     `ClientCapabilities.sampling.tools` is not declared.
 */
export interface ICreateMessageRequestParams extends ITaskAugmentedRequestParams {
  messages: ISamplingMessage[]
  modelPreferences?: IModelPreferences
  systemPrompt?: string
  includeContext?: 'none' | 'thisServer' | 'allServers'
  temperature?: number
  maxTokens: number
  stopSequences?: string[]
  metadata?: object
  tools?: ITool[]
  toolChoice?: IToolChoice
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §CreateMessageRequest (L1641-L1649)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcRequest
 */
export interface ICreateMessageRequest extends IJsonRpcRequest {
  method: 'sampling/createMessage'
  params: ICreateMessageRequestParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §CreateMessageResult (L1651-L1676)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IResult, ISamplingMessage
 * @ownedAttributes
 *   - `model: string`
 *   - `stopReason?: 'endTurn' | 'stopSequence' | 'maxTokens' | 'toolUse' |
 *     string`
 */
export interface ICreateMessageResult extends IResult, ISamplingMessage {
  model: string
  stopReason?: 'endTurn' | 'stopSequence' | 'maxTokens' | 'toolUse' | string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §SamplingMessage (L1678-L1690)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface ISamplingMessage {
  role: IRole
  content: ISamplingMessageContentBlock | ISamplingMessageContentBlock[]
  _meta?: { [key: string]: unknown }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §SamplingMessageContentBlock (L1692-L1700)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (union)
 */
export type ISamplingMessageContentBlock =
  | ITextContent
  | IImageContent
  | IAudioContent
  | IToolUseContent
  | IToolResultContent

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ModelPreferences (L1916-L1975)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @constraints
 *   - `costPriority`, `speedPriority`, `intelligencePriority` ∈ [0, 1]
 */
export interface IModelPreferences {
  hints?: IModelHint[]
  costPriority?: number
  speedPriority?: number
  intelligencePriority?: number
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ModelHint (L1977-L1998)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface IModelHint {
  name?: string
}

// ═══════════════════════════════════════════════════════════════════════════
// M. CONTENT BLOCKS + ANNOTATIONS (server/index.mdx)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §Annotations (L1702-L1737)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @constraints
 *   - `priority` ∈ [0, 1]
 *   - `lastModified` SHOULD be ISO 8601
 */
export interface IAnnotations {
  audience?: IRole[]
  priority?: number
  lastModified?: string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ContentBlock (L1739-L1747)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (union)
 */
export type IContentBlock =
  | ITextContent
  | IImageContent
  | IAudioContent
  | IResourceLink
  | IEmbeddedResource

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §TextContent (L1749-L1771)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface ITextContent {
  type: 'text'
  text: string
  annotations?: IAnnotations
  _meta?: { [key: string]: unknown }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ImageContent (L1773-L1802)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface IImageContent {
  type: 'image'
  data: string
  mimeType: string
  annotations?: IAnnotations
  _meta?: { [key: string]: unknown }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §AudioContent (L1804-L1833)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface IAudioContent {
  type: 'audio'
  data: string
  mimeType: string
  annotations?: IAnnotations
  _meta?: { [key: string]: unknown }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ToolUseContent (L1835-L1867)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface IToolUseContent {
  type: 'tool_use'
  id: string
  name: string
  input: { [key: string]: unknown }
  _meta?: { [key: string]: unknown }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ToolResultContent (L1869-L1914)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface IToolResultContent {
  type: 'tool_result'
  toolUseId: string
  content: IContentBlock[]
  structuredContent?: { [key: string]: unknown }
  isError?: boolean
  _meta?: { [key: string]: unknown }
}

// ═══════════════════════════════════════════════════════════════════════════
// N. COMPLETION (server/utilities/completion.mdx)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ResourceTemplateReference (L2065-L2078)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface IResourceTemplateReference {
  type: 'ref/resource'
  uri: string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §PromptReference (L2080-L2087)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IBaseMetadata
 */
export interface IPromptReference extends IBaseMetadata {
  type: 'ref/prompt'
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §CompleteRequestParams (L2000-L2031)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IRequestParams
 */
export interface ICompleteRequestParams extends IRequestParams {
  ref: IPromptReference | IResourceTemplateReference
  argument: {
    name: string
    value: string
  }
  context?: {
    arguments?: { [key: string]: string }
  }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §CompleteRequest (L2033-L2041)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcRequest
 */
export interface ICompleteRequest extends IJsonRpcRequest {
  method: 'completion/complete'
  params: ICompleteRequestParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §CompleteResult (L2043-L2063)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IResult
 * @constraints
 *   - `completion.values` MUST NOT exceed 100 items.
 */
export interface ICompleteResult extends IResult {
  completion: {
    values: string[]
    total?: number
    hasMore?: boolean
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// O. ROOTS (client/roots.mdx)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ListRootsRequest (L2089-L2104)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcRequest
 */
export interface IListRootsRequest extends IJsonRpcRequest {
  method: 'roots/list'
  params?: IRequestParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ListRootsResult (L2106-L2115)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IResult
 */
export interface IListRootsResult extends IResult {
  roots: IRoot[]
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §Root (L2117-L2142)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @constraints
 *   - `uri` MUST start with `file://` for now (MAY be relaxed in future).
 */
export interface IRoot {
  uri: string
  name?: string
  _meta?: { [key: string]: unknown }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §RootsListChangedNotification (L2144-L2154)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcNotification
 */
export interface IRootsListChangedNotification extends IJsonRpcNotification {
  method: 'notifications/roots/list_changed'
  params?: INotificationParams
}

// ═══════════════════════════════════════════════════════════════════════════
// P. ELICITATION (client/elicitation.mdx)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ElicitRequestFormParams (L2156-L2184)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends ITaskAugmentedRequestParams
 */
export interface IElicitRequestFormParams extends ITaskAugmentedRequestParams {
  mode?: 'form'
  message: string
  requestedSchema: {
    $schema?: string
    type: 'object'
    properties: { [key: string]: IPrimitiveSchemaDefinition }
    required?: string[]
  }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ElicitRequestURLParams (L2186-L2214)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends ITaskAugmentedRequestParams
 */
export interface IElicitRequestUrlParams extends ITaskAugmentedRequestParams {
  mode: 'url'
  message: string
  elicitationId: string
  url: string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ElicitRequestParams (L2216-L2223)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (union)
 */
export type IElicitRequestParams =
  | IElicitRequestFormParams
  | IElicitRequestUrlParams

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ElicitRequest (L2225-L2233)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcRequest
 */
export interface IElicitRequest extends IJsonRpcRequest {
  method: 'elicitation/create'
  params: IElicitRequestParams
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §PrimitiveSchemaDefinition (L2235-L2245)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (union)
 */
export type IPrimitiveSchemaDefinition =
  | IStringSchema
  | INumberSchema
  | IBooleanSchema
  | IEnumSchema

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §StringSchema (L2247-L2258)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface IStringSchema {
  type: 'string'
  title?: string
  description?: string
  minLength?: number
  maxLength?: number
  format?: 'email' | 'uri' | 'date' | 'date-time'
  default?: string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §NumberSchema (L2260-L2270)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface INumberSchema {
  type: 'number' | 'integer'
  title?: string
  description?: string
  minimum?: number
  maximum?: number
  default?: number
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §BooleanSchema (L2272-L2280)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface IBooleanSchema {
  type: 'boolean'
  title?: string
  description?: string
  default?: boolean
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §UntitledSingleSelectEnumSchema (L2282-L2305)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface IUntitledSingleSelectEnumSchema {
  type: 'string'
  title?: string
  description?: string
  enum: string[]
  default?: string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §TitledSingleSelectEnumSchema (L2307-L2339)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface ITitledSingleSelectEnumSchema {
  type: 'string'
  title?: string
  description?: string
  oneOf: Array<{ const: string; title: string }>
  default?: string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §SingleSelectEnumSchema (L2341-L2347)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (union)
 */
export type ISingleSelectEnumSchema =
  | IUntitledSingleSelectEnumSchema
  | ITitledSingleSelectEnumSchema

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §UntitledMultiSelectEnumSchema (L2349-L2386)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface IUntitledMultiSelectEnumSchema {
  type: 'array'
  title?: string
  description?: string
  minItems?: number
  maxItems?: number
  items: {
    type: 'string'
    enum: string[]
  }
  default?: string[]
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §TitledMultiSelectEnumSchema (L2388-L2433)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 */
export interface ITitledMultiSelectEnumSchema {
  type: 'array'
  title?: string
  description?: string
  minItems?: number
  maxItems?: number
  items: {
    anyOf: Array<{ const: string; title: string }>
  }
  default?: string[]
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §MultiSelectEnumSchema (L2435-L2441)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (union)
 */
export type IMultiSelectEnumSchema =
  | IUntitledMultiSelectEnumSchema
  | ITitledMultiSelectEnumSchema

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §LegacyTitledEnumSchema (L2443-L2460)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @deprecated Use ITitledSingleSelectEnumSchema instead.
 */
export interface ILegacyTitledEnumSchema {
  type: 'string'
  title?: string
  description?: string
  enum: string[]
  enumNames?: string[]
  default?: string
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §EnumSchema (L2462-L2469)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (union)
 */
export type IEnumSchema =
  | ISingleSelectEnumSchema
  | IMultiSelectEnumSchema
  | ILegacyTitledEnumSchema

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ElicitResult (L2471-L2491)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IResult
 * @ownedAttributes
 *   - `action: 'accept' | 'decline' | 'cancel'`
 *   - `content?: { [key: string]: string | number | boolean | string[] }`
 */
export interface IElicitResult extends IResult {
  action: 'accept' | 'decline' | 'cancel'
  content?: { [key: string]: string | number | boolean | string[] }
}

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ElicitationCompleteNotification (L2493-L2506)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends IJsonRpcNotification
 */
export interface IElicitationCompleteNotification extends IJsonRpcNotification {
  method: 'notifications/elicitation/complete'
  params: { elicitationId: string }
}

// ═══════════════════════════════════════════════════════════════════════════
// Q. CLIENT / SERVER MESSAGE UNIONS (schema.ts §ClientRequest etc.)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ClientRequest (L2508-L2527)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (union)
 */
export type IClientRequest =
  | IPingRequest
  | IInitializeRequest
  | ICompleteRequest
  | ISetLevelRequest
  | IGetPromptRequest
  | IListPromptsRequest
  | IListResourcesRequest
  | IListResourceTemplatesRequest
  | IReadResourceRequest
  | ISubscribeRequest
  | IUnsubscribeRequest
  | ICallToolRequest
  | IListToolsRequest
  | IGetTaskRequest
  | IGetTaskPayloadRequest
  | IListTasksRequest
  | ICancelTaskRequest

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ClientNotification (L2529-L2535)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (union)
 */
export type IClientNotification =
  | ICancelledNotification
  | IProgressNotification
  | IInitializedNotification
  | IRootsListChangedNotification
  | ITaskStatusNotification

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ClientResult (L2537-L2546)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (union)
 */
export type IClientResult =
  | IEmptyResult
  | ICreateMessageResult
  | IListRootsResult
  | IElicitResult
  | IGetTaskResult
  | IGetTaskPayloadResult
  | IListTasksResult
  | ICancelTaskResult

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ServerRequest (L2548-L2558)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (union)
 */
export type IServerRequest =
  | IPingRequest
  | ICreateMessageRequest
  | IListRootsRequest
  | IElicitRequest
  | IGetTaskRequest
  | IGetTaskPayloadRequest
  | IListTasksRequest
  | ICancelTaskRequest

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ServerNotification (L2560-L2570)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (union)
 */
export type IServerNotification =
  | ICancelledNotification
  | IProgressNotification
  | ILoggingMessageNotification
  | IResourceUpdatedNotification
  | IResourceListChangedNotification
  | IToolListChangedNotification
  | IPromptListChangedNotification
  | IElicitationCompleteNotification
  | ITaskStatusNotification

/**
 * @standard MCP 2025-11-25
 * @section schema.ts §ServerResult (L2572-L2587)
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class (union)
 */
export type IServerResult =
  | IEmptyResult
  | IInitializeResult
  | ICompleteResult
  | IGetPromptResult
  | IListPromptsResult
  | IListResourceTemplatesResult
  | IListResourcesResult
  | IReadResourceResult
  | ICallToolResult
  | IListToolsResult
  | IGetTaskResult
  | IGetTaskPayloadResult
  | IListTasksResult
  | ICancelTaskResult

// ═══════════════════════════════════════════════════════════════════════════
// R. ARCHITECTURE — HOST / CLIENT / SERVER (architecture/index.mdx)
//
// The MCP architecture document defines three roles — Host, Client, Server —
// that are NOT present in schema.ts as distinct entities (the schema treats
// them as the senders/receivers of the message unions above). They surface
// here as CMOF-conformant Classes so that downstream metamodels can type the
// runtime topology (one Host process, multiple Client instances, 1:1
// Client/Server relationships).
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section architecture/index.mdx §Host
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @definition The host process acts as the container and coordinator: creates
 *   and manages multiple client instances, controls connection permissions
 *   and lifecycle, enforces security policies and consent, handles user
 *   authorization decisions, coordinates AI/LLM integration and sampling,
 *   and manages context aggregation across clients.
 * @associationEnds
 *   - `clients: IClient[]` — one host owns 1..* clients (composition)
 */
export interface IHost {
  hostId: string
  name?: string
  clients: IClient[]
}

/**
 * @standard MCP 2025-11-25
 * @section architecture/index.mdx §Clients
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @definition Each client is created by the host and maintains an isolated
 *   server connection. Establishes one stateful session per server, handles
 *   protocol negotiation and capability exchange, routes protocol messages
 *   bidirectionally, manages subscriptions and notifications, maintains
 *   security boundaries between servers.
 * @constraints
 *   - A client has a 1:1 relationship with a particular server.
 * @associationEnds
 *   - `server: IServer` — exactly one
 *   - `host: IHost` — owning host (back-reference)
 */
export interface IClient {
  clientId: string
  protocolVersion: string
  clientInfo: IImplementation
  capabilities: IClientCapabilities
  transport: ITransport
  server: IServer
  host: IHost
}

/**
 * @standard MCP 2025-11-25
 * @section architecture/index.mdx §Servers
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @definition Servers provide specialized context and capabilities: expose
 *   resources, tools, and prompts via MCP primitives; operate independently
 *   with focused responsibilities; request sampling through client interfaces;
 *   MUST respect security constraints; can be local processes or remote
 *   services.
 * @associationEnds
 *   - `transport: ITransport`
 *   - `serverInfo: IImplementation`
 */
export interface IServer {
  serverId: string
  protocolVersion: string
  serverInfo: IImplementation
  capabilities: IServerCapabilities
  transport: ITransport
  instructions?: string
}

// ═══════════════════════════════════════════════════════════════════════════
// S. TRANSPORT (basic/transports.mdx)
//
// The transport layer is not a schema.ts entity but a normative section of
// the spec. Surfaced here as a closed Enumeration plus a Class for
// configuration. JSON-RPC messages MUST be UTF-8 encoded.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section basic/transports.mdx §Transports
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Enumeration
 * @definition The protocol currently defines two standard transport
 *   mechanisms — `stdio` and `streamable-http`. The legacy `sse` value
 *   refers to the deprecated 2024-11-05 HTTP+SSE transport and is retained
 *   for backwards-compatibility classification only. Closed enumeration:
 *   { stdio, streamable-http, sse }.
 * @constraints
 *   - JSON-RPC messages MUST be UTF-8 encoded over every transport.
 *   - Clients SHOULD support `stdio` whenever possible.
 */
export type ITransportKind = 'stdio' | 'streamable-http' | 'sse'

/**
 * @standard MCP 2025-11-25
 * @section basic/transports.mdx §Transports
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @ownedAttributes
 *   - `kind: ITransportKind`
 *   - `endpoint?: string` — present when `kind ∈ { 'streamable-http', 'sse' }`
 *   - `command?: string` — present when `kind = 'stdio'`
 *   - `args?: string[]` — present when `kind = 'stdio'`
 * @constraints
 *   - When `kind = 'stdio'`, the server MUST NOT write anything to its
 *     `stdout` that is not a valid MCP message.
 *   - When `kind = 'streamable-http'`, servers MUST validate the `Origin`
 *     header on all incoming connections to prevent DNS rebinding attacks.
 *   - When running locally, servers SHOULD bind only to `127.0.0.1` rather
 *     than `0.0.0.0`.
 */
export interface ITransport {
  kind: ITransportKind
  endpoint?: string
  command?: string
  args?: string[]
}

// ═══════════════════════════════════════════════════════════════════════════
// T. AUTHORIZATION (basic/authorization.mdx)
//
// Authorization is OPTIONAL for MCP implementations. When supported, the
// HTTP-based-transport flow conforms to OAuth 2.1 IETF DRAFT (draft-ietf-
// oauth-v2-1-13), RFC 8414 (Authorization Server Metadata), RFC 9728
// (Protected Resource Metadata), RFC 7591 (Dynamic Client Registration), and
// the OAuth Client ID Metadata Documents draft. STDIO-transport
// implementations SHOULD NOT follow this specification — they retrieve
// credentials from the environment instead.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @standard MCP 2025-11-25
 * @section basic/authorization.mdx §Roles
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends OAuth 2.1 protected resource server
 * @definition The server-side authorization aggregate. Pairs a protected MCP
 *   server with the OAuth 2.0 Protected Resource Metadata (RFC 9728) it
 *   advertises and the OAuth 2.1 authorization server endpoints it points
 *   clients toward.
 */
export interface IAuthorization {
  resourceMetadataUrl: string
  authorizationServers: string[]
  scopesSupported?: string[]
  bearerMethodsSupported?: ('header' | 'body' | 'query')[]
  resource?: string
}

/**
 * @standard MCP 2025-11-25
 * @section basic/authorization.mdx §Authorization Server Discovery
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends RFC 8414 (Authorization Server Metadata) +
 *   OpenID Connect Discovery 1.0
 */
export interface IOAuth2Metadata {
  issuer: string
  authorizationEndpoint?: string
  tokenEndpoint?: string
  registrationEndpoint?: string
  jwksUri?: string
  scopesSupported?: string[]
  responseTypesSupported?: string[]
  grantTypesSupported?: string[]
  tokenEndpointAuthMethodsSupported?: string[]
  codeChallengeMethodsSupported?: string[]
}

/**
 * @standard MCP 2025-11-25
 * @section basic/authorization.mdx §Dynamic Client Registration
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends RFC 7591 (OAuth 2.0 Dynamic Client Registration)
 */
export interface IClientCredentials {
  clientId: string
  clientSecret?: string
  clientIdIssuedAt?: number
  clientSecretExpiresAt?: number
  redirectUris?: string[]
  grantTypes?: string[]
  responseTypes?: string[]
  scope?: string
  tokenEndpointAuthMethod?: string
  clientName?: string
  clientUri?: string
}

/**
 * @standard MCP 2025-11-25
 * @section basic/authorization.mdx §Bearer
 * @authority Linux Foundation AI & Agents Foundation
 * @metaclass UML::Class
 * @generalization extends RFC 6750 (Bearer Token Usage)
 */
export interface IBearerToken {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn?: number
  refreshToken?: string
  scope?: string
}

// ═══════════════════════════════════════════════════════════════════════════
// U. METHOD STRING CONSTANTS — exported so runtime dispatchers can match by
//     equality against the literal values cited in schema.ts on every
//     `method: "..."` field.
// ═══════════════════════════════════════════════════════════════════════════

export const MCP_METHOD = {
  // Lifecycle
  INITIALIZE: 'initialize',
  PING: 'ping',
  // Resources
  RESOURCES_LIST: 'resources/list',
  RESOURCES_TEMPLATES_LIST: 'resources/templates/list',
  RESOURCES_READ: 'resources/read',
  RESOURCES_SUBSCRIBE: 'resources/subscribe',
  RESOURCES_UNSUBSCRIBE: 'resources/unsubscribe',
  // Prompts
  PROMPTS_LIST: 'prompts/list',
  PROMPTS_GET: 'prompts/get',
  // Tools
  TOOLS_LIST: 'tools/list',
  TOOLS_CALL: 'tools/call',
  // Sampling (server -> client)
  SAMPLING_CREATE_MESSAGE: 'sampling/createMessage',
  // Logging
  LOGGING_SET_LEVEL: 'logging/setLevel',
  // Completion
  COMPLETION_COMPLETE: 'completion/complete',
  // Roots (server -> client)
  ROOTS_LIST: 'roots/list',
  // Elicitation (server -> client)
  ELICITATION_CREATE: 'elicitation/create',
  // Tasks
  TASKS_GET: 'tasks/get',
  TASKS_RESULT: 'tasks/result',
  TASKS_CANCEL: 'tasks/cancel',
  TASKS_LIST: 'tasks/list',
} as const

export const MCP_NOTIFICATION = {
  CANCELLED: 'notifications/cancelled',
  INITIALIZED: 'notifications/initialized',
  PROGRESS: 'notifications/progress',
  MESSAGE: 'notifications/message',
  RESOURCES_LIST_CHANGED: 'notifications/resources/list_changed',
  RESOURCES_UPDATED: 'notifications/resources/updated',
  PROMPTS_LIST_CHANGED: 'notifications/prompts/list_changed',
  TOOLS_LIST_CHANGED: 'notifications/tools/list_changed',
  ROOTS_LIST_CHANGED: 'notifications/roots/list_changed',
  ELICITATION_COMPLETE: 'notifications/elicitation/complete',
  TASKS_STATUS: 'notifications/tasks/status',
} as const
