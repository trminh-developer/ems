import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Alert_Key {
  id: UUIDString;
  __typename?: 'Alert_Key';
}

export interface CreateAlertData {
  alert_insert: Alert_Key;
}

export interface CreateAlertVariables {
  patientId: UUIDString;
  triggerReason: string;
  severity: string;
}

export interface CreateAssignmentData {
  doctorPatientAssignment_insert: DoctorPatientAssignment_Key;
}

export interface CreateAssignmentVariables {
  patientId: UUIDString;
}

export interface CreatePatientProfileData {
  patientProfile_insert: PatientProfile_Key;
}

export interface CreatePatientProfileVariables {
  dateOfBirth: DateString;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  fullName: string;
  email: string;
  role: string;
}

export interface CreateVitalReadingData {
  vitalReading_insert: VitalReading_Key;
}

export interface CreateVitalReadingVariables {
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  timestamp: TimestampString;
}

export interface DeleteAlertData {
  alert_delete?: Alert_Key | null;
}

export interface DeleteAlertVariables {
  id: UUIDString;
}

export interface DeleteAssignmentData {
  doctorPatientAssignment_delete?: DoctorPatientAssignment_Key | null;
}

export interface DeleteAssignmentVariables {
  id: UUIDString;
}

export interface DeletePatientProfileData {
  patientProfile_delete?: PatientProfile_Key | null;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface DeleteVitalReadingData {
  vitalReading_delete?: VitalReading_Key | null;
}

export interface DeleteVitalReadingVariables {
  id: UUIDString;
}

export interface DoctorPatientAssignment_Key {
  id: UUIDString;
  __typename?: 'DoctorPatientAssignment_Key';
}

export interface GetAlertData {
  alert?: {
    triggerReason: string;
    severity: string;
  };
}

export interface GetAlertVariables {
  id: UUIDString;
}

export interface GetAssignmentData {
  doctorPatientAssignment?: {
    patient: {
      fullName: string;
    };
  };
}

export interface GetAssignmentVariables {
  id: UUIDString;
}

export interface GetMyPatientProfileData {
  patientProfile?: {
    dateOfBirth: DateString;
    currentMedications?: string | null;
  };
}

export interface GetUserData {
  user?: {
    id: UUIDString;
    fullName: string;
    email: string;
  } & User_Key;
}

export interface GetVitalReadingData {
  vitalReading?: {
    heartRate: number;
    systolicBP: number;
  };
}

export interface GetVitalReadingVariables {
  id: UUIDString;
}

export interface ListAlertsData {
  alerts: ({
    triggerReason: string;
    status: string;
  })[];
}

export interface ListMyAssignmentsData {
  doctorPatientAssignments: ({
    patient: {
      fullName: string;
    };
  })[];
}

export interface ListMyVitalReadingsData {
  vitalReadings: ({
    timestamp: TimestampString;
    heartRate: number;
  })[];
}

export interface ListPatientProfilesData {
  patientProfiles: ({
    id: UUIDString;
    user: {
      fullName: string;
    };
  } & PatientProfile_Key)[];
}

export interface ListUsersData {
  users: ({
    id: UUIDString;
    fullName: string;
    role: string;
  } & User_Key)[];
}

export interface PatientProfile_Key {
  id: UUIDString;
  __typename?: 'PatientProfile_Key';
}

export interface UpdateAlertData {
  alert_update?: Alert_Key | null;
}

export interface UpdateAlertVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateAssignmentData {
  doctorPatientAssignment_update?: DoctorPatientAssignment_Key | null;
}

export interface UpdateAssignmentVariables {
  id: UUIDString;
  customThresholds?: string | null;
}

export interface UpdatePatientProfileData {
  patientProfile_update?: PatientProfile_Key | null;
}

export interface UpdatePatientProfileVariables {
  dateOfBirth?: DateString | null;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface UpdateUserVariables {
  fullName?: string | null;
}

export interface UpdateVitalReadingData {
  vitalReading_update?: VitalReading_Key | null;
}

export interface UpdateVitalReadingVariables {
  id: UUIDString;
  notes?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface VitalReading_Key {
  id: UUIDString;
  __typename?: 'VitalReading_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;
export function updateUser(dc: DataConnect, vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(): MutationPromise<DeleteUserData, undefined>;
export function deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;
export function getUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetUserData, undefined>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface CreatePatientProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePatientProfileVariables): MutationRef<CreatePatientProfileData, CreatePatientProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePatientProfileVariables): MutationRef<CreatePatientProfileData, CreatePatientProfileVariables>;
  operationName: string;
}
export const createPatientProfileRef: CreatePatientProfileRef;

export function createPatientProfile(vars: CreatePatientProfileVariables): MutationPromise<CreatePatientProfileData, CreatePatientProfileVariables>;
export function createPatientProfile(dc: DataConnect, vars: CreatePatientProfileVariables): MutationPromise<CreatePatientProfileData, CreatePatientProfileVariables>;

interface UpdatePatientProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdatePatientProfileVariables): MutationRef<UpdatePatientProfileData, UpdatePatientProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdatePatientProfileVariables): MutationRef<UpdatePatientProfileData, UpdatePatientProfileVariables>;
  operationName: string;
}
export const updatePatientProfileRef: UpdatePatientProfileRef;

export function updatePatientProfile(vars?: UpdatePatientProfileVariables): MutationPromise<UpdatePatientProfileData, UpdatePatientProfileVariables>;
export function updatePatientProfile(dc: DataConnect, vars?: UpdatePatientProfileVariables): MutationPromise<UpdatePatientProfileData, UpdatePatientProfileVariables>;

interface DeletePatientProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeletePatientProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeletePatientProfileData, undefined>;
  operationName: string;
}
export const deletePatientProfileRef: DeletePatientProfileRef;

export function deletePatientProfile(): MutationPromise<DeletePatientProfileData, undefined>;
export function deletePatientProfile(dc: DataConnect): MutationPromise<DeletePatientProfileData, undefined>;

interface GetMyPatientProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyPatientProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyPatientProfileData, undefined>;
  operationName: string;
}
export const getMyPatientProfileRef: GetMyPatientProfileRef;

export function getMyPatientProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyPatientProfileData, undefined>;
export function getMyPatientProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyPatientProfileData, undefined>;

interface ListPatientProfilesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPatientProfilesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPatientProfilesData, undefined>;
  operationName: string;
}
export const listPatientProfilesRef: ListPatientProfilesRef;

export function listPatientProfiles(options?: ExecuteQueryOptions): QueryPromise<ListPatientProfilesData, undefined>;
export function listPatientProfiles(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPatientProfilesData, undefined>;

interface CreateVitalReadingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateVitalReadingVariables): MutationRef<CreateVitalReadingData, CreateVitalReadingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateVitalReadingVariables): MutationRef<CreateVitalReadingData, CreateVitalReadingVariables>;
  operationName: string;
}
export const createVitalReadingRef: CreateVitalReadingRef;

export function createVitalReading(vars: CreateVitalReadingVariables): MutationPromise<CreateVitalReadingData, CreateVitalReadingVariables>;
export function createVitalReading(dc: DataConnect, vars: CreateVitalReadingVariables): MutationPromise<CreateVitalReadingData, CreateVitalReadingVariables>;

interface UpdateVitalReadingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateVitalReadingVariables): MutationRef<UpdateVitalReadingData, UpdateVitalReadingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateVitalReadingVariables): MutationRef<UpdateVitalReadingData, UpdateVitalReadingVariables>;
  operationName: string;
}
export const updateVitalReadingRef: UpdateVitalReadingRef;

export function updateVitalReading(vars: UpdateVitalReadingVariables): MutationPromise<UpdateVitalReadingData, UpdateVitalReadingVariables>;
export function updateVitalReading(dc: DataConnect, vars: UpdateVitalReadingVariables): MutationPromise<UpdateVitalReadingData, UpdateVitalReadingVariables>;

interface DeleteVitalReadingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteVitalReadingVariables): MutationRef<DeleteVitalReadingData, DeleteVitalReadingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteVitalReadingVariables): MutationRef<DeleteVitalReadingData, DeleteVitalReadingVariables>;
  operationName: string;
}
export const deleteVitalReadingRef: DeleteVitalReadingRef;

export function deleteVitalReading(vars: DeleteVitalReadingVariables): MutationPromise<DeleteVitalReadingData, DeleteVitalReadingVariables>;
export function deleteVitalReading(dc: DataConnect, vars: DeleteVitalReadingVariables): MutationPromise<DeleteVitalReadingData, DeleteVitalReadingVariables>;

interface GetVitalReadingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVitalReadingVariables): QueryRef<GetVitalReadingData, GetVitalReadingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetVitalReadingVariables): QueryRef<GetVitalReadingData, GetVitalReadingVariables>;
  operationName: string;
}
export const getVitalReadingRef: GetVitalReadingRef;

export function getVitalReading(vars: GetVitalReadingVariables, options?: ExecuteQueryOptions): QueryPromise<GetVitalReadingData, GetVitalReadingVariables>;
export function getVitalReading(dc: DataConnect, vars: GetVitalReadingVariables, options?: ExecuteQueryOptions): QueryPromise<GetVitalReadingData, GetVitalReadingVariables>;

interface ListMyVitalReadingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyVitalReadingsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyVitalReadingsData, undefined>;
  operationName: string;
}
export const listMyVitalReadingsRef: ListMyVitalReadingsRef;

export function listMyVitalReadings(options?: ExecuteQueryOptions): QueryPromise<ListMyVitalReadingsData, undefined>;
export function listMyVitalReadings(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyVitalReadingsData, undefined>;

interface CreateAssignmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAssignmentVariables): MutationRef<CreateAssignmentData, CreateAssignmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAssignmentVariables): MutationRef<CreateAssignmentData, CreateAssignmentVariables>;
  operationName: string;
}
export const createAssignmentRef: CreateAssignmentRef;

export function createAssignment(vars: CreateAssignmentVariables): MutationPromise<CreateAssignmentData, CreateAssignmentVariables>;
export function createAssignment(dc: DataConnect, vars: CreateAssignmentVariables): MutationPromise<CreateAssignmentData, CreateAssignmentVariables>;

interface UpdateAssignmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAssignmentVariables): MutationRef<UpdateAssignmentData, UpdateAssignmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAssignmentVariables): MutationRef<UpdateAssignmentData, UpdateAssignmentVariables>;
  operationName: string;
}
export const updateAssignmentRef: UpdateAssignmentRef;

export function updateAssignment(vars: UpdateAssignmentVariables): MutationPromise<UpdateAssignmentData, UpdateAssignmentVariables>;
export function updateAssignment(dc: DataConnect, vars: UpdateAssignmentVariables): MutationPromise<UpdateAssignmentData, UpdateAssignmentVariables>;

interface DeleteAssignmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAssignmentVariables): MutationRef<DeleteAssignmentData, DeleteAssignmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAssignmentVariables): MutationRef<DeleteAssignmentData, DeleteAssignmentVariables>;
  operationName: string;
}
export const deleteAssignmentRef: DeleteAssignmentRef;

export function deleteAssignment(vars: DeleteAssignmentVariables): MutationPromise<DeleteAssignmentData, DeleteAssignmentVariables>;
export function deleteAssignment(dc: DataConnect, vars: DeleteAssignmentVariables): MutationPromise<DeleteAssignmentData, DeleteAssignmentVariables>;

interface GetAssignmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAssignmentVariables): QueryRef<GetAssignmentData, GetAssignmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAssignmentVariables): QueryRef<GetAssignmentData, GetAssignmentVariables>;
  operationName: string;
}
export const getAssignmentRef: GetAssignmentRef;

export function getAssignment(vars: GetAssignmentVariables, options?: ExecuteQueryOptions): QueryPromise<GetAssignmentData, GetAssignmentVariables>;
export function getAssignment(dc: DataConnect, vars: GetAssignmentVariables, options?: ExecuteQueryOptions): QueryPromise<GetAssignmentData, GetAssignmentVariables>;

interface ListMyAssignmentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyAssignmentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyAssignmentsData, undefined>;
  operationName: string;
}
export const listMyAssignmentsRef: ListMyAssignmentsRef;

export function listMyAssignments(options?: ExecuteQueryOptions): QueryPromise<ListMyAssignmentsData, undefined>;
export function listMyAssignments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyAssignmentsData, undefined>;

interface CreateAlertRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAlertVariables): MutationRef<CreateAlertData, CreateAlertVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAlertVariables): MutationRef<CreateAlertData, CreateAlertVariables>;
  operationName: string;
}
export const createAlertRef: CreateAlertRef;

export function createAlert(vars: CreateAlertVariables): MutationPromise<CreateAlertData, CreateAlertVariables>;
export function createAlert(dc: DataConnect, vars: CreateAlertVariables): MutationPromise<CreateAlertData, CreateAlertVariables>;

interface UpdateAlertRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAlertVariables): MutationRef<UpdateAlertData, UpdateAlertVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAlertVariables): MutationRef<UpdateAlertData, UpdateAlertVariables>;
  operationName: string;
}
export const updateAlertRef: UpdateAlertRef;

export function updateAlert(vars: UpdateAlertVariables): MutationPromise<UpdateAlertData, UpdateAlertVariables>;
export function updateAlert(dc: DataConnect, vars: UpdateAlertVariables): MutationPromise<UpdateAlertData, UpdateAlertVariables>;

interface DeleteAlertRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAlertVariables): MutationRef<DeleteAlertData, DeleteAlertVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAlertVariables): MutationRef<DeleteAlertData, DeleteAlertVariables>;
  operationName: string;
}
export const deleteAlertRef: DeleteAlertRef;

export function deleteAlert(vars: DeleteAlertVariables): MutationPromise<DeleteAlertData, DeleteAlertVariables>;
export function deleteAlert(dc: DataConnect, vars: DeleteAlertVariables): MutationPromise<DeleteAlertData, DeleteAlertVariables>;

interface GetAlertRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAlertVariables): QueryRef<GetAlertData, GetAlertVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAlertVariables): QueryRef<GetAlertData, GetAlertVariables>;
  operationName: string;
}
export const getAlertRef: GetAlertRef;

export function getAlert(vars: GetAlertVariables, options?: ExecuteQueryOptions): QueryPromise<GetAlertData, GetAlertVariables>;
export function getAlert(dc: DataConnect, vars: GetAlertVariables, options?: ExecuteQueryOptions): QueryPromise<GetAlertData, GetAlertVariables>;

interface ListAlertsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAlertsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAlertsData, undefined>;
  operationName: string;
}
export const listAlertsRef: ListAlertsRef;

export function listAlerts(options?: ExecuteQueryOptions): QueryPromise<ListAlertsData, undefined>;
export function listAlerts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAlertsData, undefined>;

