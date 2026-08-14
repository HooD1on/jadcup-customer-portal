export type QuotationStatus = 'pending-review' | 'quote-ready' | 'approved' | 'expired';

export interface Quotation {
  quotationNumber: string;
  productName: string;
  productCode: string;
  requestedQuantity: number;
  requestDate: string;
  status: QuotationStatus;
  pricePerCarton?: number;
  expiryDate?: string;
}

export const mockQuotations: Quotation[] = [
  {
    quotationNumber: 'QT-2026-001',
    productName: 'Fields Cafe 6oz Single-Wall Compostable Cup',
    productCode: 'SW6-Fields',
    requestedQuantity: 10,
    requestDate: '2026-08-14',
    status: 'pending-review',
  },
  {
    quotationNumber: 'QT-2026-002',
    productName: '16oz PET Clear Cup',
    productCode: 'PET16-CLEAR',
    requestedQuantity: 20,
    requestDate: '2026-08-12',
    status: 'quote-ready',
    pricePerCarton: 104,
    expiryDate: '2026-08-28',
  },
  {
    quotationNumber: 'QT-2026-003',
    productName: '12oz Double Wall Cup',
    productCode: 'DW12-CP',
    requestedQuantity: 5,
    requestDate: '2026-08-08',
    status: 'approved',
    pricePerCarton: 115,
  },
  {
    quotationNumber: 'QT-2026-004',
    productName: 'Custom Food Packaging',
    productCode: 'FP-CUSTOM',
    requestedQuantity: 15,
    requestDate: '2026-07-20',
    status: 'expired',
  },
];