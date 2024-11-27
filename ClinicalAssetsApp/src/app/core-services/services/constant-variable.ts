export type ConstantVariable = {
    readonly DateFormat: string;
    readonly TicketCommentDate: string
    readonly MobileNoPattern: RegExp
    readonly SSNNoPattern: RegExp
    readonly SpaceInMobileNo: string
    readonly SSN: string
    readonly PhonePatternForValidator: RegExp
    readonly SSNPatternForValidator: RegExp
    readonly ChangeMobileToNumber: RegExp
    readonly ChangeSSNToNumber: RegExp
    readonly EmailPatternForValidator: RegExp
    readonly PassworrdPattern: RegExp
    readonly TimeFormat: string
};

const ConstantVariables: ConstantVariable = {
    DateFormat: "MMM dd yyyy",
    TicketCommentDate: "MMM dd yyyy hh:mm a",
    PhonePatternForValidator: /^\(\d{3}\)\s\d{3}-\d{4}$/,
    SSNPatternForValidator: /^\d{3}-\d{2}-\d{4}$/,
    EmailPatternForValidator: /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/,
    PassworrdPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#].{7,}$/,
    MobileNoPattern: /(\d{3})(\d{3})(\d{4})/, //this is used for transform no. from backend 
    SSNNoPattern: /(\d{3})(\d{2})(\d{4})/, //this is used for transform no. from backend 
    SpaceInMobileNo: "($1) $2-$3", // this is used for replace the no. with (),- 
    ChangeMobileToNumber: /[\(\)\s-]/g, // this is used for transform no. from frontend to send it to backend
    ChangeSSNToNumber: /[\s-]/g, // this is used for transform no. from frontend to send it to backend
    SSN: "$1-$2-$3", // this is used for replace the no. with (),- 
    TimeFormat: "hh:mm a"
};

const Date_FORMATS_IN_INPUT = {
    parse: {
        dateInput: 'MM/DD/YYYY',
    },
    display: {
        dateInput: 'MM/DD/YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
    }
}

export { ConstantVariables, Date_FORMATS_IN_INPUT };