import { Injectable, ComponentRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export interface ModalConfig {
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  disableClose?: boolean;
  panelClass?: string | string[];
  hasBackdrop?: boolean;
  backdropClass?: string;
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog) { }

  /**
   * Mở modal với component được truyền vào
   * @param component Component cần hiển thị trong modal
   * @param data Dữ liệu truyền vào component
   * @param config Cấu hình modal (width, height, etc.)
   * @returns Observable chứa kết quả từ modal
   */
  open<T, R = any>(
    component: any,
    data?: T,
    config?: ModalConfig
  ): Observable<R | undefined> {
    const defaultConfig: ModalConfig = {
      width: '500px',
      height: 'auto',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: false,
      panelClass: 'custom-modal',
      hasBackdrop: true,
      backdropClass: 'modal-backdrop'
    };

    const finalConfig = { ...defaultConfig, ...config };

    const dialogRef: MatDialogRef<any, R> = this.dialog.open(component, {
      width: finalConfig.width,
      height: finalConfig.height,
      maxWidth: finalConfig.maxWidth,
      maxHeight: finalConfig.maxHeight,
      disableClose: finalConfig.disableClose,
      panelClass: finalConfig.panelClass,
      hasBackdrop: finalConfig.hasBackdrop,
      backdropClass: finalConfig.backdropClass,
      position: finalConfig.position,
      data: data
    });

    return dialogRef.afterClosed();
  }

  /**
   * Kiểm tra có modal nào đang mở không
   * @returns boolean
   */
  hasOpenDialogs(): boolean {
    return this.dialog.openDialogs.length > 0;
  }

  /**
   * Lấy danh sách các modal đang mở
   * @returns MatDialogRef[]
   */
  getOpenDialogs(): MatDialogRef<any>[] {
    return this.dialog.openDialogs;
  }

  /**
   * Đóng modal cuối cùng được mở
   * @param result Kết quả trả về
   */
  closeLastDialog(result?: any): void {
    const openDialogs = this.dialog.openDialogs;
    if (openDialogs.length > 0) {
      openDialogs[openDialogs.length - 1].close(result);
    }
  }

  /**
   * Đóng tất cả modal đang mở
   */
  closeAll(): void {
    this.dialog.closeAll();
  }
}
