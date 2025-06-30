import { TemplateRef } from "@angular/core";

export interface Column {
  field: string;
  header: string;
  width?: string;
  maxWidth?: string;
  minWidth?: string;
  cellTemplate?: TemplateRef<any>;
  headerClass?: string;
  cellClass?: string;
  sortable?: boolean;
}