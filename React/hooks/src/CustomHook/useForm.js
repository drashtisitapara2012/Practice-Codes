import { useState } from "react";

function useForm(initialValues, validation) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleSubmit = (callback) => (e) => {
        e.preventDefalut();
        const validationError = validation(values);
        setErrors(validationError);
        if (Object.keys(validationError).length === 0) {
            callback(values);
        }
    };
    return {
        values,
        errors,
        handleChange,
        handleSubmit,
    };
}
export default useForm;