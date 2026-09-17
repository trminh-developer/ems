# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUser*](#getuser)
  - [*ListUsers*](#listusers)
  - [*GetMyPatientProfile*](#getmypatientprofile)
  - [*ListPatientProfiles*](#listpatientprofiles)
  - [*GetVitalReading*](#getvitalreading)
  - [*ListMyVitalReadings*](#listmyvitalreadings)
  - [*GetAssignment*](#getassignment)
  - [*ListMyAssignments*](#listmyassignments)
  - [*GetAlert*](#getalert)
  - [*ListAlerts*](#listalerts)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateUser*](#updateuser)
  - [*DeleteUser*](#deleteuser)
  - [*CreatePatientProfile*](#createpatientprofile)
  - [*UpdatePatientProfile*](#updatepatientprofile)
  - [*DeletePatientProfile*](#deletepatientprofile)
  - [*CreateVitalReading*](#createvitalreading)
  - [*UpdateVitalReading*](#updatevitalreading)
  - [*DeleteVitalReading*](#deletevitalreading)
  - [*CreateAssignment*](#createassignment)
  - [*UpdateAssignment*](#updateassignment)
  - [*DeleteAssignment*](#deleteassignment)
  - [*CreateAlert*](#createalert)
  - [*UpdateAlert*](#updatealert)
  - [*DeleteAlert*](#deletealert)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUser(options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query has no variables.
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserData {
  user?: {
    id: UUIDString;
    fullName: string;
    email: string;
  } & User_Key;
}
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser } from '@dataconnect/generated';


// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef } from '@dataconnect/generated';


// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListUsers
You can execute the `ListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersRef:
```typescript
const name = listUsersRef.operationName;
console.log(name);
```

### Variables
The `ListUsers` query has no variables.
### Return Type
Recall that executing the `ListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsersData {
  users: ({
    id: UUIDString;
    fullName: string;
    role: string;
  } & User_Key)[];
}
```
### Using `ListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsers } from '@dataconnect/generated';


// Call the `listUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsersRef } from '@dataconnect/generated';


// Call the `listUsersRef()` function to get a reference to the query.
const ref = listUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetMyPatientProfile
You can execute the `GetMyPatientProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyPatientProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyPatientProfileData, undefined>;

interface GetMyPatientProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyPatientProfileData, undefined>;
}
export const getMyPatientProfileRef: GetMyPatientProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyPatientProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyPatientProfileData, undefined>;

interface GetMyPatientProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetMyPatientProfileData, undefined>;
}
export const getMyPatientProfileRef: GetMyPatientProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyPatientProfileRef:
```typescript
const name = getMyPatientProfileRef.operationName;
console.log(name);
```

### Variables
The `GetMyPatientProfile` query has no variables.
### Return Type
Recall that executing the `GetMyPatientProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyPatientProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyPatientProfileData {
  patientProfile?: {
    dateOfBirth: DateString;
    currentMedications?: string | null;
  };
}
```
### Using `GetMyPatientProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyPatientProfile } from '@dataconnect/generated';


// Call the `getMyPatientProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyPatientProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyPatientProfile(dataConnect);

console.log(data.patientProfile);

// Or, you can use the `Promise` API.
getMyPatientProfile().then((response) => {
  const data = response.data;
  console.log(data.patientProfile);
});
```

### Using `GetMyPatientProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyPatientProfileRef } from '@dataconnect/generated';


// Call the `getMyPatientProfileRef()` function to get a reference to the query.
const ref = getMyPatientProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyPatientProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.patientProfile);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.patientProfile);
});
```

## ListPatientProfiles
You can execute the `ListPatientProfiles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPatientProfiles(options?: ExecuteQueryOptions): QueryPromise<ListPatientProfilesData, undefined>;

interface ListPatientProfilesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPatientProfilesData, undefined>;
}
export const listPatientProfilesRef: ListPatientProfilesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPatientProfiles(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPatientProfilesData, undefined>;

interface ListPatientProfilesRef {
  ...
  (dc: DataConnect): QueryRef<ListPatientProfilesData, undefined>;
}
export const listPatientProfilesRef: ListPatientProfilesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPatientProfilesRef:
```typescript
const name = listPatientProfilesRef.operationName;
console.log(name);
```

### Variables
The `ListPatientProfiles` query has no variables.
### Return Type
Recall that executing the `ListPatientProfiles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPatientProfilesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPatientProfilesData {
  patientProfiles: ({
    id: UUIDString;
    user: {
      fullName: string;
    };
  } & PatientProfile_Key)[];
}
```
### Using `ListPatientProfiles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPatientProfiles } from '@dataconnect/generated';


// Call the `listPatientProfiles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPatientProfiles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPatientProfiles(dataConnect);

console.log(data.patientProfiles);

// Or, you can use the `Promise` API.
listPatientProfiles().then((response) => {
  const data = response.data;
  console.log(data.patientProfiles);
});
```

### Using `ListPatientProfiles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPatientProfilesRef } from '@dataconnect/generated';


// Call the `listPatientProfilesRef()` function to get a reference to the query.
const ref = listPatientProfilesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPatientProfilesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.patientProfiles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.patientProfiles);
});
```

## GetVitalReading
You can execute the `GetVitalReading` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getVitalReading(vars: GetVitalReadingVariables, options?: ExecuteQueryOptions): QueryPromise<GetVitalReadingData, GetVitalReadingVariables>;

interface GetVitalReadingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVitalReadingVariables): QueryRef<GetVitalReadingData, GetVitalReadingVariables>;
}
export const getVitalReadingRef: GetVitalReadingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getVitalReading(dc: DataConnect, vars: GetVitalReadingVariables, options?: ExecuteQueryOptions): QueryPromise<GetVitalReadingData, GetVitalReadingVariables>;

interface GetVitalReadingRef {
  ...
  (dc: DataConnect, vars: GetVitalReadingVariables): QueryRef<GetVitalReadingData, GetVitalReadingVariables>;
}
export const getVitalReadingRef: GetVitalReadingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getVitalReadingRef:
```typescript
const name = getVitalReadingRef.operationName;
console.log(name);
```

### Variables
The `GetVitalReading` query requires an argument of type `GetVitalReadingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetVitalReadingVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetVitalReading` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetVitalReadingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetVitalReadingData {
  vitalReading?: {
    heartRate: number;
    systolicBP: number;
  };
}
```
### Using `GetVitalReading`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getVitalReading, GetVitalReadingVariables } from '@dataconnect/generated';

// The `GetVitalReading` query requires an argument of type `GetVitalReadingVariables`:
const getVitalReadingVars: GetVitalReadingVariables = {
  id: ..., 
};

// Call the `getVitalReading()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getVitalReading(getVitalReadingVars);
// Variables can be defined inline as well.
const { data } = await getVitalReading({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getVitalReading(dataConnect, getVitalReadingVars);

console.log(data.vitalReading);

// Or, you can use the `Promise` API.
getVitalReading(getVitalReadingVars).then((response) => {
  const data = response.data;
  console.log(data.vitalReading);
});
```

### Using `GetVitalReading`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getVitalReadingRef, GetVitalReadingVariables } from '@dataconnect/generated';

// The `GetVitalReading` query requires an argument of type `GetVitalReadingVariables`:
const getVitalReadingVars: GetVitalReadingVariables = {
  id: ..., 
};

// Call the `getVitalReadingRef()` function to get a reference to the query.
const ref = getVitalReadingRef(getVitalReadingVars);
// Variables can be defined inline as well.
const ref = getVitalReadingRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getVitalReadingRef(dataConnect, getVitalReadingVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vitalReading);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vitalReading);
});
```

## ListMyVitalReadings
You can execute the `ListMyVitalReadings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyVitalReadings(options?: ExecuteQueryOptions): QueryPromise<ListMyVitalReadingsData, undefined>;

interface ListMyVitalReadingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyVitalReadingsData, undefined>;
}
export const listMyVitalReadingsRef: ListMyVitalReadingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyVitalReadings(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyVitalReadingsData, undefined>;

interface ListMyVitalReadingsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyVitalReadingsData, undefined>;
}
export const listMyVitalReadingsRef: ListMyVitalReadingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyVitalReadingsRef:
```typescript
const name = listMyVitalReadingsRef.operationName;
console.log(name);
```

### Variables
The `ListMyVitalReadings` query has no variables.
### Return Type
Recall that executing the `ListMyVitalReadings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyVitalReadingsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyVitalReadingsData {
  vitalReadings: ({
    timestamp: TimestampString;
    heartRate: number;
  })[];
}
```
### Using `ListMyVitalReadings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyVitalReadings } from '@dataconnect/generated';


// Call the `listMyVitalReadings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyVitalReadings();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyVitalReadings(dataConnect);

console.log(data.vitalReadings);

// Or, you can use the `Promise` API.
listMyVitalReadings().then((response) => {
  const data = response.data;
  console.log(data.vitalReadings);
});
```

### Using `ListMyVitalReadings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyVitalReadingsRef } from '@dataconnect/generated';


// Call the `listMyVitalReadingsRef()` function to get a reference to the query.
const ref = listMyVitalReadingsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyVitalReadingsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.vitalReadings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.vitalReadings);
});
```

## GetAssignment
You can execute the `GetAssignment` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getAssignment(vars: GetAssignmentVariables, options?: ExecuteQueryOptions): QueryPromise<GetAssignmentData, GetAssignmentVariables>;

interface GetAssignmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAssignmentVariables): QueryRef<GetAssignmentData, GetAssignmentVariables>;
}
export const getAssignmentRef: GetAssignmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAssignment(dc: DataConnect, vars: GetAssignmentVariables, options?: ExecuteQueryOptions): QueryPromise<GetAssignmentData, GetAssignmentVariables>;

interface GetAssignmentRef {
  ...
  (dc: DataConnect, vars: GetAssignmentVariables): QueryRef<GetAssignmentData, GetAssignmentVariables>;
}
export const getAssignmentRef: GetAssignmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAssignmentRef:
```typescript
const name = getAssignmentRef.operationName;
console.log(name);
```

### Variables
The `GetAssignment` query requires an argument of type `GetAssignmentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAssignmentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetAssignment` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAssignmentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAssignmentData {
  doctorPatientAssignment?: {
    patient: {
      fullName: string;
    };
  };
}
```
### Using `GetAssignment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAssignment, GetAssignmentVariables } from '@dataconnect/generated';

// The `GetAssignment` query requires an argument of type `GetAssignmentVariables`:
const getAssignmentVars: GetAssignmentVariables = {
  id: ..., 
};

// Call the `getAssignment()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAssignment(getAssignmentVars);
// Variables can be defined inline as well.
const { data } = await getAssignment({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAssignment(dataConnect, getAssignmentVars);

console.log(data.doctorPatientAssignment);

// Or, you can use the `Promise` API.
getAssignment(getAssignmentVars).then((response) => {
  const data = response.data;
  console.log(data.doctorPatientAssignment);
});
```

### Using `GetAssignment`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAssignmentRef, GetAssignmentVariables } from '@dataconnect/generated';

// The `GetAssignment` query requires an argument of type `GetAssignmentVariables`:
const getAssignmentVars: GetAssignmentVariables = {
  id: ..., 
};

// Call the `getAssignmentRef()` function to get a reference to the query.
const ref = getAssignmentRef(getAssignmentVars);
// Variables can be defined inline as well.
const ref = getAssignmentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAssignmentRef(dataConnect, getAssignmentVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.doctorPatientAssignment);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.doctorPatientAssignment);
});
```

## ListMyAssignments
You can execute the `ListMyAssignments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyAssignments(options?: ExecuteQueryOptions): QueryPromise<ListMyAssignmentsData, undefined>;

interface ListMyAssignmentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyAssignmentsData, undefined>;
}
export const listMyAssignmentsRef: ListMyAssignmentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyAssignments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyAssignmentsData, undefined>;

interface ListMyAssignmentsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyAssignmentsData, undefined>;
}
export const listMyAssignmentsRef: ListMyAssignmentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyAssignmentsRef:
```typescript
const name = listMyAssignmentsRef.operationName;
console.log(name);
```

### Variables
The `ListMyAssignments` query has no variables.
### Return Type
Recall that executing the `ListMyAssignments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyAssignmentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyAssignmentsData {
  doctorPatientAssignments: ({
    patient: {
      fullName: string;
    };
  })[];
}
```
### Using `ListMyAssignments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyAssignments } from '@dataconnect/generated';


// Call the `listMyAssignments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyAssignments();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyAssignments(dataConnect);

console.log(data.doctorPatientAssignments);

// Or, you can use the `Promise` API.
listMyAssignments().then((response) => {
  const data = response.data;
  console.log(data.doctorPatientAssignments);
});
```

### Using `ListMyAssignments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyAssignmentsRef } from '@dataconnect/generated';


// Call the `listMyAssignmentsRef()` function to get a reference to the query.
const ref = listMyAssignmentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyAssignmentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.doctorPatientAssignments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.doctorPatientAssignments);
});
```

## GetAlert
You can execute the `GetAlert` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getAlert(vars: GetAlertVariables, options?: ExecuteQueryOptions): QueryPromise<GetAlertData, GetAlertVariables>;

interface GetAlertRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAlertVariables): QueryRef<GetAlertData, GetAlertVariables>;
}
export const getAlertRef: GetAlertRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAlert(dc: DataConnect, vars: GetAlertVariables, options?: ExecuteQueryOptions): QueryPromise<GetAlertData, GetAlertVariables>;

interface GetAlertRef {
  ...
  (dc: DataConnect, vars: GetAlertVariables): QueryRef<GetAlertData, GetAlertVariables>;
}
export const getAlertRef: GetAlertRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAlertRef:
```typescript
const name = getAlertRef.operationName;
console.log(name);
```

### Variables
The `GetAlert` query requires an argument of type `GetAlertVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAlertVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetAlert` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAlertData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAlertData {
  alert?: {
    triggerReason: string;
    severity: string;
  };
}
```
### Using `GetAlert`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAlert, GetAlertVariables } from '@dataconnect/generated';

// The `GetAlert` query requires an argument of type `GetAlertVariables`:
const getAlertVars: GetAlertVariables = {
  id: ..., 
};

// Call the `getAlert()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAlert(getAlertVars);
// Variables can be defined inline as well.
const { data } = await getAlert({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAlert(dataConnect, getAlertVars);

console.log(data.alert);

// Or, you can use the `Promise` API.
getAlert(getAlertVars).then((response) => {
  const data = response.data;
  console.log(data.alert);
});
```

### Using `GetAlert`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAlertRef, GetAlertVariables } from '@dataconnect/generated';

// The `GetAlert` query requires an argument of type `GetAlertVariables`:
const getAlertVars: GetAlertVariables = {
  id: ..., 
};

// Call the `getAlertRef()` function to get a reference to the query.
const ref = getAlertRef(getAlertVars);
// Variables can be defined inline as well.
const ref = getAlertRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAlertRef(dataConnect, getAlertVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.alert);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.alert);
});
```

## ListAlerts
You can execute the `ListAlerts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAlerts(options?: ExecuteQueryOptions): QueryPromise<ListAlertsData, undefined>;

interface ListAlertsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAlertsData, undefined>;
}
export const listAlertsRef: ListAlertsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAlerts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAlertsData, undefined>;

interface ListAlertsRef {
  ...
  (dc: DataConnect): QueryRef<ListAlertsData, undefined>;
}
export const listAlertsRef: ListAlertsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAlertsRef:
```typescript
const name = listAlertsRef.operationName;
console.log(name);
```

### Variables
The `ListAlerts` query has no variables.
### Return Type
Recall that executing the `ListAlerts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAlertsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAlertsData {
  alerts: ({
    triggerReason: string;
    status: string;
  })[];
}
```
### Using `ListAlerts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAlerts } from '@dataconnect/generated';


// Call the `listAlerts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAlerts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAlerts(dataConnect);

console.log(data.alerts);

// Or, you can use the `Promise` API.
listAlerts().then((response) => {
  const data = response.data;
  console.log(data.alerts);
});
```

### Using `ListAlerts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAlertsRef } from '@dataconnect/generated';


// Call the `listAlertsRef()` function to get a reference to the query.
const ref = listAlertsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAlertsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.alerts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.alerts);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  fullName: string;
  email: string;
  role: string;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  fullName: ..., 
  email: ..., 
  role: ..., 
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ fullName: ..., email: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  fullName: ..., 
  email: ..., 
  role: ..., 
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ fullName: ..., email: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUser
You can execute the `UpdateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUser(vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUser(dc: DataConnect, vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  (dc: DataConnect, vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRef:
```typescript
const name = updateUserRef.operationName;
console.log(name);
```

### Variables
The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserVariables {
  fullName?: string | null;
}
```
### Return Type
Recall that executing the `UpdateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUser, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  fullName: ..., // optional
};

// Call the `updateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUser(updateUserVars);
// Variables can be defined inline as well.
const { data } = await updateUser({ fullName: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserVariables` argument.
const { data } = await updateUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUser(dataConnect, updateUserVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUser(updateUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRef, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  fullName: ..., // optional
};

// Call the `updateUserRef()` function to get a reference to the mutation.
const ref = updateUserRef(updateUserVars);
// Variables can be defined inline as well.
const ref = updateUserRef({ fullName: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserVariables` argument.
const ref = updateUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRef(dataConnect, updateUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation has no variables.
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser } from '@dataconnect/generated';


// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser().then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef } from '@dataconnect/generated';


// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## CreatePatientProfile
You can execute the `CreatePatientProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPatientProfile(vars: CreatePatientProfileVariables): MutationPromise<CreatePatientProfileData, CreatePatientProfileVariables>;

interface CreatePatientProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePatientProfileVariables): MutationRef<CreatePatientProfileData, CreatePatientProfileVariables>;
}
export const createPatientProfileRef: CreatePatientProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPatientProfile(dc: DataConnect, vars: CreatePatientProfileVariables): MutationPromise<CreatePatientProfileData, CreatePatientProfileVariables>;

interface CreatePatientProfileRef {
  ...
  (dc: DataConnect, vars: CreatePatientProfileVariables): MutationRef<CreatePatientProfileData, CreatePatientProfileVariables>;
}
export const createPatientProfileRef: CreatePatientProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPatientProfileRef:
```typescript
const name = createPatientProfileRef.operationName;
console.log(name);
```

### Variables
The `CreatePatientProfile` mutation requires an argument of type `CreatePatientProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePatientProfileVariables {
  dateOfBirth: DateString;
}
```
### Return Type
Recall that executing the `CreatePatientProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePatientProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePatientProfileData {
  patientProfile_insert: PatientProfile_Key;
}
```
### Using `CreatePatientProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPatientProfile, CreatePatientProfileVariables } from '@dataconnect/generated';

// The `CreatePatientProfile` mutation requires an argument of type `CreatePatientProfileVariables`:
const createPatientProfileVars: CreatePatientProfileVariables = {
  dateOfBirth: ..., 
};

// Call the `createPatientProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPatientProfile(createPatientProfileVars);
// Variables can be defined inline as well.
const { data } = await createPatientProfile({ dateOfBirth: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPatientProfile(dataConnect, createPatientProfileVars);

console.log(data.patientProfile_insert);

// Or, you can use the `Promise` API.
createPatientProfile(createPatientProfileVars).then((response) => {
  const data = response.data;
  console.log(data.patientProfile_insert);
});
```

### Using `CreatePatientProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPatientProfileRef, CreatePatientProfileVariables } from '@dataconnect/generated';

// The `CreatePatientProfile` mutation requires an argument of type `CreatePatientProfileVariables`:
const createPatientProfileVars: CreatePatientProfileVariables = {
  dateOfBirth: ..., 
};

// Call the `createPatientProfileRef()` function to get a reference to the mutation.
const ref = createPatientProfileRef(createPatientProfileVars);
// Variables can be defined inline as well.
const ref = createPatientProfileRef({ dateOfBirth: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPatientProfileRef(dataConnect, createPatientProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.patientProfile_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.patientProfile_insert);
});
```

## UpdatePatientProfile
You can execute the `UpdatePatientProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updatePatientProfile(vars?: UpdatePatientProfileVariables): MutationPromise<UpdatePatientProfileData, UpdatePatientProfileVariables>;

interface UpdatePatientProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdatePatientProfileVariables): MutationRef<UpdatePatientProfileData, UpdatePatientProfileVariables>;
}
export const updatePatientProfileRef: UpdatePatientProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePatientProfile(dc: DataConnect, vars?: UpdatePatientProfileVariables): MutationPromise<UpdatePatientProfileData, UpdatePatientProfileVariables>;

interface UpdatePatientProfileRef {
  ...
  (dc: DataConnect, vars?: UpdatePatientProfileVariables): MutationRef<UpdatePatientProfileData, UpdatePatientProfileVariables>;
}
export const updatePatientProfileRef: UpdatePatientProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePatientProfileRef:
```typescript
const name = updatePatientProfileRef.operationName;
console.log(name);
```

### Variables
The `UpdatePatientProfile` mutation has an optional argument of type `UpdatePatientProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePatientProfileVariables {
  dateOfBirth?: DateString | null;
}
```
### Return Type
Recall that executing the `UpdatePatientProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePatientProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePatientProfileData {
  patientProfile_update?: PatientProfile_Key | null;
}
```
### Using `UpdatePatientProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePatientProfile, UpdatePatientProfileVariables } from '@dataconnect/generated';

// The `UpdatePatientProfile` mutation has an optional argument of type `UpdatePatientProfileVariables`:
const updatePatientProfileVars: UpdatePatientProfileVariables = {
  dateOfBirth: ..., // optional
};

// Call the `updatePatientProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePatientProfile(updatePatientProfileVars);
// Variables can be defined inline as well.
const { data } = await updatePatientProfile({ dateOfBirth: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdatePatientProfileVariables` argument.
const { data } = await updatePatientProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePatientProfile(dataConnect, updatePatientProfileVars);

console.log(data.patientProfile_update);

// Or, you can use the `Promise` API.
updatePatientProfile(updatePatientProfileVars).then((response) => {
  const data = response.data;
  console.log(data.patientProfile_update);
});
```

### Using `UpdatePatientProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePatientProfileRef, UpdatePatientProfileVariables } from '@dataconnect/generated';

// The `UpdatePatientProfile` mutation has an optional argument of type `UpdatePatientProfileVariables`:
const updatePatientProfileVars: UpdatePatientProfileVariables = {
  dateOfBirth: ..., // optional
};

// Call the `updatePatientProfileRef()` function to get a reference to the mutation.
const ref = updatePatientProfileRef(updatePatientProfileVars);
// Variables can be defined inline as well.
const ref = updatePatientProfileRef({ dateOfBirth: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdatePatientProfileVariables` argument.
const ref = updatePatientProfileRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePatientProfileRef(dataConnect, updatePatientProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.patientProfile_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.patientProfile_update);
});
```

## DeletePatientProfile
You can execute the `DeletePatientProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deletePatientProfile(): MutationPromise<DeletePatientProfileData, undefined>;

interface DeletePatientProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeletePatientProfileData, undefined>;
}
export const deletePatientProfileRef: DeletePatientProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deletePatientProfile(dc: DataConnect): MutationPromise<DeletePatientProfileData, undefined>;

interface DeletePatientProfileRef {
  ...
  (dc: DataConnect): MutationRef<DeletePatientProfileData, undefined>;
}
export const deletePatientProfileRef: DeletePatientProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePatientProfileRef:
```typescript
const name = deletePatientProfileRef.operationName;
console.log(name);
```

### Variables
The `DeletePatientProfile` mutation has no variables.
### Return Type
Recall that executing the `DeletePatientProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePatientProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePatientProfileData {
  patientProfile_delete?: PatientProfile_Key | null;
}
```
### Using `DeletePatientProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deletePatientProfile } from '@dataconnect/generated';


// Call the `deletePatientProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deletePatientProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deletePatientProfile(dataConnect);

console.log(data.patientProfile_delete);

// Or, you can use the `Promise` API.
deletePatientProfile().then((response) => {
  const data = response.data;
  console.log(data.patientProfile_delete);
});
```

### Using `DeletePatientProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePatientProfileRef } from '@dataconnect/generated';


// Call the `deletePatientProfileRef()` function to get a reference to the mutation.
const ref = deletePatientProfileRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePatientProfileRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.patientProfile_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.patientProfile_delete);
});
```

## CreateVitalReading
You can execute the `CreateVitalReading` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createVitalReading(vars: CreateVitalReadingVariables): MutationPromise<CreateVitalReadingData, CreateVitalReadingVariables>;

interface CreateVitalReadingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateVitalReadingVariables): MutationRef<CreateVitalReadingData, CreateVitalReadingVariables>;
}
export const createVitalReadingRef: CreateVitalReadingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createVitalReading(dc: DataConnect, vars: CreateVitalReadingVariables): MutationPromise<CreateVitalReadingData, CreateVitalReadingVariables>;

interface CreateVitalReadingRef {
  ...
  (dc: DataConnect, vars: CreateVitalReadingVariables): MutationRef<CreateVitalReadingData, CreateVitalReadingVariables>;
}
export const createVitalReadingRef: CreateVitalReadingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createVitalReadingRef:
```typescript
const name = createVitalReadingRef.operationName;
console.log(name);
```

### Variables
The `CreateVitalReading` mutation requires an argument of type `CreateVitalReadingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateVitalReadingVariables {
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  timestamp: TimestampString;
}
```
### Return Type
Recall that executing the `CreateVitalReading` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateVitalReadingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateVitalReadingData {
  vitalReading_insert: VitalReading_Key;
}
```
### Using `CreateVitalReading`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createVitalReading, CreateVitalReadingVariables } from '@dataconnect/generated';

// The `CreateVitalReading` mutation requires an argument of type `CreateVitalReadingVariables`:
const createVitalReadingVars: CreateVitalReadingVariables = {
  heartRate: ..., 
  systolicBP: ..., 
  diastolicBP: ..., 
  timestamp: ..., 
};

// Call the `createVitalReading()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createVitalReading(createVitalReadingVars);
// Variables can be defined inline as well.
const { data } = await createVitalReading({ heartRate: ..., systolicBP: ..., diastolicBP: ..., timestamp: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createVitalReading(dataConnect, createVitalReadingVars);

console.log(data.vitalReading_insert);

// Or, you can use the `Promise` API.
createVitalReading(createVitalReadingVars).then((response) => {
  const data = response.data;
  console.log(data.vitalReading_insert);
});
```

### Using `CreateVitalReading`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createVitalReadingRef, CreateVitalReadingVariables } from '@dataconnect/generated';

// The `CreateVitalReading` mutation requires an argument of type `CreateVitalReadingVariables`:
const createVitalReadingVars: CreateVitalReadingVariables = {
  heartRate: ..., 
  systolicBP: ..., 
  diastolicBP: ..., 
  timestamp: ..., 
};

// Call the `createVitalReadingRef()` function to get a reference to the mutation.
const ref = createVitalReadingRef(createVitalReadingVars);
// Variables can be defined inline as well.
const ref = createVitalReadingRef({ heartRate: ..., systolicBP: ..., diastolicBP: ..., timestamp: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createVitalReadingRef(dataConnect, createVitalReadingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vitalReading_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vitalReading_insert);
});
```

## UpdateVitalReading
You can execute the `UpdateVitalReading` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateVitalReading(vars: UpdateVitalReadingVariables): MutationPromise<UpdateVitalReadingData, UpdateVitalReadingVariables>;

interface UpdateVitalReadingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateVitalReadingVariables): MutationRef<UpdateVitalReadingData, UpdateVitalReadingVariables>;
}
export const updateVitalReadingRef: UpdateVitalReadingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateVitalReading(dc: DataConnect, vars: UpdateVitalReadingVariables): MutationPromise<UpdateVitalReadingData, UpdateVitalReadingVariables>;

interface UpdateVitalReadingRef {
  ...
  (dc: DataConnect, vars: UpdateVitalReadingVariables): MutationRef<UpdateVitalReadingData, UpdateVitalReadingVariables>;
}
export const updateVitalReadingRef: UpdateVitalReadingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateVitalReadingRef:
```typescript
const name = updateVitalReadingRef.operationName;
console.log(name);
```

### Variables
The `UpdateVitalReading` mutation requires an argument of type `UpdateVitalReadingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateVitalReadingVariables {
  id: UUIDString;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateVitalReading` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateVitalReadingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateVitalReadingData {
  vitalReading_update?: VitalReading_Key | null;
}
```
### Using `UpdateVitalReading`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateVitalReading, UpdateVitalReadingVariables } from '@dataconnect/generated';

// The `UpdateVitalReading` mutation requires an argument of type `UpdateVitalReadingVariables`:
const updateVitalReadingVars: UpdateVitalReadingVariables = {
  id: ..., 
  notes: ..., // optional
};

// Call the `updateVitalReading()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateVitalReading(updateVitalReadingVars);
// Variables can be defined inline as well.
const { data } = await updateVitalReading({ id: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateVitalReading(dataConnect, updateVitalReadingVars);

console.log(data.vitalReading_update);

// Or, you can use the `Promise` API.
updateVitalReading(updateVitalReadingVars).then((response) => {
  const data = response.data;
  console.log(data.vitalReading_update);
});
```

### Using `UpdateVitalReading`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateVitalReadingRef, UpdateVitalReadingVariables } from '@dataconnect/generated';

// The `UpdateVitalReading` mutation requires an argument of type `UpdateVitalReadingVariables`:
const updateVitalReadingVars: UpdateVitalReadingVariables = {
  id: ..., 
  notes: ..., // optional
};

// Call the `updateVitalReadingRef()` function to get a reference to the mutation.
const ref = updateVitalReadingRef(updateVitalReadingVars);
// Variables can be defined inline as well.
const ref = updateVitalReadingRef({ id: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateVitalReadingRef(dataConnect, updateVitalReadingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vitalReading_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vitalReading_update);
});
```

## DeleteVitalReading
You can execute the `DeleteVitalReading` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteVitalReading(vars: DeleteVitalReadingVariables): MutationPromise<DeleteVitalReadingData, DeleteVitalReadingVariables>;

interface DeleteVitalReadingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteVitalReadingVariables): MutationRef<DeleteVitalReadingData, DeleteVitalReadingVariables>;
}
export const deleteVitalReadingRef: DeleteVitalReadingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteVitalReading(dc: DataConnect, vars: DeleteVitalReadingVariables): MutationPromise<DeleteVitalReadingData, DeleteVitalReadingVariables>;

interface DeleteVitalReadingRef {
  ...
  (dc: DataConnect, vars: DeleteVitalReadingVariables): MutationRef<DeleteVitalReadingData, DeleteVitalReadingVariables>;
}
export const deleteVitalReadingRef: DeleteVitalReadingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteVitalReadingRef:
```typescript
const name = deleteVitalReadingRef.operationName;
console.log(name);
```

### Variables
The `DeleteVitalReading` mutation requires an argument of type `DeleteVitalReadingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteVitalReadingVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteVitalReading` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteVitalReadingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteVitalReadingData {
  vitalReading_delete?: VitalReading_Key | null;
}
```
### Using `DeleteVitalReading`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteVitalReading, DeleteVitalReadingVariables } from '@dataconnect/generated';

// The `DeleteVitalReading` mutation requires an argument of type `DeleteVitalReadingVariables`:
const deleteVitalReadingVars: DeleteVitalReadingVariables = {
  id: ..., 
};

// Call the `deleteVitalReading()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteVitalReading(deleteVitalReadingVars);
// Variables can be defined inline as well.
const { data } = await deleteVitalReading({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteVitalReading(dataConnect, deleteVitalReadingVars);

console.log(data.vitalReading_delete);

// Or, you can use the `Promise` API.
deleteVitalReading(deleteVitalReadingVars).then((response) => {
  const data = response.data;
  console.log(data.vitalReading_delete);
});
```

### Using `DeleteVitalReading`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteVitalReadingRef, DeleteVitalReadingVariables } from '@dataconnect/generated';

// The `DeleteVitalReading` mutation requires an argument of type `DeleteVitalReadingVariables`:
const deleteVitalReadingVars: DeleteVitalReadingVariables = {
  id: ..., 
};

// Call the `deleteVitalReadingRef()` function to get a reference to the mutation.
const ref = deleteVitalReadingRef(deleteVitalReadingVars);
// Variables can be defined inline as well.
const ref = deleteVitalReadingRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteVitalReadingRef(dataConnect, deleteVitalReadingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.vitalReading_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.vitalReading_delete);
});
```

## CreateAssignment
You can execute the `CreateAssignment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createAssignment(vars: CreateAssignmentVariables): MutationPromise<CreateAssignmentData, CreateAssignmentVariables>;

interface CreateAssignmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAssignmentVariables): MutationRef<CreateAssignmentData, CreateAssignmentVariables>;
}
export const createAssignmentRef: CreateAssignmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAssignment(dc: DataConnect, vars: CreateAssignmentVariables): MutationPromise<CreateAssignmentData, CreateAssignmentVariables>;

interface CreateAssignmentRef {
  ...
  (dc: DataConnect, vars: CreateAssignmentVariables): MutationRef<CreateAssignmentData, CreateAssignmentVariables>;
}
export const createAssignmentRef: CreateAssignmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAssignmentRef:
```typescript
const name = createAssignmentRef.operationName;
console.log(name);
```

### Variables
The `CreateAssignment` mutation requires an argument of type `CreateAssignmentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAssignmentVariables {
  patientId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateAssignment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAssignmentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAssignmentData {
  doctorPatientAssignment_insert: DoctorPatientAssignment_Key;
}
```
### Using `CreateAssignment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAssignment, CreateAssignmentVariables } from '@dataconnect/generated';

// The `CreateAssignment` mutation requires an argument of type `CreateAssignmentVariables`:
const createAssignmentVars: CreateAssignmentVariables = {
  patientId: ..., 
};

// Call the `createAssignment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAssignment(createAssignmentVars);
// Variables can be defined inline as well.
const { data } = await createAssignment({ patientId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAssignment(dataConnect, createAssignmentVars);

console.log(data.doctorPatientAssignment_insert);

// Or, you can use the `Promise` API.
createAssignment(createAssignmentVars).then((response) => {
  const data = response.data;
  console.log(data.doctorPatientAssignment_insert);
});
```

### Using `CreateAssignment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAssignmentRef, CreateAssignmentVariables } from '@dataconnect/generated';

// The `CreateAssignment` mutation requires an argument of type `CreateAssignmentVariables`:
const createAssignmentVars: CreateAssignmentVariables = {
  patientId: ..., 
};

// Call the `createAssignmentRef()` function to get a reference to the mutation.
const ref = createAssignmentRef(createAssignmentVars);
// Variables can be defined inline as well.
const ref = createAssignmentRef({ patientId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAssignmentRef(dataConnect, createAssignmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.doctorPatientAssignment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.doctorPatientAssignment_insert);
});
```

## UpdateAssignment
You can execute the `UpdateAssignment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateAssignment(vars: UpdateAssignmentVariables): MutationPromise<UpdateAssignmentData, UpdateAssignmentVariables>;

interface UpdateAssignmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAssignmentVariables): MutationRef<UpdateAssignmentData, UpdateAssignmentVariables>;
}
export const updateAssignmentRef: UpdateAssignmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAssignment(dc: DataConnect, vars: UpdateAssignmentVariables): MutationPromise<UpdateAssignmentData, UpdateAssignmentVariables>;

interface UpdateAssignmentRef {
  ...
  (dc: DataConnect, vars: UpdateAssignmentVariables): MutationRef<UpdateAssignmentData, UpdateAssignmentVariables>;
}
export const updateAssignmentRef: UpdateAssignmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAssignmentRef:
```typescript
const name = updateAssignmentRef.operationName;
console.log(name);
```

### Variables
The `UpdateAssignment` mutation requires an argument of type `UpdateAssignmentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAssignmentVariables {
  id: UUIDString;
  customThresholds?: string | null;
}
```
### Return Type
Recall that executing the `UpdateAssignment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAssignmentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAssignmentData {
  doctorPatientAssignment_update?: DoctorPatientAssignment_Key | null;
}
```
### Using `UpdateAssignment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAssignment, UpdateAssignmentVariables } from '@dataconnect/generated';

// The `UpdateAssignment` mutation requires an argument of type `UpdateAssignmentVariables`:
const updateAssignmentVars: UpdateAssignmentVariables = {
  id: ..., 
  customThresholds: ..., // optional
};

// Call the `updateAssignment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAssignment(updateAssignmentVars);
// Variables can be defined inline as well.
const { data } = await updateAssignment({ id: ..., customThresholds: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAssignment(dataConnect, updateAssignmentVars);

console.log(data.doctorPatientAssignment_update);

// Or, you can use the `Promise` API.
updateAssignment(updateAssignmentVars).then((response) => {
  const data = response.data;
  console.log(data.doctorPatientAssignment_update);
});
```

### Using `UpdateAssignment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAssignmentRef, UpdateAssignmentVariables } from '@dataconnect/generated';

// The `UpdateAssignment` mutation requires an argument of type `UpdateAssignmentVariables`:
const updateAssignmentVars: UpdateAssignmentVariables = {
  id: ..., 
  customThresholds: ..., // optional
};

// Call the `updateAssignmentRef()` function to get a reference to the mutation.
const ref = updateAssignmentRef(updateAssignmentVars);
// Variables can be defined inline as well.
const ref = updateAssignmentRef({ id: ..., customThresholds: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAssignmentRef(dataConnect, updateAssignmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.doctorPatientAssignment_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.doctorPatientAssignment_update);
});
```

## DeleteAssignment
You can execute the `DeleteAssignment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteAssignment(vars: DeleteAssignmentVariables): MutationPromise<DeleteAssignmentData, DeleteAssignmentVariables>;

interface DeleteAssignmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAssignmentVariables): MutationRef<DeleteAssignmentData, DeleteAssignmentVariables>;
}
export const deleteAssignmentRef: DeleteAssignmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAssignment(dc: DataConnect, vars: DeleteAssignmentVariables): MutationPromise<DeleteAssignmentData, DeleteAssignmentVariables>;

interface DeleteAssignmentRef {
  ...
  (dc: DataConnect, vars: DeleteAssignmentVariables): MutationRef<DeleteAssignmentData, DeleteAssignmentVariables>;
}
export const deleteAssignmentRef: DeleteAssignmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAssignmentRef:
```typescript
const name = deleteAssignmentRef.operationName;
console.log(name);
```

### Variables
The `DeleteAssignment` mutation requires an argument of type `DeleteAssignmentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAssignmentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteAssignment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAssignmentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAssignmentData {
  doctorPatientAssignment_delete?: DoctorPatientAssignment_Key | null;
}
```
### Using `DeleteAssignment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAssignment, DeleteAssignmentVariables } from '@dataconnect/generated';

// The `DeleteAssignment` mutation requires an argument of type `DeleteAssignmentVariables`:
const deleteAssignmentVars: DeleteAssignmentVariables = {
  id: ..., 
};

// Call the `deleteAssignment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAssignment(deleteAssignmentVars);
// Variables can be defined inline as well.
const { data } = await deleteAssignment({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAssignment(dataConnect, deleteAssignmentVars);

console.log(data.doctorPatientAssignment_delete);

// Or, you can use the `Promise` API.
deleteAssignment(deleteAssignmentVars).then((response) => {
  const data = response.data;
  console.log(data.doctorPatientAssignment_delete);
});
```

### Using `DeleteAssignment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAssignmentRef, DeleteAssignmentVariables } from '@dataconnect/generated';

// The `DeleteAssignment` mutation requires an argument of type `DeleteAssignmentVariables`:
const deleteAssignmentVars: DeleteAssignmentVariables = {
  id: ..., 
};

// Call the `deleteAssignmentRef()` function to get a reference to the mutation.
const ref = deleteAssignmentRef(deleteAssignmentVars);
// Variables can be defined inline as well.
const ref = deleteAssignmentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAssignmentRef(dataConnect, deleteAssignmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.doctorPatientAssignment_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.doctorPatientAssignment_delete);
});
```

## CreateAlert
You can execute the `CreateAlert` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createAlert(vars: CreateAlertVariables): MutationPromise<CreateAlertData, CreateAlertVariables>;

interface CreateAlertRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAlertVariables): MutationRef<CreateAlertData, CreateAlertVariables>;
}
export const createAlertRef: CreateAlertRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAlert(dc: DataConnect, vars: CreateAlertVariables): MutationPromise<CreateAlertData, CreateAlertVariables>;

interface CreateAlertRef {
  ...
  (dc: DataConnect, vars: CreateAlertVariables): MutationRef<CreateAlertData, CreateAlertVariables>;
}
export const createAlertRef: CreateAlertRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAlertRef:
```typescript
const name = createAlertRef.operationName;
console.log(name);
```

### Variables
The `CreateAlert` mutation requires an argument of type `CreateAlertVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAlertVariables {
  patientId: UUIDString;
  triggerReason: string;
  severity: string;
}
```
### Return Type
Recall that executing the `CreateAlert` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAlertData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAlertData {
  alert_insert: Alert_Key;
}
```
### Using `CreateAlert`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAlert, CreateAlertVariables } from '@dataconnect/generated';

// The `CreateAlert` mutation requires an argument of type `CreateAlertVariables`:
const createAlertVars: CreateAlertVariables = {
  patientId: ..., 
  triggerReason: ..., 
  severity: ..., 
};

// Call the `createAlert()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAlert(createAlertVars);
// Variables can be defined inline as well.
const { data } = await createAlert({ patientId: ..., triggerReason: ..., severity: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAlert(dataConnect, createAlertVars);

console.log(data.alert_insert);

// Or, you can use the `Promise` API.
createAlert(createAlertVars).then((response) => {
  const data = response.data;
  console.log(data.alert_insert);
});
```

### Using `CreateAlert`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAlertRef, CreateAlertVariables } from '@dataconnect/generated';

// The `CreateAlert` mutation requires an argument of type `CreateAlertVariables`:
const createAlertVars: CreateAlertVariables = {
  patientId: ..., 
  triggerReason: ..., 
  severity: ..., 
};

// Call the `createAlertRef()` function to get a reference to the mutation.
const ref = createAlertRef(createAlertVars);
// Variables can be defined inline as well.
const ref = createAlertRef({ patientId: ..., triggerReason: ..., severity: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAlertRef(dataConnect, createAlertVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.alert_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.alert_insert);
});
```

## UpdateAlert
You can execute the `UpdateAlert` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateAlert(vars: UpdateAlertVariables): MutationPromise<UpdateAlertData, UpdateAlertVariables>;

interface UpdateAlertRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAlertVariables): MutationRef<UpdateAlertData, UpdateAlertVariables>;
}
export const updateAlertRef: UpdateAlertRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAlert(dc: DataConnect, vars: UpdateAlertVariables): MutationPromise<UpdateAlertData, UpdateAlertVariables>;

interface UpdateAlertRef {
  ...
  (dc: DataConnect, vars: UpdateAlertVariables): MutationRef<UpdateAlertData, UpdateAlertVariables>;
}
export const updateAlertRef: UpdateAlertRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAlertRef:
```typescript
const name = updateAlertRef.operationName;
console.log(name);
```

### Variables
The `UpdateAlert` mutation requires an argument of type `UpdateAlertVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAlertVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateAlert` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAlertData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAlertData {
  alert_update?: Alert_Key | null;
}
```
### Using `UpdateAlert`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAlert, UpdateAlertVariables } from '@dataconnect/generated';

// The `UpdateAlert` mutation requires an argument of type `UpdateAlertVariables`:
const updateAlertVars: UpdateAlertVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateAlert()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAlert(updateAlertVars);
// Variables can be defined inline as well.
const { data } = await updateAlert({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAlert(dataConnect, updateAlertVars);

console.log(data.alert_update);

// Or, you can use the `Promise` API.
updateAlert(updateAlertVars).then((response) => {
  const data = response.data;
  console.log(data.alert_update);
});
```

### Using `UpdateAlert`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAlertRef, UpdateAlertVariables } from '@dataconnect/generated';

// The `UpdateAlert` mutation requires an argument of type `UpdateAlertVariables`:
const updateAlertVars: UpdateAlertVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateAlertRef()` function to get a reference to the mutation.
const ref = updateAlertRef(updateAlertVars);
// Variables can be defined inline as well.
const ref = updateAlertRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAlertRef(dataConnect, updateAlertVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.alert_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.alert_update);
});
```

## DeleteAlert
You can execute the `DeleteAlert` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteAlert(vars: DeleteAlertVariables): MutationPromise<DeleteAlertData, DeleteAlertVariables>;

interface DeleteAlertRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAlertVariables): MutationRef<DeleteAlertData, DeleteAlertVariables>;
}
export const deleteAlertRef: DeleteAlertRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAlert(dc: DataConnect, vars: DeleteAlertVariables): MutationPromise<DeleteAlertData, DeleteAlertVariables>;

interface DeleteAlertRef {
  ...
  (dc: DataConnect, vars: DeleteAlertVariables): MutationRef<DeleteAlertData, DeleteAlertVariables>;
}
export const deleteAlertRef: DeleteAlertRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAlertRef:
```typescript
const name = deleteAlertRef.operationName;
console.log(name);
```

### Variables
The `DeleteAlert` mutation requires an argument of type `DeleteAlertVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAlertVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteAlert` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAlertData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAlertData {
  alert_delete?: Alert_Key | null;
}
```
### Using `DeleteAlert`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAlert, DeleteAlertVariables } from '@dataconnect/generated';

// The `DeleteAlert` mutation requires an argument of type `DeleteAlertVariables`:
const deleteAlertVars: DeleteAlertVariables = {
  id: ..., 
};

// Call the `deleteAlert()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAlert(deleteAlertVars);
// Variables can be defined inline as well.
const { data } = await deleteAlert({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAlert(dataConnect, deleteAlertVars);

console.log(data.alert_delete);

// Or, you can use the `Promise` API.
deleteAlert(deleteAlertVars).then((response) => {
  const data = response.data;
  console.log(data.alert_delete);
});
```

### Using `DeleteAlert`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAlertRef, DeleteAlertVariables } from '@dataconnect/generated';

// The `DeleteAlert` mutation requires an argument of type `DeleteAlertVariables`:
const deleteAlertVars: DeleteAlertVariables = {
  id: ..., 
};

// Call the `deleteAlertRef()` function to get a reference to the mutation.
const ref = deleteAlertRef(deleteAlertVars);
// Variables can be defined inline as well.
const ref = deleteAlertRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAlertRef(dataConnect, deleteAlertVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.alert_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.alert_delete);
});
```

