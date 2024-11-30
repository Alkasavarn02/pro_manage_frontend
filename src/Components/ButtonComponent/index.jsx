import styles from "./Button.module.css";

const CustomButton = ({ title, onClick, buttonType, type, classes, disabled}) => {
    return (  
        <button
            className={`${styles['custom-button']} ${styles[buttonType]} ${classes || ""}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            { title }
        </button>
    );
};

export default CustomButton;