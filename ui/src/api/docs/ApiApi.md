# ApiApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createCompany**](ApiApi.md#createcompany) | **POST** /api/companies/ |  |
| [**createContact**](ApiApi.md#createcontact) | **POST** /api/contacts/ |  |
| [**createInvoice**](ApiApi.md#createinvoice) | **POST** /api/invoices/ |  |
| [**createLogin**](ApiApi.md#createlogin) | **POST** /api/users/login/ |  |
| [**createNote**](ApiApi.md#createnote) | **POST** /api/crm/note/ |  |
| [**createProject**](ApiApi.md#createproject) | **POST** /api/projects/ |  |
| [**createSSO**](ApiApi.md#createsso) | **POST** /api/users/sso/ |  |
| [**createTask**](ApiApi.md#createtask) | **POST** /api/tasks/ |  |
| [**createTimeSlip**](ApiApi.md#createtimeslip) | **POST** /api/timeslips/ |  |
| [**destroyCompany**](ApiApi.md#destroycompany) | **DELETE** /api/companies/{id} |  |
| [**destroyContact**](ApiApi.md#destroycontact) | **DELETE** /api/contacts/{id} |  |
| [**destroyInvoice**](ApiApi.md#destroyinvoice) | **DELETE** /api/invoices/{id} |  |
| [**destroyInvoiceModifier**](ApiApi.md#destroyinvoicemodifier) | **DELETE** /api/invoices/{id}/modifiers/{modifier} |  |
| [**destroyProject**](ApiApi.md#destroyproject) | **DELETE** /api/projects/{id} |  |
| [**destroyTask**](ApiApi.md#destroytask) | **DELETE** /api/tasks/{id} |  |
| [**destroyTimeSlip**](ApiApi.md#destroytimeslip) | **DELETE** /api/timeslips/{id} |  |
| [**listAccounts**](ApiApi.md#listaccounts) | **GET** /api/accounts/ |  |
| [**listBulkInvoicePDFs**](ApiApi.md#listbulkinvoicepdfs) | **GET** /api/invoices/zip |  |
| [**listCompanies**](ApiApi.md#listcompanies) | **GET** /api/companies/ |  |
| [**listContacts**](ApiApi.md#listcontacts) | **GET** /api/contacts/ |  |
| [**listInvoiceModifiers**](ApiApi.md#listinvoicemodifiers) | **GET** /api/modifiers/ |  |
| [**listInvoicePDFs**](ApiApi.md#listinvoicepdfs) | **GET** /api/invoices/{id}/pdf |  |
| [**listInvoices**](ApiApi.md#listinvoices) | **GET** /api/invoices/ |  |
| [**listNotes**](ApiApi.md#listnotes) | **GET** /api/crm/note/ |  |
| [**listProjectSummaries**](ApiApi.md#listprojectsummaries) | **GET** /api/projects/summary/ |  |
| [**listProjects**](ApiApi.md#listprojects) | **GET** /api/projects/ |  |
| [**listTasks**](ApiApi.md#listtasks) | **GET** /api/tasks/ |  |
| [**listTimeSlips**](ApiApi.md#listtimeslips) | **GET** /api/timeslips/ |  |
| [**partialUpdateCompany**](ApiApi.md#partialupdatecompany) | **PATCH** /api/companies/{id} |  |
| [**partialUpdateContact**](ApiApi.md#partialupdatecontact) | **PATCH** /api/contacts/{id} |  |
| [**partialUpdateInvoice**](ApiApi.md#partialupdateinvoice) | **PATCH** /api/invoices/{id} |  |
| [**partialUpdateInvoiceModifier**](ApiApi.md#partialupdateinvoicemodifier) | **PATCH** /api/invoices/{id}/modifiers/{modifier} |  |
| [**partialUpdateProject**](ApiApi.md#partialupdateproject) | **PATCH** /api/projects/{id} |  |
| [**partialUpdateTask**](ApiApi.md#partialupdatetask) | **PATCH** /api/tasks/{id} |  |
| [**partialUpdateTimeSlip**](ApiApi.md#partialupdatetimeslip) | **PATCH** /api/timeslips/{id} |  |
| [**retrieveCompany**](ApiApi.md#retrievecompany) | **GET** /api/companies/{id} |  |
| [**retrieveContact**](ApiApi.md#retrievecontact) | **GET** /api/contacts/{id} |  |
| [**retrieveExchangeRate**](ApiApi.md#retrieveexchangerate) | **GET** /api/currency/rates/ |  |
| [**retrieveInvoice**](ApiApi.md#retrieveinvoice) | **GET** /api/invoices/{id} |  |
| [**retrieveInvoiceModifier**](ApiApi.md#retrieveinvoicemodifier) | **GET** /api/invoices/{id}/modifiers/{modifier} |  |
| [**retrieveOneTimeToken**](ApiApi.md#retrieveonetimetoken) | **GET** /api/users/token/ |  |
| [**retrieveProject**](ApiApi.md#retrieveproject) | **GET** /api/projects/{id} |  |
| [**retrieveTask**](ApiApi.md#retrievetask) | **GET** /api/tasks/{id} |  |
| [**retrieveTaskSummary**](ApiApi.md#retrievetasksummary) | **GET** /api/tasks/{id}/summary |  |
| [**retrieveTimeSlip**](ApiApi.md#retrievetimeslip) | **GET** /api/timeslips/{id} |  |
| [**retrieveUser**](ApiApi.md#retrieveuser) | **GET** /api/users/ |  |
| [**retrieveVersion**](ApiApi.md#retrieveversion) | **GET** /api/version/ |  |
| [**updateCompany**](ApiApi.md#updatecompany) | **PUT** /api/companies/{id} |  |
| [**updateContact**](ApiApi.md#updatecontact) | **PUT** /api/contacts/{id} |  |
| [**updateInvoice**](ApiApi.md#updateinvoice) | **PUT** /api/invoices/{id} |  |
| [**updateInvoiceModifier**](ApiApi.md#updateinvoicemodifier) | **PUT** /api/invoices/{id}/modifiers/{modifier} |  |
| [**updateProject**](ApiApi.md#updateproject) | **PUT** /api/projects/{id} |  |
| [**updateTask**](ApiApi.md#updatetask) | **PUT** /api/tasks/{id} |  |
| [**updateTimeSlip**](ApiApi.md#updatetimeslip) | **PUT** /api/timeslips/{id} |  |



## createCompany

> Company createCompany(company)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { CreateCompanyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // Company (optional)
    company: ...,
  } satisfies CreateCompanyRequest;

  try {
    const data = await api.createCompany(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **company** | [Company](Company.md) |  | [Optional] |

### Return type

[**Company**](Company.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createContact

> Contact createContact(contact)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { CreateContactRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // Contact (optional)
    contact: ...,
  } satisfies CreateContactRequest;

  try {
    const data = await api.createContact(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **contact** | [Contact](Contact.md) |  | [Optional] |

### Return type

[**Contact**](Contact.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createInvoice

> Invoice createInvoice(invoice)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { CreateInvoiceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // Invoice (optional)
    invoice: ...,
  } satisfies CreateInvoiceRequest;

  try {
    const data = await api.createInvoice(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **invoice** | [Invoice](Invoice.md) |  | [Optional] |

### Return type

[**Invoice**](Invoice.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createLogin

> Login createLogin(login)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { CreateLoginRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // Login (optional)
    login: ...,
  } satisfies CreateLoginRequest;

  try {
    const data = await api.createLogin(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **login** | [Login](Login.md) |  | [Optional] |

### Return type

[**Login**](Login.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createNote

> Note createNote(note)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { CreateNoteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // Note (optional)
    note: ...,
  } satisfies CreateNoteRequest;

  try {
    const data = await api.createNote(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **note** | [Note](Note.md) |  | [Optional] |

### Return type

[**Note**](Note.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createProject

> Project createProject(project)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { CreateProjectRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // Project (optional)
    project: ...,
  } satisfies CreateProjectRequest;

  try {
    const data = await api.createProject(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **project** | [Project](Project.md) |  | [Optional] |

### Return type

[**Project**](Project.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createSSO

> SSO createSSO(sSO)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { CreateSSORequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // SSO (optional)
    sSO: ...,
  } satisfies CreateSSORequest;

  try {
    const data = await api.createSSO(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sSO** | [SSO](SSO.md) |  | [Optional] |

### Return type

[**SSO**](SSO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createTask

> Task createTask(task)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { CreateTaskRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // Task (optional)
    task: ...,
  } satisfies CreateTaskRequest;

  try {
    const data = await api.createTask(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **task** | [Task](Task.md) |  | [Optional] |

### Return type

[**Task**](Task.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createTimeSlip

> TimeSlip createTimeSlip(timeSlip)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { CreateTimeSlipRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // TimeSlip (optional)
    timeSlip: ...,
  } satisfies CreateTimeSlipRequest;

  try {
    const data = await api.createTimeSlip(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **timeSlip** | [TimeSlip](TimeSlip.md) |  | [Optional] |

### Return type

[**TimeSlip**](TimeSlip.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## destroyCompany

> destroyCompany(id)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { DestroyCompanyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this company.
    id: id_example,
  } satisfies DestroyCompanyRequest;

  try {
    const data = await api.destroyCompany(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this company. | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## destroyContact

> destroyContact(id)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { DestroyContactRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this contact.
    id: id_example,
  } satisfies DestroyContactRequest;

  try {
    const data = await api.destroyContact(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this contact. | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## destroyInvoice

> destroyInvoice(id)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { DestroyInvoiceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this invoice.
    id: id_example,
  } satisfies DestroyInvoiceRequest;

  try {
    const data = await api.destroyInvoice(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this invoice. | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## destroyInvoiceModifier

> destroyInvoiceModifier(id, modifier)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { DestroyInvoiceModifierRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | 
    id: id_example,
    // string | 
    modifier: modifier_example,
  } satisfies DestroyInvoiceModifierRequest;

  try {
    const data = await api.destroyInvoiceModifier(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **modifier** | `string` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## destroyProject

> destroyProject(id)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { DestroyProjectRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this project.
    id: id_example,
  } satisfies DestroyProjectRequest;

  try {
    const data = await api.destroyProject(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this project. | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## destroyTask

> destroyTask(id)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { DestroyTaskRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this task.
    id: id_example,
  } satisfies DestroyTaskRequest;

  try {
    const data = await api.destroyTask(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this task. | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## destroyTimeSlip

> destroyTimeSlip(id)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { DestroyTimeSlipRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this time slip.
    id: id_example,
  } satisfies DestroyTimeSlipRequest;

  try {
    const data = await api.destroyTimeSlip(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this time slip. | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listAccounts

> ListAccounts200Response listAccounts(limit, offset)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { ListAccountsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // number | Number of results to return per page. (optional)
    limit: 56,
    // number | The initial index from which to return the results. (optional)
    offset: 56,
  } satisfies ListAccountsRequest;

  try {
    const data = await api.listAccounts(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` | Number of results to return per page. | [Optional] [Defaults to `undefined`] |
| **offset** | `number` | The initial index from which to return the results. | [Optional] [Defaults to `undefined`] |

### Return type

[**ListAccounts200Response**](ListAccounts200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listBulkInvoicePDFs

> Array&lt;any&gt; listBulkInvoicePDFs()





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { ListBulkInvoicePDFsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  try {
    const data = await api.listBulkInvoicePDFs();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

**Array<any>**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listCompanies

> ListCompanies200Response listCompanies(limit, offset)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { ListCompaniesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // number | Number of results to return per page. (optional)
    limit: 56,
    // number | The initial index from which to return the results. (optional)
    offset: 56,
  } satisfies ListCompaniesRequest;

  try {
    const data = await api.listCompanies(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` | Number of results to return per page. | [Optional] [Defaults to `undefined`] |
| **offset** | `number` | The initial index from which to return the results. | [Optional] [Defaults to `undefined`] |

### Return type

[**ListCompanies200Response**](ListCompanies200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listContacts

> ListContacts200Response listContacts(limit, offset, search)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { ListContactsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // number | Number of results to return per page. (optional)
    limit: 56,
    // number | The initial index from which to return the results. (optional)
    offset: 56,
    // string | search (optional)
    search: search_example,
  } satisfies ListContactsRequest;

  try {
    const data = await api.listContacts(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` | Number of results to return per page. | [Optional] [Defaults to `undefined`] |
| **offset** | `number` | The initial index from which to return the results. | [Optional] [Defaults to `undefined`] |
| **search** | `string` | search | [Optional] [Defaults to `undefined`] |

### Return type

[**ListContacts200Response**](ListContacts200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listInvoiceModifiers

> ListInvoiceModifiers200Response listInvoiceModifiers(limit, offset)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { ListInvoiceModifiersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // number | Number of results to return per page. (optional)
    limit: 56,
    // number | The initial index from which to return the results. (optional)
    offset: 56,
  } satisfies ListInvoiceModifiersRequest;

  try {
    const data = await api.listInvoiceModifiers(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` | Number of results to return per page. | [Optional] [Defaults to `undefined`] |
| **offset** | `number` | The initial index from which to return the results. | [Optional] [Defaults to `undefined`] |

### Return type

[**ListInvoiceModifiers200Response**](ListInvoiceModifiers200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listInvoicePDFs

> Array&lt;any&gt; listInvoicePDFs(id)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { ListInvoicePDFsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | 
    id: id_example,
  } satisfies ListInvoicePDFsRequest;

  try {
    const data = await api.listInvoicePDFs(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

**Array<any>**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listInvoices

> ListInvoices200Response listInvoices(limit, offset)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { ListInvoicesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // number | Number of results to return per page. (optional)
    limit: 56,
    // number | The initial index from which to return the results. (optional)
    offset: 56,
  } satisfies ListInvoicesRequest;

  try {
    const data = await api.listInvoices(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` | Number of results to return per page. | [Optional] [Defaults to `undefined`] |
| **offset** | `number` | The initial index from which to return the results. | [Optional] [Defaults to `undefined`] |

### Return type

[**ListInvoices200Response**](ListInvoices200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listNotes

> ListNotes200Response listNotes(limit, offset, contact)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { ListNotesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // number | Number of results to return per page. (optional)
    limit: 56,
    // number | The initial index from which to return the results. (optional)
    offset: 56,
    // string | contact (optional)
    contact: contact_example,
  } satisfies ListNotesRequest;

  try {
    const data = await api.listNotes(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` | Number of results to return per page. | [Optional] [Defaults to `undefined`] |
| **offset** | `number` | The initial index from which to return the results. | [Optional] [Defaults to `undefined`] |
| **contact** | `string` | contact | [Optional] [Defaults to `undefined`] |

### Return type

[**ListNotes200Response**](ListNotes200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listProjectSummaries

> ListProjectSummaries200Response listProjectSummaries(limit, offset)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { ListProjectSummariesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // number | Number of results to return per page. (optional)
    limit: 56,
    // number | The initial index from which to return the results. (optional)
    offset: 56,
  } satisfies ListProjectSummariesRequest;

  try {
    const data = await api.listProjectSummaries(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` | Number of results to return per page. | [Optional] [Defaults to `undefined`] |
| **offset** | `number` | The initial index from which to return the results. | [Optional] [Defaults to `undefined`] |

### Return type

[**ListProjectSummaries200Response**](ListProjectSummaries200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listProjects

> ListProjects200Response listProjects(limit, offset)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { ListProjectsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // number | Number of results to return per page. (optional)
    limit: 56,
    // number | The initial index from which to return the results. (optional)
    offset: 56,
  } satisfies ListProjectsRequest;

  try {
    const data = await api.listProjects(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` | Number of results to return per page. | [Optional] [Defaults to `undefined`] |
| **offset** | `number` | The initial index from which to return the results. | [Optional] [Defaults to `undefined`] |

### Return type

[**ListProjects200Response**](ListProjects200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listTasks

> ListTasks200Response listTasks(limit, offset, invoices, project, noInvoice, billingType, state)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { ListTasksRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // number | Number of results to return per page. (optional)
    limit: 56,
    // number | The initial index from which to return the results. (optional)
    offset: 56,
    // string | invoices (optional)
    invoices: invoices_example,
    // string | project (optional)
    project: project_example,
    // string | no_invoice (optional)
    noInvoice: noInvoice_example,
    // 'TIME' | 'FIXED' | billing_type (optional)
    billingType: billingType_example,
    // 'OPEN' | 'PROGRESS' | 'DONE' | state (optional)
    state: state_example,
  } satisfies ListTasksRequest;

  try {
    const data = await api.listTasks(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` | Number of results to return per page. | [Optional] [Defaults to `undefined`] |
| **offset** | `number` | The initial index from which to return the results. | [Optional] [Defaults to `undefined`] |
| **invoices** | `string` | invoices | [Optional] [Defaults to `undefined`] |
| **project** | `string` | project | [Optional] [Defaults to `undefined`] |
| **noInvoice** | `string` | no_invoice | [Optional] [Defaults to `undefined`] |
| **billingType** | `TIME`, `FIXED` | billing_type | [Optional] [Defaults to `undefined`] [Enum: TIME, FIXED] |
| **state** | `OPEN`, `PROGRESS`, `DONE` | state | [Optional] [Defaults to `undefined`] [Enum: OPEN, PROGRESS, DONE] |

### Return type

[**ListTasks200Response**](ListTasks200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listTimeSlips

> ListTimeSlips200Response listTimeSlips(limit, offset, invoice, project, start, end, noInvoice)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { ListTimeSlipsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // number | Number of results to return per page. (optional)
    limit: 56,
    // number | The initial index from which to return the results. (optional)
    offset: 56,
    // string | invoice (optional)
    invoice: invoice_example,
    // string | project (optional)
    project: project_example,
    // string | start (optional)
    start: start_example,
    // string | end (optional)
    end: end_example,
    // string | no_invoice (optional)
    noInvoice: noInvoice_example,
  } satisfies ListTimeSlipsRequest;

  try {
    const data = await api.listTimeSlips(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` | Number of results to return per page. | [Optional] [Defaults to `undefined`] |
| **offset** | `number` | The initial index from which to return the results. | [Optional] [Defaults to `undefined`] |
| **invoice** | `string` | invoice | [Optional] [Defaults to `undefined`] |
| **project** | `string` | project | [Optional] [Defaults to `undefined`] |
| **start** | `string` | start | [Optional] [Defaults to `undefined`] |
| **end** | `string` | end | [Optional] [Defaults to `undefined`] |
| **noInvoice** | `string` | no_invoice | [Optional] [Defaults to `undefined`] |

### Return type

[**ListTimeSlips200Response**](ListTimeSlips200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## partialUpdateCompany

> Company partialUpdateCompany(id, company)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { PartialUpdateCompanyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this company.
    id: id_example,
    // Company (optional)
    company: ...,
  } satisfies PartialUpdateCompanyRequest;

  try {
    const data = await api.partialUpdateCompany(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this company. | [Defaults to `undefined`] |
| **company** | [Company](Company.md) |  | [Optional] |

### Return type

[**Company**](Company.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## partialUpdateContact

> Contact partialUpdateContact(id, contact)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { PartialUpdateContactRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this contact.
    id: id_example,
    // Contact (optional)
    contact: ...,
  } satisfies PartialUpdateContactRequest;

  try {
    const data = await api.partialUpdateContact(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this contact. | [Defaults to `undefined`] |
| **contact** | [Contact](Contact.md) |  | [Optional] |

### Return type

[**Contact**](Contact.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## partialUpdateInvoice

> Invoice partialUpdateInvoice(id, invoice)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { PartialUpdateInvoiceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this invoice.
    id: id_example,
    // Invoice (optional)
    invoice: ...,
  } satisfies PartialUpdateInvoiceRequest;

  try {
    const data = await api.partialUpdateInvoice(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this invoice. | [Defaults to `undefined`] |
| **invoice** | [Invoice](Invoice.md) |  | [Optional] |

### Return type

[**Invoice**](Invoice.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## partialUpdateInvoiceModifier

> InvoiceModifier partialUpdateInvoiceModifier(id, modifier, invoiceModifier)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { PartialUpdateInvoiceModifierRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | 
    id: id_example,
    // string | 
    modifier: modifier_example,
    // InvoiceModifier (optional)
    invoiceModifier: ...,
  } satisfies PartialUpdateInvoiceModifierRequest;

  try {
    const data = await api.partialUpdateInvoiceModifier(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **modifier** | `string` |  | [Defaults to `undefined`] |
| **invoiceModifier** | [InvoiceModifier](InvoiceModifier.md) |  | [Optional] |

### Return type

[**InvoiceModifier**](InvoiceModifier.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## partialUpdateProject

> Project partialUpdateProject(id, project)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { PartialUpdateProjectRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this project.
    id: id_example,
    // Project (optional)
    project: ...,
  } satisfies PartialUpdateProjectRequest;

  try {
    const data = await api.partialUpdateProject(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this project. | [Defaults to `undefined`] |
| **project** | [Project](Project.md) |  | [Optional] |

### Return type

[**Project**](Project.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## partialUpdateTask

> Task partialUpdateTask(id, task)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { PartialUpdateTaskRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this task.
    id: id_example,
    // Task (optional)
    task: ...,
  } satisfies PartialUpdateTaskRequest;

  try {
    const data = await api.partialUpdateTask(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this task. | [Defaults to `undefined`] |
| **task** | [Task](Task.md) |  | [Optional] |

### Return type

[**Task**](Task.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## partialUpdateTimeSlip

> TimeSlip partialUpdateTimeSlip(id, timeSlip)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { PartialUpdateTimeSlipRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this time slip.
    id: id_example,
    // TimeSlip (optional)
    timeSlip: ...,
  } satisfies PartialUpdateTimeSlipRequest;

  try {
    const data = await api.partialUpdateTimeSlip(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this time slip. | [Defaults to `undefined`] |
| **timeSlip** | [TimeSlip](TimeSlip.md) |  | [Optional] |

### Return type

[**TimeSlip**](TimeSlip.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## retrieveCompany

> Company retrieveCompany(id)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { RetrieveCompanyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this company.
    id: id_example,
  } satisfies RetrieveCompanyRequest;

  try {
    const data = await api.retrieveCompany(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this company. | [Defaults to `undefined`] |

### Return type

[**Company**](Company.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## retrieveContact

> Contact retrieveContact(id)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { RetrieveContactRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this contact.
    id: id_example,
  } satisfies RetrieveContactRequest;

  try {
    const data = await api.retrieveContact(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this contact. | [Defaults to `undefined`] |

### Return type

[**Contact**](Contact.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## retrieveExchangeRate

> ExchangeRate retrieveExchangeRate()





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { RetrieveExchangeRateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  try {
    const data = await api.retrieveExchangeRate();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ExchangeRate**](ExchangeRate.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## retrieveInvoice

> Invoice retrieveInvoice(id)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { RetrieveInvoiceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this invoice.
    id: id_example,
  } satisfies RetrieveInvoiceRequest;

  try {
    const data = await api.retrieveInvoice(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this invoice. | [Defaults to `undefined`] |

### Return type

[**Invoice**](Invoice.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## retrieveInvoiceModifier

> InvoiceModifier retrieveInvoiceModifier(id, modifier)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { RetrieveInvoiceModifierRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | 
    id: id_example,
    // string | 
    modifier: modifier_example,
  } satisfies RetrieveInvoiceModifierRequest;

  try {
    const data = await api.retrieveInvoiceModifier(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **modifier** | `string` |  | [Defaults to `undefined`] |

### Return type

[**InvoiceModifier**](InvoiceModifier.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## retrieveOneTimeToken

> OneTimeToken retrieveOneTimeToken()





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { RetrieveOneTimeTokenRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  try {
    const data = await api.retrieveOneTimeToken();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**OneTimeToken**](OneTimeToken.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## retrieveProject

> Project retrieveProject(id)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { RetrieveProjectRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this project.
    id: id_example,
  } satisfies RetrieveProjectRequest;

  try {
    const data = await api.retrieveProject(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this project. | [Defaults to `undefined`] |

### Return type

[**Project**](Project.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## retrieveTask

> Task retrieveTask(id)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { RetrieveTaskRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this task.
    id: id_example,
  } satisfies RetrieveTaskRequest;

  try {
    const data = await api.retrieveTask(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this task. | [Defaults to `undefined`] |

### Return type

[**Task**](Task.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## retrieveTaskSummary

> TaskSummary retrieveTaskSummary(id)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { RetrieveTaskSummaryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this task.
    id: id_example,
  } satisfies RetrieveTaskSummaryRequest;

  try {
    const data = await api.retrieveTaskSummary(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this task. | [Defaults to `undefined`] |

### Return type

[**TaskSummary**](TaskSummary.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## retrieveTimeSlip

> TimeSlip retrieveTimeSlip(id)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { RetrieveTimeSlipRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this time slip.
    id: id_example,
  } satisfies RetrieveTimeSlipRequest;

  try {
    const data = await api.retrieveTimeSlip(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this time slip. | [Defaults to `undefined`] |

### Return type

[**TimeSlip**](TimeSlip.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## retrieveUser

> User retrieveUser()





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { RetrieveUserRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  try {
    const data = await api.retrieveUser();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**User**](User.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## retrieveVersion

> Version retrieveVersion()





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { RetrieveVersionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  try {
    const data = await api.retrieveVersion();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Version**](Version.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateCompany

> Company updateCompany(id, company)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { UpdateCompanyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this company.
    id: id_example,
    // Company (optional)
    company: ...,
  } satisfies UpdateCompanyRequest;

  try {
    const data = await api.updateCompany(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this company. | [Defaults to `undefined`] |
| **company** | [Company](Company.md) |  | [Optional] |

### Return type

[**Company**](Company.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateContact

> Contact updateContact(id, contact)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { UpdateContactRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this contact.
    id: id_example,
    // Contact (optional)
    contact: ...,
  } satisfies UpdateContactRequest;

  try {
    const data = await api.updateContact(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this contact. | [Defaults to `undefined`] |
| **contact** | [Contact](Contact.md) |  | [Optional] |

### Return type

[**Contact**](Contact.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateInvoice

> Invoice updateInvoice(id, invoice)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { UpdateInvoiceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this invoice.
    id: id_example,
    // Invoice (optional)
    invoice: ...,
  } satisfies UpdateInvoiceRequest;

  try {
    const data = await api.updateInvoice(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this invoice. | [Defaults to `undefined`] |
| **invoice** | [Invoice](Invoice.md) |  | [Optional] |

### Return type

[**Invoice**](Invoice.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateInvoiceModifier

> InvoiceModifier updateInvoiceModifier(id, modifier, invoiceModifier)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { UpdateInvoiceModifierRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | 
    id: id_example,
    // string | 
    modifier: modifier_example,
    // InvoiceModifier (optional)
    invoiceModifier: ...,
  } satisfies UpdateInvoiceModifierRequest;

  try {
    const data = await api.updateInvoiceModifier(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **modifier** | `string` |  | [Defaults to `undefined`] |
| **invoiceModifier** | [InvoiceModifier](InvoiceModifier.md) |  | [Optional] |

### Return type

[**InvoiceModifier**](InvoiceModifier.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateProject

> Project updateProject(id, project)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { UpdateProjectRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this project.
    id: id_example,
    // Project (optional)
    project: ...,
  } satisfies UpdateProjectRequest;

  try {
    const data = await api.updateProject(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this project. | [Defaults to `undefined`] |
| **project** | [Project](Project.md) |  | [Optional] |

### Return type

[**Project**](Project.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateTask

> Task updateTask(id, task)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { UpdateTaskRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this task.
    id: id_example,
    // Task (optional)
    task: ...,
  } satisfies UpdateTaskRequest;

  try {
    const data = await api.updateTask(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this task. | [Defaults to `undefined`] |
| **task** | [Task](Task.md) |  | [Optional] |

### Return type

[**Task**](Task.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateTimeSlip

> TimeSlip updateTimeSlip(id, timeSlip)





### Example

```ts
import {
  Configuration,
  ApiApi,
} from '';
import type { UpdateTimeSlipRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ApiApi();

  const body = {
    // string | A unique integer value identifying this time slip.
    id: id_example,
    // TimeSlip (optional)
    timeSlip: ...,
  } satisfies UpdateTimeSlipRequest;

  try {
    const data = await api.updateTimeSlip(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | A unique integer value identifying this time slip. | [Defaults to `undefined`] |
| **timeSlip** | [TimeSlip](TimeSlip.md) |  | [Optional] |

### Return type

[**TimeSlip**](TimeSlip.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

