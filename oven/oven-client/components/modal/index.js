import Portal from 'preact-portal';
import style from './style';

export default ({ open, onDismiss, children }) => {

    const modalStyles = [style.modal];

    if (open) {
        modalStyles.push(style.open);
    }

    return (
        <Portal into="body">
            <div class={modalStyles.join(' ')}>
                <div class={style.backdrop} onClick={onDismiss} />
                <div class={style.inner}>
                    {children}
                </div>
            </div>
        </Portal>
    );
}
