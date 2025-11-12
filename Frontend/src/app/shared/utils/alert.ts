import Swal from 'sweetalert2'

interface ConfirmOptions {
    title: string;
    message: string;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
    btnAccept?: string;
    btnCancel?: string;
}

export function Alert(title: string, message: string, icon?: 'success' | 'error' | 'warning'): void {
    Swal.fire({
        title: title || 'Alerta',
        text: message,
        icon: icon || 'info',
        confirmButtonText: 'Aceptar'
    });
}

export function ConfirmAlert(options: ConfirmOptions): Promise<boolean> {
    return Swal.fire({
        title: options.title || 'Confirmación',
        text: options.message,
        icon: options.icon || 'warning',
        showCancelButton: true,
        confirmButtonText: options.btnAccept || 'Aceptar',
        cancelButtonText: options.btnCancel || 'Cancelar'
    }).then((result) => {
        return result.isConfirmed;
    });
}