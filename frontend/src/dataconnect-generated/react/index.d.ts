import { CreateUserData, CreateUserVariables, UpdateUserData, UpdateUserVariables, DeleteUserData, GetUserData, ListUsersData, CreatePatientProfileData, CreatePatientProfileVariables, UpdatePatientProfileData, UpdatePatientProfileVariables, DeletePatientProfileData, GetMyPatientProfileData, ListPatientProfilesData, CreateVitalReadingData, CreateVitalReadingVariables, UpdateVitalReadingData, UpdateVitalReadingVariables, DeleteVitalReadingData, DeleteVitalReadingVariables, GetVitalReadingData, GetVitalReadingVariables, ListMyVitalReadingsData, CreateAssignmentData, CreateAssignmentVariables, UpdateAssignmentData, UpdateAssignmentVariables, DeleteAssignmentData, DeleteAssignmentVariables, GetAssignmentData, GetAssignmentVariables, ListMyAssignmentsData, CreateAlertData, CreateAlertVariables, UpdateAlertData, UpdateAlertVariables, DeleteAlertData, DeleteAlertVariables, GetAlertData, GetAlertVariables, ListAlertsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useUpdateUser(options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables | void>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;
export function useUpdateUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables | void>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;

export function useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;
export function useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteUserData, undefined>;

export function useGetUser(options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;
export function useGetUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;

export function useListUsers(options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;
export function useListUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;

export function useCreatePatientProfile(options?: useDataConnectMutationOptions<CreatePatientProfileData, FirebaseError, CreatePatientProfileVariables>): UseDataConnectMutationResult<CreatePatientProfileData, CreatePatientProfileVariables>;
export function useCreatePatientProfile(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePatientProfileData, FirebaseError, CreatePatientProfileVariables>): UseDataConnectMutationResult<CreatePatientProfileData, CreatePatientProfileVariables>;

export function useUpdatePatientProfile(options?: useDataConnectMutationOptions<UpdatePatientProfileData, FirebaseError, UpdatePatientProfileVariables | void>): UseDataConnectMutationResult<UpdatePatientProfileData, UpdatePatientProfileVariables>;
export function useUpdatePatientProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpdatePatientProfileData, FirebaseError, UpdatePatientProfileVariables | void>): UseDataConnectMutationResult<UpdatePatientProfileData, UpdatePatientProfileVariables>;

export function useDeletePatientProfile(options?: useDataConnectMutationOptions<DeletePatientProfileData, FirebaseError, void>): UseDataConnectMutationResult<DeletePatientProfileData, undefined>;
export function useDeletePatientProfile(dc: DataConnect, options?: useDataConnectMutationOptions<DeletePatientProfileData, FirebaseError, void>): UseDataConnectMutationResult<DeletePatientProfileData, undefined>;

export function useGetMyPatientProfile(options?: useDataConnectQueryOptions<GetMyPatientProfileData>): UseDataConnectQueryResult<GetMyPatientProfileData, undefined>;
export function useGetMyPatientProfile(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyPatientProfileData>): UseDataConnectQueryResult<GetMyPatientProfileData, undefined>;

export function useListPatientProfiles(options?: useDataConnectQueryOptions<ListPatientProfilesData>): UseDataConnectQueryResult<ListPatientProfilesData, undefined>;
export function useListPatientProfiles(dc: DataConnect, options?: useDataConnectQueryOptions<ListPatientProfilesData>): UseDataConnectQueryResult<ListPatientProfilesData, undefined>;

export function useCreateVitalReading(options?: useDataConnectMutationOptions<CreateVitalReadingData, FirebaseError, CreateVitalReadingVariables>): UseDataConnectMutationResult<CreateVitalReadingData, CreateVitalReadingVariables>;
export function useCreateVitalReading(dc: DataConnect, options?: useDataConnectMutationOptions<CreateVitalReadingData, FirebaseError, CreateVitalReadingVariables>): UseDataConnectMutationResult<CreateVitalReadingData, CreateVitalReadingVariables>;

export function useUpdateVitalReading(options?: useDataConnectMutationOptions<UpdateVitalReadingData, FirebaseError, UpdateVitalReadingVariables>): UseDataConnectMutationResult<UpdateVitalReadingData, UpdateVitalReadingVariables>;
export function useUpdateVitalReading(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateVitalReadingData, FirebaseError, UpdateVitalReadingVariables>): UseDataConnectMutationResult<UpdateVitalReadingData, UpdateVitalReadingVariables>;

export function useDeleteVitalReading(options?: useDataConnectMutationOptions<DeleteVitalReadingData, FirebaseError, DeleteVitalReadingVariables>): UseDataConnectMutationResult<DeleteVitalReadingData, DeleteVitalReadingVariables>;
export function useDeleteVitalReading(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteVitalReadingData, FirebaseError, DeleteVitalReadingVariables>): UseDataConnectMutationResult<DeleteVitalReadingData, DeleteVitalReadingVariables>;

export function useGetVitalReading(vars: GetVitalReadingVariables, options?: useDataConnectQueryOptions<GetVitalReadingData>): UseDataConnectQueryResult<GetVitalReadingData, GetVitalReadingVariables>;
export function useGetVitalReading(dc: DataConnect, vars: GetVitalReadingVariables, options?: useDataConnectQueryOptions<GetVitalReadingData>): UseDataConnectQueryResult<GetVitalReadingData, GetVitalReadingVariables>;

export function useListMyVitalReadings(options?: useDataConnectQueryOptions<ListMyVitalReadingsData>): UseDataConnectQueryResult<ListMyVitalReadingsData, undefined>;
export function useListMyVitalReadings(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyVitalReadingsData>): UseDataConnectQueryResult<ListMyVitalReadingsData, undefined>;

export function useCreateAssignment(options?: useDataConnectMutationOptions<CreateAssignmentData, FirebaseError, CreateAssignmentVariables>): UseDataConnectMutationResult<CreateAssignmentData, CreateAssignmentVariables>;
export function useCreateAssignment(dc: DataConnect, options?: useDataConnectMutationOptions<CreateAssignmentData, FirebaseError, CreateAssignmentVariables>): UseDataConnectMutationResult<CreateAssignmentData, CreateAssignmentVariables>;

export function useUpdateAssignment(options?: useDataConnectMutationOptions<UpdateAssignmentData, FirebaseError, UpdateAssignmentVariables>): UseDataConnectMutationResult<UpdateAssignmentData, UpdateAssignmentVariables>;
export function useUpdateAssignment(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateAssignmentData, FirebaseError, UpdateAssignmentVariables>): UseDataConnectMutationResult<UpdateAssignmentData, UpdateAssignmentVariables>;

export function useDeleteAssignment(options?: useDataConnectMutationOptions<DeleteAssignmentData, FirebaseError, DeleteAssignmentVariables>): UseDataConnectMutationResult<DeleteAssignmentData, DeleteAssignmentVariables>;
export function useDeleteAssignment(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteAssignmentData, FirebaseError, DeleteAssignmentVariables>): UseDataConnectMutationResult<DeleteAssignmentData, DeleteAssignmentVariables>;

export function useGetAssignment(vars: GetAssignmentVariables, options?: useDataConnectQueryOptions<GetAssignmentData>): UseDataConnectQueryResult<GetAssignmentData, GetAssignmentVariables>;
export function useGetAssignment(dc: DataConnect, vars: GetAssignmentVariables, options?: useDataConnectQueryOptions<GetAssignmentData>): UseDataConnectQueryResult<GetAssignmentData, GetAssignmentVariables>;

export function useListMyAssignments(options?: useDataConnectQueryOptions<ListMyAssignmentsData>): UseDataConnectQueryResult<ListMyAssignmentsData, undefined>;
export function useListMyAssignments(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyAssignmentsData>): UseDataConnectQueryResult<ListMyAssignmentsData, undefined>;

export function useCreateAlert(options?: useDataConnectMutationOptions<CreateAlertData, FirebaseError, CreateAlertVariables>): UseDataConnectMutationResult<CreateAlertData, CreateAlertVariables>;
export function useCreateAlert(dc: DataConnect, options?: useDataConnectMutationOptions<CreateAlertData, FirebaseError, CreateAlertVariables>): UseDataConnectMutationResult<CreateAlertData, CreateAlertVariables>;

export function useUpdateAlert(options?: useDataConnectMutationOptions<UpdateAlertData, FirebaseError, UpdateAlertVariables>): UseDataConnectMutationResult<UpdateAlertData, UpdateAlertVariables>;
export function useUpdateAlert(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateAlertData, FirebaseError, UpdateAlertVariables>): UseDataConnectMutationResult<UpdateAlertData, UpdateAlertVariables>;

export function useDeleteAlert(options?: useDataConnectMutationOptions<DeleteAlertData, FirebaseError, DeleteAlertVariables>): UseDataConnectMutationResult<DeleteAlertData, DeleteAlertVariables>;
export function useDeleteAlert(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteAlertData, FirebaseError, DeleteAlertVariables>): UseDataConnectMutationResult<DeleteAlertData, DeleteAlertVariables>;

export function useGetAlert(vars: GetAlertVariables, options?: useDataConnectQueryOptions<GetAlertData>): UseDataConnectQueryResult<GetAlertData, GetAlertVariables>;
export function useGetAlert(dc: DataConnect, vars: GetAlertVariables, options?: useDataConnectQueryOptions<GetAlertData>): UseDataConnectQueryResult<GetAlertData, GetAlertVariables>;

export function useListAlerts(options?: useDataConnectQueryOptions<ListAlertsData>): UseDataConnectQueryResult<ListAlertsData, undefined>;
export function useListAlerts(dc: DataConnect, options?: useDataConnectQueryOptions<ListAlertsData>): UseDataConnectQueryResult<ListAlertsData, undefined>;
