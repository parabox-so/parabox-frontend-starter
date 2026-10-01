export type ModalEventType =
  | 'UPGRADE_REQUIRED'
  | 'CREATE_WORKSPACE'
  | 'CONFIRM_ACTION'
  | 'CUSTOM_MODAL'
  | 'CLOSE_MODAL';

export interface UpgradeModalPayload {
  feature?: string;
  requiredTier?: string;
  message?: string;
}

export interface ConfirmModalPayload {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

export interface CustomModalPayload {
  id: string;
  title?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
}

export type ModalPayloadMap = {
  UPGRADE_REQUIRED: UpgradeModalPayload;
  CREATE_WORKSPACE: { defaultName?: string };
  CONFIRM_ACTION: ConfirmModalPayload;
  CUSTOM_MODAL: CustomModalPayload;
  CLOSE_MODAL: { id?: string } | undefined;
};

type ModalListener<T extends ModalEventType> = (payload: ModalPayloadMap[T]) => void;

class ModalBus {
  private listeners: Map<ModalEventType, Set<ModalListener<any>>> = new Map();

  public on<T extends ModalEventType>(event: T, listener: ModalListener<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const set = this.listeners.get(event)!;
    set.add(listener);

    return () => {
      set.delete(listener);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  public emit<T extends ModalEventType>(event: T, payload: ModalPayloadMap[T]): void {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((listener) => {
        try {
          listener(payload);
        } catch (err) {
          console.error(`Error in ModalBus handler for \${event}:`, err);
        }
      });
    }
  }
}

export const modalBus = new ModalBus();
