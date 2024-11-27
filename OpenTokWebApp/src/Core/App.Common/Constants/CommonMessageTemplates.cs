namespace App.Common.Constants
{
    public static class CommonMessageTemplates
    {
        public const string Exists = "already exists.";
        public const string DoesNotExists = "does not exists.";
        public const string Found = "found.";
        public const string NotFound = "not found.";
        public const string AddedSuccessfully = "added succesfully.";
        public const string UpdatedSuccessfully = "updated succesfully.";
        public const string DeletedSuccessfully = "deleted successfully.";
        public const string AssignedSuccessfully = "assigned successfully.";
        public const string ActivatedSuccessfully = "activated succesfully.";
        public const string DeactivatedSuccessfully = "deactivated succesfully.";

        public const string Available = "available.";
        public const string NotAvailable = "not available.";

        // Technical Errors
        public const string SomethingWentWrong = "Something went wrong.";
        public const string InternalServerError = "Internal server error.";

        public const string SetPrimeToBill = "Appointment set to prime to bill";
    }

    public static class ConsentsStatus
    {
        public const string ConsentSubmitted = "Consent added successfully.";
        public const string GetConsents = "Consent get successfully.";
        public const string NoGuardianFound = "No guardians found for the given clientId.";
        public const string NoConsentsFound = "Consents not found";
        public const string GetConsentsStatus = "ConsentsStatus get successfully.";
    }

    public static class AppointmentStatus
    {
        public const string PENDING = "PENDING";
        public const string INPROGRESS = "IN PROGRESS";
        public const string COMPLETED = "COMPLETED";
        public const string CANCELLED = "CANCELLED";
        public const string REQUESTCANCELLED = "REQUESTCANCELLED";
        public const string SUBMITTED = "SUBMITTED";
        public const string APPROVED = "APPROVED";
        public const string DECLINED = "DECLINED";
        public const string INVOICED = "INVOICED";
        public const string AVAILABLE = "AVAILABLE";
    }

    public static class DocumentStatus
    {
        public const string InProgress = "In Progress";
        public const string Completed = "Completed";
        public const string ToDo = "To Do";
    }

    public static class ProgressNoteStatus
    {
        public const string InProgress = "In Progress";
        public const string Completed = "Completed";
        public const string Pending = "Pending";
        public const string CoSignature = "Co-Signature";
        public const string Rejected = "Rejected";
    }

    public static class ProgressNoteType
    {
        public const string DischargeNote = "Discharge Note";
        public const string MiscellaneousNote = "Miscellaneous Note";
        public const string LateCancellationNote = "Late Cancellation Note";
        public const string PsychiatricEvaluationNote = "Psychiatric Evaluation Note";
        public const string TreatmentNote = "Treatment Note";
        public const string TelephoneEncounterNote = "Telephone Encounter Note";
        public const string TherapyProgressNote = "Therapy Progress Note";
        public const string PsychiatricProgessNote = "Psychiatric Progess Note";
        public const string TherapyIntakeNote = "Therapy Intake Note";
    }

    public static class EncounterStatus
    {
        public const string PENDING = "PENDING";
        public const string COMPLETED = "COMPLETED";
        public const string CANCELLED = "CANCELLED";
    }

    public static class Insurencetype
    {
        public const string Primary = "Primary";
        public const string Secondary = "Secondary";
    }
    public static class GroupAppointmentAttendeesResponce
    {
        public const string Change = "Changes saved succesfully";
        public const string ErrorInUpdate = "Error while updating some records";
        public const string GroupOrAppointmentNotFound = "Group or Appointment not found";

        public const string GroupAttendanceSettingGroupNotFound = "Group not found";
        public const string GroupAttendanceAdded = "Group Added succesfully";
        public const string GroupAttendanceUpdated = "Group Updated succesfully";

        public const string GroupAttendanceSettingAttendanceNotFound = "Attendance setting not found";





    }

    public static class PendingRequestResponseMsg
    {
        public const string requestApproved = "Request Approved";

    }
}
