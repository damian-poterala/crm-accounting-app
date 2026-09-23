export interface ClientImportRow {
    id: number;
    company_type: string;
    company_name: string;
    first_name: string;
    last_name: string;
    nip: string;
    regon: string;
    krs: string;
    pesel: string;
    email: string;
    phone: string;
    is_vat_payer: boolean | null;
    cooperation_status: string;
    account_manager_id: number | null;
    notes: string;
    errors: {
        [key: string]: string
    },
    valid: boolean;
}