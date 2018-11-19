import style from './style';

export default class Toast {

    render({toast, dismiss}) {
        if (!toast.message) {
            return;
        }

        let toastStyles = [style.toast, style[`toast--${toast.type}`]].join(' ');
        let typeName = toast.type[0].toUpperCase() + toast.type.substring(1,toast.type.length).toLowerCase();

        setTimeout(dismiss, 3000);

        return (
            <div class={toastStyles}>
                <b>{typeName}:</b> {toast.message}
            </div>
        )
    }
}
