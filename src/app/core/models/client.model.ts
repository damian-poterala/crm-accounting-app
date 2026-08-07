export interface Client {
    id           : number;
    company_type : string;
    company_name : string;
    first_name   : string;
    last_name    : string;
    nip          : string;
    regon        : string;
    krs          : string;
    pesel        : number;
    email        : string;
    phone        : string;
    is_vat_payer : number;
    is_active    : number;
    notes        : string;
    created_at   : string;
    updated_at   : string;
}